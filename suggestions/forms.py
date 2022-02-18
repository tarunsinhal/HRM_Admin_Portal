# create  a form for suggestion

from django import forms
from suggestions.models import SuggestionModel


class SuggestionForm(forms.ModelForm):
    class Meta:
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
