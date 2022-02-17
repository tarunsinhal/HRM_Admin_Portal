from django.shortcuts import render
from .forms import SuggestionForm
from .models import SuggestionModel


# Create your views here.
def suggestion(request):
    if request.user.is_staff :
        all_suggestions = SuggestionModel.objects.all()[::-1][:7]
        return render(request, 'suggestion/suggestion_list.html',{'all_suggestions':all_suggestions})

    if request.method == 'POST':
        form = SuggestionForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, 'suggestion/thankyou.html')
    else:
        form = SuggestionForm()
    return render(request,'suggestion/suggestion.html',{'form':form})


def suggestion_list(request):
    all_suggestions = SuggestionModel.objects.all()[::-1]
    return render(request, 'suggestion/allsuggestion_list.html',{'all_suggestions':all_suggestions})