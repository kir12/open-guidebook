from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

class Location(models.Model):
    room = models.CharField(max_length=75, unique=True)
    capacity = models.IntegerField(null=True, blank = True)
    def __str__(self):
        return self.room

class EventTag(models.Model):
    class EventTypes(models.TextChoices):
        FANPANEL = "fanpanel", _("Fan Panel")
        GUESTPANEL = "guestpanel", _("Special Guest Panel")
        PERFORMANCE = "performance",_("Performance")
        SCREENING = "screening",_("Anime Screening")
        COSPLAY = "cosplay",_("Cosplay")
        AGELIMIT = "18+",_("18+ (ID Required)")
        GAMING = "gaming",_("Video Gaming")
        AUTOGRAPHS = "autographs",_("Autographs")
    tag = models.CharField(max_length=75, unique=True, choices = EventTypes.choices)
    def __str__(self):
        return str(self.EventTypes(self.tag).label)

#Note: every panel guide/app I've seen does not list panelists, 
#so there's no need to store them here
#can be adjusted if desired
class Event(models.Model):
    title = models.CharField(max_length=75, unique= True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    guest_speakers = models.CharField(blank=True, max_length=100)
    location = models.ForeignKey(Location,on_delete=models.CASCADE)
    remark = models.TextField(blank=True,max_length=100)
    description = models.TextField(max_length=800)
    tags = models.ManyToManyField(EventTag)
    def __str__(self):
        return self.title

class Attendee(models.Model):
    #TODO: replace with google auth login
    user = models.OneToOneField(User, on_delete = models.CASCADE, blank = True)
    screenname = models.CharField(max_length=75,blank=True)
    liked_events = models.ManyToManyField(Event,blank=True,related_name='likees')
    #TODO: add __str__ stuff once user auth info has been processed
