from rest_framework import serializers
from .models import Event, Location, EventTag

#additional serializers
class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTag
        fields=('tag','tag_screen')
    tag_screen = serializers.SerializerMethodField('get_screen_tag')

    def get_screen_tag(self,obj):
        return str(obj)

#serializer for Event class
class EventSerializer(serializers.ModelSerializer):
    location = serializers.StringRelatedField()
    tags = TagSerializer(many=True)
    class Meta:
        model = Event
        fields='__all__'

#TODO: add separate serializer that pulls up description
