from delivery.models import DeliveryType, Address, Delivery, Shipment
from delivery.providers.base import ProviderPluginBase, DeliveryOption


class ManualProviderPlugin(ProviderPluginBase):

    @classmethod
    def get_optimal(cls, delivery_type: DeliveryType, to: Address, items_value: int) -> DeliveryOption:
        return DeliveryOption(
            delivery_type.added_price_fixed,
            delivery_type.extra.get('date', 'неизвестно'),
            extra=delivery_type.extra.get('comment')
        )

    @classmethod
    def get_pickup_points(cls, delivery_type: DeliveryType, to: Address):
        return []

    @classmethod
    def submit_delivery(cls, delivery: Delivery):
        pass

    @classmethod
    def refresh_delivery(cls, delivery: Delivery):
        pass

    @classmethod
    def request_shipments(cls):
        pass

    @classmethod
    def refresh_shipment(cls, shipment: Shipment):
        pass
