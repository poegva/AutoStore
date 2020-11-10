from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets, serializers
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from rest_framework.response import Response

from delivery.models import Address, DeliveryType
from delivery.providers import YANDEX, PROVIDERS
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
    def get_types(self, shop):
        now = timezone.now().time()
        return (
            DeliveryType.objects
            .filter(active=True, shop=shop)
            .filter(
                Q(start_time__isnull=True) |
                Q(start_time__isnull=True) |
                Q(start_time__lte=now, end_time__gte=now)
            )
        )

    def list(self, request, format=None):
        address = request.query_params['address']
        value = request.query_params['value']
        phone = request.query_params.get('phone', '')

        to = Address.objects.get_or_create(address)

        shop = Shop.objects.first()
        delivery_types = self.get_types(shop)
        delivery_options = {}

        for delivery_type in delivery_types:
            option = PROVIDERS[delivery_type.provider].get_optimal(delivery_type, to, value, phone)
            delivery_options[delivery_type.code] = option.to_dict() if option else None

        return Response(delivery_options)

    @action(detail=False)
    def types(self, request):
        shop = Shop.objects.get()
        types = self.get_types(shop).values_list('code', flat=True)
        return Response(types)


class DeliveryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryType
        fields = ['code', 'name']


class TypesView(viewsets.ReadOnlyModelViewSet):
    queryset = DeliveryType.objects.all()
    serializer_class = DeliveryTypeSerializer
