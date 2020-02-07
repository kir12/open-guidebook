from django.db import models

class Location(models.Model):
    room = models.CharField(max_length=75)
    capacity = models.IntegerField(null=True, blank = True)

class EventTag(models.Model):
    #TODO: add more event types later as requested
    EVENT_TYPES=[
        ('fanpanel','Fan Panel'),
        ('guest','Special Guest Panel'),
        ('performance','Performance'),
        ('anime','Anime Screening'),
        ('cosplay','Cosplay'),
        ('18+','18+ (ID Required)'),
        ('videogaming','Video Gaming'),
        ('autograph','Autographs'),
    ]
    tag = models.CharField(max_length=75, unique=True, choices = EVENT_TYPES)

class Event(models.Model):
    title = models.CharField(max_length=75)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.ForeignKey(Location,on_delete=models.CASCADE)
    description = models.TextField(max_length=300)
    tags = models.ManyToManyField(EventTag)

#all panelists are also attendees
class Attendee(models.Model):
    first_name = models.CharField(max_length=75)
    last_name = models.CharField(max_length=75)
    screenname = models.CharField(max_length=75,blank=True)
    hosted_events = models.ManytoManyField(Event,null=True,blank=True) 
    liked_events = models.ManyToManyField(Event,null=True,blank=True)
    #optional: phone number and email
    #todo: user and password
