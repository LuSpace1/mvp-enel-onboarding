from rest_framework import serializers

from .models import VideoLink


class VideoLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoLink
        fields = [
            "id",
            "title",
            "youtube_url",
            "section_identifier",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
