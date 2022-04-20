from django.template import Library

register = Library()

@register.filter
def amount_total(data_list):
    s=0
    for data in data_list:
        s += data['amount']
    return s