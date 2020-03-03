from django.shortcuts import render
from django.http import HttpResponse
from .serializers import EventSerializer, TagSerializer
from rest_framework import generics
from .models import Event,EventTag

#Optional optimization feature, only use if needed
#REQUIRES: upper limit timestamp to query results from (optional parameter), direction to query events from
#if none specified, will either load from first event (if system time is before first event or after last event)
#or will load first event that hasn't started yet. (if systemtime is during the con)
#MODIFIES: none
#EFFECTS: loads up the next or previous 10 (adjustable) events on the event roster, or less, if not enough events to query for

#regular serializer was more than enough lol
class EventListing(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by('start_time')
    serializer_class = EventSerializer 

class TagListing(generics.ListCreateAPIView):
    queryset = EventTag.objects.all()
    serializer_class = TagSerializer
