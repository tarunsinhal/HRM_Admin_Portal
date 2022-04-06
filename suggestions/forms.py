"""
This file contains the forms for the suggestions app.
"""

# create  a form for suggestion

from django import forms
from suggestions.models import SuggestionModel


class SuggestionForm(forms.ModelForm):
    """
    This class is used to create a form for the suggestion.
    """
    class Meta: # pylint: disable=too-few-public-methods
        """
        This class is used to create a meta class for the form.
        """
        model = SuggestionModel
        fields = ["name", "suggestion", "suggestion_category", "suggestion_status"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "input100", "placeholder": "Name"}),
            "suggestion": forms.Textarea(
                attrs={"class": "input100", "placeholder": "Suggestion", "rows": "5"}
            ),
            "suggestion_category": forms.Select(
                attrs={"class": "input100", "placeholder": "Category"},
            ),
            "suggestion_status": forms.Select(
                attrs={"placeholder": "Status"},
            ),
        }
