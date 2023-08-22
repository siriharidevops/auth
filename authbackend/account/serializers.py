from datetime import datetime, timedelta
import random
from django.conf import settings
from rest_framework import serializers
from .utils import send_otp

from .models import UserModel



class UserSerializer(serializers.ModelSerializer):
    """
    User Serializer.

    Used in POST and GET
    """

    password1 = serializers.CharField(
        write_only=True,
        min_length=settings.MIN_PASSWORD_LENGTH,
        error_messages={
            "min_length": "Password must be longer than {} characters".format(
                settings.MIN_PASSWORD_LENGTH
            )
        },
    )
    password2 = serializers.CharField(
        write_only=True,
        min_length=settings.MIN_PASSWORD_LENGTH,
        error_messages={
            "min_length": "Password must be longer than {} characters".format(
                settings.MIN_PASSWORD_LENGTH
            )
        },
    )

    class Meta:
        model = UserModel
        fields = (
            "id",
            "name",
            "phone_number",
            "password1",
            "password2"
        )
        read_only_fields = ("id",)

    def validate(self, data):
        """
        Validates if both password are same or not.
        """

        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("Passwords do not match")
        return data
    

    def create(self, validated_data):
        """
        Create method.

        Used to create the user
        """
        otp = random.randint(1000, 9999)
        otp_expiry = datetime.now() + timedelta(minutes = 10)

        user = UserModel(
            phone_number=validated_data["phone_number"],
            name=validated_data["name"],
            otp=otp,
            otp_expiry=otp_expiry,
            max_otp_try=settings.MAX_OTP_TRY
        )
        user.set_password(validated_data["password1"])
        user.save()
        send_otp(validated_data["phone_number"], otp)
        return user



class PhonePasswordResetRequestSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField()
    class Meta:
        model = UserModel
        fields = (
            "phone_number",
        )

class PhonePasswordResetConfirmSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    verification_code = serializers.CharField()
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = UserModel
        fields = (
            "phone_number",
            "password1",
            "password2"
        )

    def validate(self, data):
        """
        Validates if both password are same or not.
        """

        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("Passwords do not match")
        return data
