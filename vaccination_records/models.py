# from django.contrib.auth.forms import AdminPasswordChangeForm
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


# vaccine information
class Vaccine_information(models.Model):
    dosage_sequence = models.CharField(max_length=32)
    date_administered = models.DateField()
    vaccine_brand = models.CharField(max_length=255)
    vaccinator = models.CharField(max_length=255)

    def serialize(self):
        return {
            "dosage_sequence": self.dosage_sequence,
            "date_administered": self.date_administered,
            "vaccine_brand": self.vaccine_brand,
            "vaccinator": self.vaccinator,
        }

    def __str__(self):
        return f"{self.dosage_sequence} {self.vaccine_brand} {self.date_administered}"


class Personal_information(models.Model):
    # TODO: add validation to make sure everything is not an empty string or ""
    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name="added_records",
    )
    first_name = models.CharField(max_length=255, blank=False, null=False)
    last_name = models.CharField(max_length=255, blank=False, null=False)
    address = models.CharField(max_length=255, blank=False, null=False)
    contact_number = models.CharField(max_length=255, blank=False, null=False)
    gender = models.CharField(max_length=255, blank=False, null=False)
    birthdate = models.DateField(help_text="Date of birth", blank=False, null=False)
    date_created = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    vaccine_infos = models.ManyToManyField(Vaccine_information, related_name="personal_info")

    def serialize(self):
        return {
            "id": self.id,
            # TODO: return as
            # "first_name": f"{self.first_name}",
            # "last_name": f"{self.last_name}",
            "name": f"{self.first_name} {self.last_name}",
            "address": self.address,
            "contact_number": self.contact_number,
            "gender": self.gender,
            "birthday": self.birthdate,
            "date_created": self.date_created.strftime("%b %d %Y, %I:%M %p"),
            "vaccine_infos": [record.serialize() for record in self.vaccine_infos.all()],
        }

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
