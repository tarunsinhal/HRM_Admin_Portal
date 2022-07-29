#!/bin/sh

python manage.py collectstatic --no-input
gunicorn Admin_portal.wsgi:application --bind 0.0.0.0:9000