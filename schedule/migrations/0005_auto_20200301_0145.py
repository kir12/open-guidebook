# Generated by Django 3.0.3 on 2020-03-01 06:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('schedule', '0004_auto_20200207_1233'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='title',
            field=models.CharField(max_length=75, unique=True),
        ),
    ]