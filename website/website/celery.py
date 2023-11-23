from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
from datetime import timedelta
#celery -A website worker --loglevel=info
#celery -A website.celery beat --loglevel=info
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'website.settings')

app = Celery('website')

# Load task modules from all registered Django app configs.
app.config_from_object('django.conf:settings', namespace='CELERY')


app.conf.beat_schedule = {
    'process-magic-key': {
        'task': 'store.tasks.my_periodic_bitcoin_price',
        'schedule': timedelta(seconds=60),
    },
}

app.autodiscover_tasks()

if __name__ == '__main__':
    app.start()
