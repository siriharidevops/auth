
# urls.py
from django.urls import path
from .views import UserRegistrationView, UserListView, VerifyCodeView, RegenerateOTPView, PhonePasswordResetConfirmView, UserLoginView
 # , , UserLoginView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('list/',UserListView.as_view(),name='user-list'),
    path('regenerate-otp/', RegenerateOTPView.as_view(), name='regenerate-otp'),
    path('verify/', VerifyCodeView.as_view(), name='verify-code'),
    path('phone-password-reset/confirm/', PhonePasswordResetConfirmView.as_view(), name='phone_password_reset_confirm'),
    # path('login/', UserLoginView.as_view(), name='user-login'),
    path('login/',UserLoginView.as_view())
]
