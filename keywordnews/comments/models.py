from django.db import models


# Create your models here.
class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    news = models.ForeignKey('newses.News', on_delete=models.CASCADE, null=False)
    author = models.ForeignKey('users.User', on_delete=models.CASCADE, null=False)
    content = models.TextField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, default=None)