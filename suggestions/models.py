"""
This file contains the models for the suggestions app.
"""
from django.db import models
from simple_history.models import HistoricalRecords

# Create your models here.


class SuggestionCategory(models.Model):
    """
    This class is used to create a model for the suggestion category.
    """
    category = models.CharField(max_length=50)

    def __str__(self):
        return str(self.category)


class SuggestionStatus(models.Model):
    """
    This class is used to create a model for the suggestion status.
    """
    status = models.CharField(max_length=50)

    def __str__(self):
        return str(self.status)


class SuggestionModel(models.Model):
    """
    This class is used to create a model for the suggestion.
    """
    name = models.CharField(max_length=120, blank=True, null=True)
    suggestion = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    history = HistoricalRecords()
    suggestion_category = models.ForeignKey(
        SuggestionCategory, on_delete=models.CASCADE
    )
    suggestion_status = models.ForeignKey(
        SuggestionStatus,
        on_delete=models.CASCADE,
        related_name="suggestion_status",
        default=1,
    )
    comment = models.TextField(blank=True, null=True)
