# Generated by Django 4.1.4 on 2022-12-31 06:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("vaccination_records", "0003_delete_email"),
    ]

    operations = [
        migrations.AlterField(
            model_name="personal_information",
            name="contact_number",
            field=models.CharField(max_length=255),
        ),
    ]