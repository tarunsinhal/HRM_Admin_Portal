from django import forms
from .models import SuggestionModel


class SuggestionForm(forms.ModelForm):
    class Meta:
        model = SuggestionModel
        fields = ['name', 'suggestion']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'input100', 'placeholder': 'Name'}),
            'suggestion': forms.Textarea(attrs={'class': 'input100', 'placeholder': 'Suggestion','rows':'5'}),
        }