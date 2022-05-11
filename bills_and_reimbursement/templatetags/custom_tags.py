from django.template import Library
import os.path

register = Library()

@register.filter
def amount_total(data_list):
    s=0
    for data in data_list:
        s += data['amount']
    return s

@register.filter
def extName(imgName):
    name, extension = os.path.splitext(imgName)
    if extension == '.pdf' or extension == '.docx':
        return True
    else:
        return False
