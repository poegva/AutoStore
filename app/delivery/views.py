import requests
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView


class CompleteView(viewsets.ViewSet):
    def list(self, request, format=None):
        address = request.query_params['address']

        result = requests.get(
            f'https://api.delivery.yandex.ru/location?term={address}',
            headers={
                'Content-Type': 'application/json',
                'Authorization': 'OAuth AgAAAABDt7svAAaJeBQNRE36jEfHi32Bl2XK5Lc'
            }
        )

        return Response({'data': result.json()})
