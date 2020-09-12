from rest_framework import viewsets, serializers
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from rest_framework.response import Response

from delivery.models import Address, DeliveryType
from delivery.providers import YANDEX
from delivery.providers.yandex import YandexDeliveryPlugin
from delivery.utils import get_dadata_suggest
from shop.models import Shop


class CompleteView(viewsets.ViewSet):
    def list(self, request, format=None):
        address = request.query_params.get('address')

        if not address:
            raise ParseError(detail='No address')

        dadata_suggest = get_dadata_suggest(address)
        return Response(dadata_suggest)


class OptionsView(viewsets.ViewSet):
    def list(self, request, format=None):
        address = request.query_params['address']
        value = request.query_params['value']

        to = Address.objects.get_or_create(address)

        shop = Shop.objects.first()
        delivery_types = DeliveryType.objects.filter(shop=shop)
        delivery_options = {}

        yandex_delivery_types = [delivery_type for delivery_type in delivery_types if delivery_type.provider == YANDEX]
        for delivery_type in yandex_delivery_types:
            delivery_options[delivery_type.code] = YandexDeliveryPlugin.get_optimal(delivery_type, to, value).to_dict()

        return Response(delivery_options)

    @action(detail=False)
    def types(self, request):
        shop = Shop.objects.get()
        types = DeliveryType.objects.filter(shop=shop).values_list('code', flat=True)
        return Response(types)


class DeliveryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryType
        fields = ['code', 'name']


class TypesView(viewsets.ReadOnlyModelViewSet):
    queryset = DeliveryType.objects.all()
    serializer_class = DeliveryTypeSerializer
