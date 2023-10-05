# VACCINATION RECORDS

## CS50X Introduction to Computer Science
This web-app is my CS50X's final project. 

### Video demo:  <https://youtu.be/sKQ2sZMyhf4>

### Setup overview
 - Backend
    - Used django (python based web-framework) for the backend to handle sessions, database, urls, forms, etc.
    - Created api's using django.urls to setup communication between frontend and the backend database.
 - Frontend
    - Used vanilla javascript to handle user experience.
    - used minimal bootstrap styles, tables, etc...


## Usage

* install packages by running `pip: -r requirements.txt`
* run `python manage.py runserver` to start the server


 ### Directory setup
```
$PROJECT_ROOT
├── final_project       - django settings
└── vaccination_records - vaccine_record app files
```

### Future Improvements
 - Fixed known bugs
 - Refactor index.js
 - Improve user experience
 - Slowly refactor to more secure backend
 - Add button for QR-code generation
 - etc.
