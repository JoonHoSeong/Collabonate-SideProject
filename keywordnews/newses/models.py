from django.db import models

# Create your models here.
class News(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, null=False)
    link = models.CharField(max_length=255, null=False)
    thumbnail = models.CharField(max_length=255, null=True)
    publication_date = models.DateTimeField()
    media = models.CharField(max_length=255, null=True)
    summary = models.TextField()
    keyword = models.CharField(max_length=255, null=True)
    detail_category = models.ForeignKey('categories.DetailCategory', on_delete=models.CASCADE, null=True)