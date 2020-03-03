from django.urls import path
from . import views

urlpatterns = [
    path('api/events',views.EventListing.as_view()),
    path('api/eventTags',views.TagListing.as_view())
]
