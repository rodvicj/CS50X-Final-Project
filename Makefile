.PHONY: install
install:
	poetry install

.PHONY: poetry-update
poetry-update:
	poetry update

.PHONY: makemigrations
makemigrations:
	poetry run python manage.py makemigrations

.PHONY: install-pre-commit
install-pre-commit:
	poetry run pre-commit uninstall; poetry run pre-commit install

.PHONY: lint
lint:
	poetry run pre-commit run --all-files

.PHONY: migrate
migrate:
	poetry run python manage.py migrate

.PHONY: runserver
runserver:
	poetry run python manage.py runserver

.PHONY: shell
shell:
	poetry run python manage.py shell

.PHONY: superuser
superuser:
	poetry run python manage.py createsuperuser

.PHONY: export
export:
	poetry export --without-hashes --format=requirements.txt > requirements.txt

.PHONY: update
update: install migrate install-pre-commit ;
