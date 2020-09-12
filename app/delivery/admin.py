from django.contrib import admin

from delivery.models import *

admin.site.register(DeliveryType)
admin.site.register(DeliveryProviderConfiguration)
admin.site.register(Warehouse)
admin.site.register(Address)
admin.site.register(Package)
admin.site.register(Recipient)
admin.site.register(Delivery)
