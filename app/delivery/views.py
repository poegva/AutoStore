import json

import requests
from rest_framework import viewsets
from rest_framework.response import Response

from delivery.utils import convert_option, get_optimal_delivery


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
    def list(self, request, format=None):
        address = request.query_params['address']
        value = request.query_params['value']

        optimal_post = get_optimal_delivery(address, 'POST', value)
        optimal_courier = get_optimal_delivery(address, 'COURIER',  value)

        return Response({
            'POST': convert_option(optimal_post),
            'COURIER': convert_option(optimal_courier)
        })
