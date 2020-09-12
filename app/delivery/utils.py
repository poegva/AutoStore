import logging
from math import sin, cos, sqrt, atan2, radians

from dadata import Dadata

from store import settings

log = logging.getLogger(__name__)


def get_dadata_suggest(address):
    dadata = Dadata(settings.DADATA_APIKEY, settings.DADATA_SECRET)

    try:
        return dadata.suggest(name='address', query=address)
    except Exception as e:
        log.error('Dadata request exception ' + str(e))
        return None


def geo_distance(lat1, lon1, lat2, lon2):
    lat1r, lon1r, lat2r, lon2r = radians(float(lat1)), radians(float(lon1)), radians(float(lat2)), radians(float(lon2))

    dlon, dlat = lon2r - lon1r, lat2r - lat1r

    a = sin(dlat / 2) ** 2 + cos(lat1r) * cos(lat2r) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return 6373.0 * c
