from django.contrib import admin

from shop.models import Shop, Item, Order, OrderItem, OrderNotification

admin.site.register(Shop)
admin.site.register(Item)

admin.site.register(Order)
admin.site.register(OrderItem)

admin.site.register(OrderNotification)
