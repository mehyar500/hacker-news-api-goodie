# analytics/models.py
from django.db import models

class Story(models.Model):
    hn_id       = models.IntegerField(unique=True)
    title       = models.TextField()
    url         = models.URLField(blank=True, null=True)
    time        = models.DateTimeField()
    score       = models.IntegerField()
    descendants = models.IntegerField()
    by          = models.CharField(max_length=100)
    domain      = models.CharField(max_length=255, blank=True)
    keywords    = models.JSONField(default=list)  # Stores list of strings

    class Meta:
        ordering = ['-time']

