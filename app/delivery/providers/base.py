from math import ceil

from delivery.models import Address, DeliveryType, Delivery, Shipment
from shop.models import Shop


class DeliveryOption:
    def __init__(self, cost, date, extra=None):
        self.cost = cost
        self.date = date
        assert extra is None or isinstance(extra, dict)
        self.extra = extra

    def to_dict(self):
        return {
            'cost': int(ceil(self.cost)),
            'date': self.date,
            'extra': self.extra
        }


class ProviderPluginBase:

    @classmethod
    def get_optimal(cls, delivery_type: DeliveryType, to: Address, items_value: int) -> DeliveryOption:
        pass

    @classmethod
    def get_pickup_points(cls, delivery_type: DeliveryType, to: Address):
        pass

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
