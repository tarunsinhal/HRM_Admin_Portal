"""
This file contains the admin configuration for the suggestions app.
"""
from django.contrib import admin
from suggestions.models import SuggestionModel, SuggestionCategory, SuggestionStatus


# Register your models here.


@admin.register(SuggestionModel)
class SuggestionAdmin(admin.ModelAdmin):
    """
    This class is used to register the SuggestionModel in the admin panel.
    """
    list_display = (
        "id",
        "name",
        "suggestion",
        "created_at",
        "comment",
        "suggestion_category",
        "suggestion_status",
        "history",
    )


@admin.register(SuggestionCategory)
class SuggestionCategoryAdmin(admin.ModelAdmin):
    """
    This class is used to register the SuggestionCategory in the admin panel.
    """
    list_display = (
        "id",
        "category",
    )


@admin.register(SuggestionStatus)
class SuggestionStatusAdmin(admin.ModelAdmin):
    """
    This class is used to register the SuggestionStatus in the admin panel.
    """
    list_display = (
        "id",
        "status",
    )
