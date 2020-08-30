import json

import requests
from rest_framework import viewsets
from rest_framework.exceptions import ParseError
from rest_framework.response import Response

from delivery.providers.yandex.plugin import YandexDeliveryPlugin
from delivery.utils import convert_option
from shop.models import Shop


class CompleteView(viewsets.ViewSet):
    def list(self, request, format=None):
        address = request.query_params.get('address')

        if not address:
            raise ParseError(detail='No address')

        ahunter_response = requests.get(
            'http://ahunter.ru/site/suggest/address',
            params={'output': 'json', 'query': address}
        )

        if ahunter_response.status_code == 200:
            return Response(ahunter_response.json())
        else:
            return Response(status=ahunter_response.status_code)


class OptionsView(viewsets.ViewSet):
    def list(self, request, format=None):
        address = request.query_params['address']
        value = request.query_params['value']

        shop = Shop.objects.first()

        if shop.delivery_provider == Shop.YANDEX:
            delivery_types = YandexDeliveryPlugin.supported_types
            delivery_options = {
                delivery_type: YandexDeliveryPlugin.get_optimal_option(shop, delivery_type, address, value)
                for delivery_type in delivery_types
            }
            return Response({
                delivery_type: convert_option(delivery_options[delivery_type], delivery_type)
                for delivery_type in delivery_types
                if delivery_options[delivery_type]
            })
        else:
            raise NotImplementedError
