import json

import requests
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView


class CompleteView(viewsets.ViewSet):
    def list(self, request, format=None):
        address = request.query_params['address']

        response = requests.get(
            f'https://api.delivery.yandex.ru/location?term={address}',
            headers={
                'Content-Type': 'application/json',
                'Authorization': 'OAuth AgAAAABDt7svAAaJeBQNRE36jEfHi32Bl2XK5Lc'
            }
        )

        return Response(response.json())


class OptionsView(viewsets.ViewSet):
    def get_optimal_option(self, address, value, delivery_type):
        data = {
            'senderId': 500001942,
            'from': {
                'location': 'г.Москва, ул. Складочная, д. 1',
                'geoId': 213
            },
            'to': {
                'location': address
            },
            'dimensions': {
                'length': 26,
                'height': 17,
                'width': 8,
                'weight': 0.2
            },
            'deliveryType': delivery_type,
            'shipment': {
                'date': '2020-08-10',
                'type': 'WITHDRAW',
                'warehouseId': 10001565560
            },
            'cost': {
                'assesedValue': value,
                'itemsSum': 0,
                'manualDeliveryForCustomer': 0,
                'fullyPrepaid': True
            }
        }
        response = requests.put(
            'https://api.delivery.yandex.ru/delivery-options',
            headers={
                'Content-Type': 'application/json',
                'Authorization': 'OAuth AgAAAABDt7svAAaJeBQNRE36jEfHi32Bl2XK5Lc'
            },
            data=json.dumps(data).encode('utf-8')
        )
        result = response.json()
        return None if len(result) == 0 else result[0]

    def list(self, request, format=None):
        address = request.query_params['address']
        value = request.query_params['value']

        optimal_post = self.get_optimal_option(address, value, 'POST')
        optimal_courier = self.get_optimal_option(address, value, 'COURIER')

        return Response({
            'POST': optimal_post,
            'COURIER': optimal_courier
        })
