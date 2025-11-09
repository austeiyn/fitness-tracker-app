from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityViewSet, register_user, login_user, logout_user

router = DefaultRouter()
router.register(r'activities', ActivityViewSet, basename='activity')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('auth/logout/', logout_user, name='logout'),
]