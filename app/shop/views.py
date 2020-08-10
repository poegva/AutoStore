from django.shortcuts import render, get_object_or_404
from django.utils.crypto import get_random_string
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers, viewsets
from rest_framework.response import Response

from shop.models import Shop, Item, Order, OrderItem


class ItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'price', 'image']


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())

    class Meta:
        model = OrderItem
        fields = ['item', 'quantity']


class OrderSerializer(serializers.HyperlinkedModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'name', 'email', 'phone', 'items', 'address', 'delivery_option']


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):

        create_data = {
            'name': 'Долбоеб',
            'phone': '+7999999999',
            'email': 'p@yandex.ru',
            'address': {},
            'delivery_option': 'POST',
            'items': [],
        }

        order_serializer = self.get_serializer(data=create_data)
        order_serializer.is_valid(raise_exception=True)
        order = order_serializer.save(token=get_random_string(length=32))

        item_serializer = OrderItemSerializer(data=request.data['items'], many=True)
        item_serializer.is_valid(raise_exception=True)
        item_serializer.save(order=order)

        return Response({
            'order': order.id,
            'token': order.token,
            'paymentUrl': f'http://localhost:9000/order'
        }, status=200)


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['order']