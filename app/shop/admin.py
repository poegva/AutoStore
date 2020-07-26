from django.contrib import admin

from shop.models import Shop, Item, Order, OrderItem

admin.site.register(Shop)
admin.site.register(Item)

admin.site.register(Order)
admin.site.register(OrderItem)
