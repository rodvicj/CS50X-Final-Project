from django.urls import path

from . import views

app_name = "vaccination_records"
urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("get_records", views.get_records, name="get_records"),
    path("get_record/<int:record_id>", views.get_record, name="get_record"),
    path("add_record", views.add_record, name="add_record"),
]
