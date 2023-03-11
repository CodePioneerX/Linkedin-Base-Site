# Generated by Django 4.1.5 on 2023-03-10 22:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workshare', '0012_joblisting'),
    ]

    operations = [
        migrations.CreateModel(
            name='Recommendations',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('receipent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_recommendations', to='workshare.profile')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_recommendations', to='workshare.profile')),
            ],
        ),
    ]