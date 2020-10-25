import json

import requests

from delivery.models import DeliveryType, Address, Delivery, Shipment, DeliveryProviderConfiguration
from delivery.providers.base import ProviderPluginBase, DeliveryOption
from store import settings


def delivery_option_from_api_data(delivery_type, api_option):
    return DeliveryOption(
        cost=float(api_option['order']['payment_amount']),
        date='в течении 2 часов'
    )


def filter_phone(phone):
    for c in '- ()':
        phone = phone.replace(c, '')
    return phone


class DostavistaPlugin(ProviderPluginBase):
    code = 'DOSTAVISTA'
    endpoint = settings.DOSTAVISTA_API_ENDPOINT

    supported_types = ['COURIER']

    shop_configuration = {
        'AuthToken': 'Токен авторизации API',
        'Matter': 'Содержимое посылок',
        'WarehouseAddress': 'Адрес склада',
        'WarehousePhone': 'Телефон склада',
        'City': 'Город'
    }

    type_configuration = {}

    @classmethod
    def get_optimal(cls, delivery_type: DeliveryType, to: Address, items_value: int, phone: str) -> DeliveryOption:
        assert delivery_type.provider == cls.code
        config = cls.get_config(delivery_type.shop_id)

        optimal_option = cls.request_optimal(delivery_type, to, items_value, phone, config)

        return delivery_option_from_api_data(delivery_type, optimal_option) if optimal_option else None

    @classmethod
    def submit_delivery(cls, delivery: Delivery):
        assert delivery.type.provider == cls.code
        config = cls.get_config(delivery.type.shop_id)
        cls.request_submit(delivery, config)

    @classmethod
    def refresh_delivery(cls, delivery: Delivery):
        config = cls.get_config(delivery.type.shop_id)

        response = requests.get(
            cls.endpoint + '/orders',
            headers={
                'X-DV-Auth-Token': config['AuthToken']
            },
            params={
                'order_id': delivery.external_id
            }
        )
        result = response.json()

        if response.status_code == 200:
            status = result['orders'][0]['status']
            print(f'Доставка по заказу {delivery.order_id}, статус {status}')
            if status == 'available' and delivery.status == Delivery.SUBMITTED:
                delivery.status = Delivery.APPROVED
            elif status == 'active' and delivery.status == Delivery.APPROVED:
                delivery.status = Delivery.IN_DELIVERY
            elif status == 'completed':
                delivery.status = Delivery.COMPLETED
            elif status == 'canceled':
                delivery.status = Delivery.CANCELED
            delivery.save(update_fields=['status'])


    # Helper methods

    @classmethod
    def get_config(cls, shop_id):
        provider_configuration = DeliveryProviderConfiguration.objects.get(
            shop_id=shop_id, provider=cls.code
        )
        return provider_configuration.config

    @classmethod
    def request_optimal(cls, delivery_type: DeliveryType, to: Address, items_value: int, phone: str, config):

        if config['City'] not in to.settlement and config['City'] not in to.region:
            return None

        data = {
            'matter': config['Matter'],
            'total_weight_kg': 1,
            'insurance_amount': str(items_value),
            'payment_method': 'non_cash',
            'points': [
                {
                    'address': config['WarehouseAddress'],
                    'contact_person': {
                        'phone': config['WarehousePhone']
                    }
                },
                {
                    'address': to.value,
                    'contact_person': {
                        'phone': filter_phone(phone)
                    }
                }
            ]
        }

        response = requests.post(
            cls.endpoint + '/calculate-order',
            headers={
                'Content-Type': 'application/json',
                'X-DV-Auth-Token': config['AuthToken']
            },
            data=json.dumps(data).encode('utf-8')
        )
        result = response.json()

        if response.status_code == 200:
            return result
        else:
            return None

    @classmethod
    def request_submit(cls, delivery: Delivery, config):

        if config['City'] not in delivery.to.settlement and config['City'] not in delivery.to.region:
            return False

        data = {
            'matter': config['Matter'],
            'total_weight_kg': 1,
            'insurance_amount': str(delivery.order.items_cost),
            'payment_method': 'non_cash',
            'points': [
                {
                    'address': config['WarehouseAddress'],
                    'contact_person': {
                        'phone': config['WarehousePhone']
                    }
                },
                {
                    'address': delivery.to.value,
                    'contact_person': {
                        'phone': filter_phone(delivery.recipient.phone)
                    }
                }
            ]
        }

        response = requests.post(
            cls.endpoint + '/create-order',
            headers={
                'Content-Type': 'application/json',
                'X-DV-Auth-Token': config['AuthToken']
            },
            data=json.dumps(data).encode('utf-8')
        )
        result = response.json()

        if response.status_code == 200:
            delivery.external_id = result['order']['order_id']
            delivery.status = Delivery.SUBMITTED
            delivery.save(update_fields=['external_id', 'status'])
        else:
            return None

