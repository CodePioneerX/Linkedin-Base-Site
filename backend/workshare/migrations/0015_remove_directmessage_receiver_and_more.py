# Generated by Django 4.1.5 on 2023-04-17 04:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workshare', '0014_conversation'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='directmessage',
            name='receiver',
        ),
        migrations.AddField(
            model_name='directmessage',
            name='conversation',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='workshare.conversation'),
            preserve_default=False,
        ),
    ]
