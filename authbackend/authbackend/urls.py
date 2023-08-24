"""
URL configuration for authbackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import views as jwt_views

from account import views
# router = DefaultRouter()
# router.register("user", views.UserViewSet, basename="user")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/',include('account.urls')),
    path('api/token/refresh/',jwt_views.TokenRefreshView.as_view(),name ='token_refresh'),

    # path('api-auth/', include('rest_framework.urls')),
    # path('phone-password-reset/', views.PhonePasswordResetRequestView.as_view(), name='phone_password_reset_request'),
    # path('phone-password-reset/confirm/', views.PhonePasswordResetConfirmView.as_view(), name='phone_password_reset_confirm'),
    # path("verify",views.VerifyCodeView.as_view())

    ]

# urlpatterns += router.urls
