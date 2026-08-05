from rest_framework import serializers

from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'second_last_name',
            'is_platform_admin',
            'worker_type',
            'is_active',
        ]
        read_only_fields = ['id']


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'username',
            'first_name',
            'last_name',
            'second_last_name',
            'worker_type',
            'is_platform_admin',
        ]

    def create(self, validated_data):
        generated_password = CustomUser.generate_random_password()
        user = CustomUser(**validated_data)
        user.set_password(generated_password)
        user.save()
        return user, generated_password


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'first_name',
            'last_name',
            'second_last_name',
            'worker_type',
            'is_platform_admin',
            'is_active',
        ]
