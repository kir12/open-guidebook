from django.contrib import admin
from .models import *

#TODO: possibly add event tags 
class EventAdmin(admin.ModelAdmin):
    filter_horizontal=('tags',)    
    list_display=('title','start_time','end_time','location')

admin.site.register(Location)
admin.site.register(EventTag)
admin.site.register(Event,EventAdmin)
admin.site.register(Attendee)

# Register your models here.
