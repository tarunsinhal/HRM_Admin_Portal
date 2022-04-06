"""
This file contains the urls for the suggestion app.
"""

# create urls.py
from django.urls import path
from . import views

app_name = "suggestions" #  pylint: disable=invalid-name
urlpatterns = [
    path("", views.suggestion, name="suggestion"),
    path("all/", views.suggestion_list, name="suggestionall"),
    path("edit/<int:pk>/", views.update_suggestion, name="suggestionedit"),
    path("history/<int:pk>/", views.version_history, name="history"),
]
