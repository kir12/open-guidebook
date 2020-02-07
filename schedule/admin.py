from django.contrib import admin
from .models import *

class AttendeeAdmin(admin.TabularInline):
    model=Attendee.hosted_events.through

#TODO: possibly add event tags 
class EventAdmin(admin.ModelAdmin):
    filter_horizontal=('tags',)    
    list_display=('title','start_time','end_time','location')
    inlines=[AttendeeAdmin]

admin.site.register(Location)
admin.site.register(EventTag)
admin.site.register(Event,EventAdmin)
admin.site.register(Attendee)

# Register your models here.
