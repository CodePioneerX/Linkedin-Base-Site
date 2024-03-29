# Generated by Django 4.1.5 on 2023-02-16 23:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('workshare', '0011_profile_awards_profile_courses_profile_languages_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='JobListing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('remote', models.BooleanField(default=False)),
                ('company', models.CharField(max_length=255)),
                ('job_type', models.CharField(max_length=255)),
                ('image', models.ImageField(blank=True, null=True, upload_to='images/')),
                ('likes', models.IntegerField(default=0)),
                ('salary', models.IntegerField(default=0)),
                ('location', models.CharField(max_length=255)),
                ('status', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('comments', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='workshare.comment')),
            ],
        ),
    ]
