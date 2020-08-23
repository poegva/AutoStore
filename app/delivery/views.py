import json

import requests
from rest_framework import viewsets
from rest_framework.exceptions import ParseError
from rest_framework.response import Response

from delivery.utils import convert_option, get_optimal_delivery, get_complete_address


class CompleteView(viewsets.ViewSet):
    def list(self, request, format=None):
        address = request.query_params.get('address')

        if not address:
            raise ParseError(detail='No address')

        return Response(get_complete_address(address))


class OptionsView(viewsets.ViewSet):
    def list(self, request, format=None):
        address = request.query_params['address']
        value = request.query_params['value']

        optimal_post = get_optimal_delivery(address, 'POST', value)
        optimal_courier = get_optimal_delivery(address, 'COURIER',  value)

        return Response({
            'POST': convert_option(optimal_post) if optimal_post else None,
            'COURIER': convert_option(optimal_courier) if optimal_courier else None
        })
