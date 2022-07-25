"""
This file contains the urls for the suggestion app.
"""

# create urls.py
from django.urls import path
from django.contrib.auth.decorators import permission_required
from . import views

app_name = "suggestions" #  pylint: disable=invalid-name
urlpatterns = [
    path("", permission_required('suggestions.view_suggestionmodel',
                        )(views.suggestion), name="suggestion"),
    path("edit/<int:pk>/", views.update_suggestion, name="suggestionedit"),
    path("history/<int:pk>/", views.version_history, name="history"),
]
