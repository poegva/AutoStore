"""store URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from frontend import views as frontend_views

from shop.views import ItemViewSet, OrderViewSet, OrderItemViewSet
from store import settings

api_router = routers.DefaultRouter()
api_router.register(r'items', ItemViewSet)
api_router.register(r'orders', OrderViewSet)
api_router.register(r'order_items', OrderItemViewSet)

urlpatterns = static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + [
    path('admin/', admin.site.urls),

    path('api/', include(api_router.urls)),

    path('', frontend_views.index),
    path('<path:path>', frontend_views.index),
]
