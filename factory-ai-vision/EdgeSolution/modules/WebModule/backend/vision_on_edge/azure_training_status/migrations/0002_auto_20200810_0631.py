# Generated by Django 3.0.8 on 2020-08-10 06:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('azure_training', '0001_initial'),
        ('azure_training_status', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trainingstatus',
            name='project',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='azure_training.Project'),
        ),
    ]