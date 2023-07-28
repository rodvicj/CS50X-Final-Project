# VACCINATION RECORDS

## CS50X Introduction to Computer Science
This web-app is my CS50's final project. 

### Video demo:  <https://youtu.be/sKQ2sZMyhf4>

### Description:

Nowadays vaccination against covid virus have been highly encouraged throughout many regions.
Having a stack of papers or even a spreadsheet that you have to manually connect to corresponding cells in order to generate a list of records is hard to maintain.
By recognising these actionable difficulties, I decided to develop this vaccination records web-application as my final project for CS50X Introduction to Computer Science.
Here's what you can do with this web-app.
 - You can add vaccination record, which consists of personal information as well as important information regarding covid vaccination such as dosage sequence, the brand of vaccine that have been used, the date it was administered and even the vaccinator's name.
 - You will have access to list of all the records you have added in a minimal format in order to easily access important information.
 - By clicking individual record, you will be redirected to a page where you can access all the information of that individual.
 - In a way, you can also categorize list of records by creating unique login account to handle the records, for example you can create account specifically for handling all the vaccination records that you need in your workplace as well as created a different login account to manage your personal vaccination records that includes your family.
    -  school@email.com for handling school vaccination records
    - home@email.com for handling vaccination records of your family
 - With this web-app you can easily keep track of the last dosage of vaccine administered to an individual thus you can keep it up to date or inform him/her if it's nearly expired.



### Setup overview
 - Backend
    - I have used django (python based web-framework) for the backend to handle sessions, database, urls, forms, etc.
    - I have created api's using django.urls to setup communication between frontend and the backend database.
 - Frontend
    - I have used vanilla javascript to handle user experience.
    - For styling, i decided to use minimal bootstrap styles, tables, etc.



### Configuration
 - Install the dependency in requirements.txt
 - Using command line go to project directory and prepare database migration by executing:
 > python3 manage.py makemigrations vaccination_records
 - To start migrating database execute:
 > python3 manage.py migrate
 - Start development server:
 > python3 manage.py runserver
 - Go to localhost:8000 via browser to access the app
 - You need to register for an account first before you can use the app
 - After successfully login you can now add/manage your own vaccination records


 ### Directory setup
 - ~/project/final_project/vaccination_records/static/vaccination_records/index.js
 > where javascript code lives
 - ~/project/final_project/vaccination_records/templates/vaccination_records/*
 > html files
 - ~/project/final_project/vaccination_records/models.py
 > database
 - ~/project/final_project/vaccination_records/views.py
 > controller
 - ~/project/final_project/vaccination_records/urls.py
 > urls and api's


### Future Improvements
 - Fixed known bugs
 - Refactor index.js
 - Improve user experience
 - Slowly refactor to more secure backend
 - Add button for QR-code generation
 - etc.

