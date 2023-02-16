# Generated by Django 4.1.5 on 2023-02-16 18:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workshare', '0010_alter_profile_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='awards',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='profile',
            name='courses',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='profile',
            name='languages',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='profile',
            name='projects',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='profile',
            name='volunteering',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='profile',
            name='work',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='profile',
            name='experience',
            field=models.TextField(default=''),
        ),
    ]