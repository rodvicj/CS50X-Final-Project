import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Vaccine_information, Personal_information


def index(request):

    # Authenticated users
    if request.user.is_authenticated:
        return render(request, "vaccination_records/index.html")

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("vaccination_records:login"))



@csrf_exempt
@login_required
def get_record(request, record_id):
    record = {}

    try:
        record = Personal_information.objects.get(user=request.user, pk=record_id)
    except Personal_information.DoesNotExist:
        return JsonResponse({"error": "record not found."}, status=404)

    # return serialized record
    if request.method == "GET":
        return JsonResponse(record.serialize())
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)


@csrf_exempt
@login_required
def get_records(request):

    records = Personal_information.objects.filter(user=request.user).order_by("-date_created")

    return JsonResponse([record.serialize() for record in records], safe=False)


@csrf_exempt
@login_required
def add_record(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    try:
        data = json.loads(request.body)
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")
        address = data.get("address", "")
        contact_number = data.get("contact_number", "")
        gender = data.get("gender", "")
        birthdate = data.get("birthdate", "")

        personal_info = Personal_information.objects.create(user=request.user, first_name=first_name, last_name=last_name, address=address, contact_number=contact_number, gender=gender, birthdate=birthdate)
        personal_info.save()
        new_added = Personal_information.objects.get(pk=personal_info.id)
        jsonified_vaccine_infos = data.get("vaccine_infos", "")
        vaccine_infos = json.loads(jsonified_vaccine_infos)

        for info in vaccine_infos:
            # if ((info["dosage_sequence"] != "") and (info["date_administered"] != "") and (info["vaccine_brand"] != "") and (info["vaccinator"]) != ""):
            if ((info["dosage_sequence"]) and (info["date_administered"]) and (info["vaccine_brand"]) and (info["vaccinator"])):
                new_vaccine_info = Vaccine_information.objects.create(dosage_sequence=info["dosage_sequence"], date_administered=info["date_administered"], vaccine_brand=info["vaccine_brand"], vaccinator=info["vaccinator"])
                new_vaccine_info.save()
                new_added.vaccine_infos.add(new_vaccine_info)


        return JsonResponse({"message": "success"}, status=201)

    except Personal_information.DoesNotExist:
        return JsonResponse({"error": "record not found"}, status=404)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("vaccination_records:index"))
        else:

            return render(request, "vaccination_records/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "vaccination_records/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("vaccination_records:index"))


def register(request):
    if request.method == "POST":
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "vaccination_records/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(email, email, password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "vaccination_records/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("vaccination_records:index"))
    else:
        return render(request, "vaccination_records/register.html")
