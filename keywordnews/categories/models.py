from django.db import models


# Create your models here.
class DetailCategory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False)
    parent_category = models.ForeignKey("categories.MainCategory", on_delete=models.CASCADE, null=True)


class MainCategory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False)
