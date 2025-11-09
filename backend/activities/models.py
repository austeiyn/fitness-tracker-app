from django.db import models
from django.contrib.auth.models import User


class Activity(models.Model):
    ACTIVITY_TYPES = [
        ('workout', 'Workout'),
        ('meal', 'Meal'),
        ('steps', 'Steps'),
    ]

    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    duration = models.IntegerField(null=True, blank=True, help_text="Duration in minutes")
    steps = models.IntegerField(null=True, blank=True)
    calories = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} - {self.title}"