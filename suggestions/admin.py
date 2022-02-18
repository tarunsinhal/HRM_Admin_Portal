from django.contrib import admin
from suggestions.models import SuggestionModel, SuggestionCategory, SuggestionStatus
from simple_history.admin import SimpleHistoryAdmin


# Register your models here.


@admin.register(SuggestionModel)
class SuggestionAdmin(admin.ModelAdmin):
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
    list_display = (
        "id",
        "category",
    )


@admin.register(SuggestionStatus)
class SuggestionStatusAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "status",
    )
