"""
This file contains the utils of operations app.
"""
from itertools import chain
from django.contrib.auth.models import User

def paid_by_list(model_name):
    """This function is used for fetch and return the list of users."""
    users = User.objects.all().values_list('username', flat=True)
    paid_by_names = model_name.objects.all().values_list('paid_by', flat=True)
    distinct_values = set(chain(users, paid_by_names))
    PAID_BY = []
    for value in distinct_values:
        PAID_BY.append(value)
    PAID_BY.append("Other")
    return PAID_BY


def load_previous_history(model_name, recent_id, history_id):
    """
    This function is used for load previous history of particular model.
    """
    res = list(model_name.history.filter(id=recent_id).order_by('-history_id').values())
    a = 0
    current_data = {}
    for i in res:
        if int(i['history_id']) == int(history_id):
            current_data = i
            a = res.index(i)
            break

    data = {}
    previous_data = res[a+1]
    for i in current_data:
        if i not in ('history_date', 'history_id', 'history_type'):
            if current_data[i] != previous_data[i]:
                data[i] = {'current': current_data[i], 'previous': previous_data[i]}
    return data

def import_func(data_set, resource):
    """
    This function is used for import data.
    """
    result = resource.import_data(
                                    data_set,
                                    dry_run=False,
                                    collect_failed_rows=True,
                                    raise_errors=True,
                                )

    return result
