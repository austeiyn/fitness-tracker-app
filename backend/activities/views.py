from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from .models import Activity
from .serializers import ActivitySerializer, UserSerializer


@csrf_exempt  # MUST BE FIRST
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt  # MUST BE FIRST
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return Response({'message': 'Login successful', 'user_id': user.id})
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@csrf_exempt  # MUST BE FIRST
@api_view(['POST'])
@permission_classes([AllowAny])  # Changed to AllowAny for logout
def logout_user(request):
    logout(request)
    return Response({'message': 'Logout successful'})


@method_decorator(csrf_exempt, name='dispatch')
class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]  # Temporarily changed to AllowAny for testing

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Activity.objects.filter(user=self.request.user)
        return Activity.objects.all()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            # For testing, use first user or create a default
            default_user = User.objects.first()
            if not default_user:
                default_user = User.objects.create_user(username='default', password='default123')
            serializer.save(user=default_user)