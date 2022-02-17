from unicodedata import name
from django.db import models

# Create your models here.

class SuggestionModel(models.Model):
    name = models.CharField(max_length=120,blank=True,null=True)
    suggestion = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    