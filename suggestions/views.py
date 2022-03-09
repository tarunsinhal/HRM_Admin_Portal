from django.http import JsonResponse
from django.shortcuts import render, redirect
from suggestions.forms import SuggestionForm
from suggestions.models import SuggestionModel, SuggestionCategory, SuggestionStatus
from django.core import serializers
import json
from django.contrib.auth.models import User

# Create your views here.
def suggestion(request):
    if request.user.is_staff:
        all_suggestions = SuggestionModel.objects.all()[::-1][:7]
        form = SuggestionForm()
        return render(
            request,
            "suggestion/suggestion_list.html",
            {"all_suggestions": all_suggestions, "form": form},
        )

    if request.method == "POST":
        form = SuggestionForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, "suggestion/thankyou.html")
    else:
        form = SuggestionForm()
    return render(request, "suggestion/suggestion.html", {"form": form})


def suggestion_list(request):
    all_suggestions = SuggestionModel.objects.all()[::-1]
    return render(
        request,
        "suggestion/allsuggestion_list.html",
        {"all_suggestions": all_suggestions},
    )


def update_suggestion(request, pk):
    if request.method == "POST":
        [option, comment] = json.load(request)["data"]
        suggestion = SuggestionModel.objects.get(id=pk)
        suggestion.comment = comment
        suggestion.save()
        status = SuggestionStatus.objects.get(id=option)
        SuggestionModel.objects.filter(id=pk).update(suggestion_status=status)
        return redirect("/suggestion/")
    else:
        suggestion = SuggestionModel.objects.filter(pk=pk)
        choices = SuggestionStatus.objects.all()
        change_suggestion = {
            "suggestion_category": SuggestionCategory.objects.filter(
                pk=suggestion.values()[0]["suggestion_category_id"]
            ).values()[0]["category"],
            "suggestion_status": SuggestionStatus.objects.filter(
                pk=suggestion.values()[0]["suggestion_status_id"]
            ).values()[0]["status"],
        }
        return JsonResponse(
            {
                "suggestion": serializers.serialize("json", suggestion),
                "change_suggestion": json.dumps(change_suggestion),
                "choices": serializers.serialize("json", choices),
            }
        )


def version_history(request, pk):
    history = SuggestionModel.history.filter(id=pk, history_type="~")
    status = SuggestionStatus.objects.all()
    category = SuggestionCategory.objects.all()
    user = User.objects.all()

    return JsonResponse(
        {
            "history": serializers.serialize("json", history),
            "status": serializers.serialize("json", status),
            "category": serializers.serialize("json", category),
            "user": serializers.serialize("json", user),
        }
    )