# Generated by Django 4.1.5 on 2023-04-18 21:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workshare', '0022_alter_comment_content_remove_post_comments_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='joblisting',
            name='comments',
        ),
        migrations.RemoveField(
            model_name='joblisting',
            name='likes',
        ),
        migrations.RemoveField(
            model_name='post',
            name='comments',
        ),
        migrations.RemoveField(
            model_name='post',
            name='likes',
        ),
        migrations.AddField(
            model_name='comment',
            name='post',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='post_comment', to='workshare.post'),
            preserve_default=False,
        ),
    ]
