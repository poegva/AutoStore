from django.shortcuts import render, get_object_or_404
from django.utils.crypto import get_random_string
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers, viewsets
from rest_framework.response import Response

from payment.utils import get_or_create_payment
from shop.models import Shop, Item, Order, OrderItem


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'price', 'image']


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer()

    class Meta:
        model = OrderItem
        fields = ['item', 'quantity']


class OrderItemCreateSerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())

    class Meta:
        model = OrderItem
        fields = ['item', 'quantity']


class OrderSerializer(serializers.HyperlinkedModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    token = serializers.ReadOnlyField()
    payment = serializers.SerializerMethodField(method_name='get_payment')

    def get_state(self, order):
        return 'PAYMENT'

    def get_payment(self, order):
        payment, new, reason = get_or_create_payment(order)
        return {
            'token': payment.confirmation_token,
            'cancellation_reason': reason,
            'new': new,
        }

    class Meta:
        model = Order
        fields = [
            'id', 'name', 'email', 'phone', 'items', 'address', 'delivery_option', 'token', 'status', 'payment'
        ]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        order_serializer = self.get_serializer(data=request.data)
        order_serializer.is_valid(raise_exception=True)
        order = order_serializer.save(token=get_random_string(length=32), status=Order.WAITING_PAYMENT)

        item_serializer = OrderItemCreateSerializer(data=request.data['items'], many=True)
        item_serializer.is_valid(raise_exception=True)
        item_serializer.save(order=order)

        data = self.get_serializer(order).data

        return Response(data, status=200)

    def retrieve(self, request, pk=None, *args, **kwargs):
        order = get_object_or_404(self.queryset, pk=pk)
        return Response(self.get_serializer(order).data, status=200)