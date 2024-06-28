from django.db import models


# Create your models here.
class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False)
    first_name = models.CharField(max_length=255, null=False)
    last_name = models.CharField(max_length=255, null=False)
    email = models.EmailField(max_length=255, null=False)
    password = models.CharField(max_length=255, null=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True)
    profile_picture = models.CharField(max_length=255, null=True)
