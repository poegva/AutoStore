from delivery.models import YANDEX, MANUAL, DOSTAVISTA
from delivery.providers.dostavista import DostavistaPlugin
from delivery.providers.manual import ManualProviderPlugin
from delivery.providers.yandex import YandexDeliveryPlugin

# Providers

PROVIDERS = {
    YANDEX: YandexDeliveryPlugin,
    MANUAL: ManualProviderPlugin,
    DOSTAVISTA: DostavistaPlugin,
}
