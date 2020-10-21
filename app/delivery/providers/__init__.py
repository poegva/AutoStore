from delivery.models import YANDEX, MANUAL
from delivery.providers.manual import ManualProviderPlugin
from delivery.providers.yandex import YandexDeliveryPlugin

# Providers

PROVIDERS = {
    YANDEX: YandexDeliveryPlugin,
    MANUAL: ManualProviderPlugin
}
