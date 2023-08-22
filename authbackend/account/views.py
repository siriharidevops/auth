import datetime
import random

from django.conf import settings
from django.utils import timezone
from rest_framework import status, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .utils import send_otp

from .models import UserModel
from .serializers import UserSerializer,PhonePasswordResetRequestSerializer,PhonePasswordResetConfirmSerializer
# from .serializers import PhonePasswordResetRequestSerializer, PhonePasswordResetConfirmSerializer



class UserViewSet(viewsets.ModelViewSet):
    """
    UserModel View.
    """

    queryset = UserModel.objects.all()
    serializer_class = UserSerializer

    @action(detail=True, methods=["PATCH"])
    def verify_otp(self, request, pk=None):
        instance = self.get_object()
        if (
            not instance.is_active
            and instance.otp == request.data.get("otp")
            and instance.otp_expiry
            and timezone.now() < instance.otp_expiry
        ):
            instance.is_active = True
            instance.otp_expiry = None
            instance.max_otp_try = settings.MAX_OTP_TRY
            instance.otp_max_out = None
            instance.save()
            return Response(
                "Successfully verified the user.", status=status.HTTP_200_OK
            )

        return Response(
            "User active or Please enter the correct OTP.",
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=True, methods=["PATCH"])
    def regenerate_otp(self, request, pk=None):
        """
        Regenerate OTP for the given user and send it to the user.
        """
        instance = self.get_object()
        if int(instance.max_otp_try) == 0 and timezone.now() < instance.otp_max_out:
            return Response(
                "Max OTP try reached, try after an hour",
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp = random.randint(1000, 9999)
        otp_expiry = timezone.now() + datetime.timedelta(minutes=10)
        max_otp_try = int(instance.max_otp_try) - 1

        instance.otp = otp
        instance.otp_expiry = otp_expiry
        instance.max_otp_try = max_otp_try
        if max_otp_try == 0:
            # Set cool down time
            otp_max_out = timezone.now() + datetime.timedelta(hours=1)
            instance.otp_max_out = otp_max_out
        elif max_otp_try == -1:
            instance.max_otp_try = settings.MAX_OTP_TRY
        else:
            instance.otp_max_out = None
            instance.max_otp_try = max_otp_try
        instance.save()
        send_otp(instance.phone_number, otp)
        return Response("Successfully generate new OTP.", status=status.HTTP_200_OK)



class PhonePasswordResetRequestView(APIView):
    def post(self, request):
        print(request.data)
        serializer = PhonePasswordResetRequestSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            try:
                instance = UserModel.objects.get(phone_number=phone_number)
                # user.generate_reset_code()
                # instance = self.get_object()
                if int(instance.max_otp_try) == 0 and timezone.now() < instance.otp_max_out:
                    return Response("Max OTP try reached, try after an hour",status=status.HTTP_400_BAD_REQUEST)
                otp = random.randint(1000, 9999)
                otp_expiry = timezone.now() + datetime.timedelta(minutes=10)
                max_otp_try = int(instance.max_otp_try) - 1

                instance.otp = otp
                instance.otp_expiry = otp_expiry
                instance.max_otp_try = max_otp_try
                if max_otp_try == 0:
                    # Set cool down time
                    otp_max_out = timezone.now() + datetime.timedelta(hours=1)
                    instance.otp_max_out = otp_max_out
                elif max_otp_try == -1:
                    instance.max_otp_try = settings.MAX_OTP_TRY
                else:
                    instance.otp_max_out = None
                    instance.max_otp_try = max_otp_try
                instance.save()
                send_otp(instance.phone_number, otp)
                # Send SMS with reset code
                return Response({'detail': 'Verification code sent.'}, status=status.HTTP_200_OK)
            except UserModel.DoesNotExist:
                return Response({'detail': 'User with this phone number not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PhonePasswordResetConfirmView(APIView):
    def post(self, request):
        print(request.data)
        serializer = PhonePasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            verification_code = serializer.validated_data['verification_code']
            new_password = serializer.validated_data['password1']

            try:
                user = UserModel.objects.get(phone_number=phone_number)
                if user.otp == verification_code:
                    user.set_password(new_password)
                    user.save()
                    return Response({'detail': 'Password reset successful.'}, status=status.HTTP_200_OK)
                else:
                    return Response({'detail': 'Invalid verification code.'}, status=status.HTTP_400_BAD_REQUEST)
            except UserModel.DoesNotExist:
                return Response({'detail': 'User with this phone number not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




