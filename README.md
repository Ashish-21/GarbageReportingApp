# GarbageReportingApp

A garbage reporting application, where a user can login and report garbage near his/her locality by clicking a picture and adding details. He / She then can mark the complaint as resolved once it is attended.

# Installation

clone git : https://github.com/Ashish-21/GarbageReportingApp.git

```bash
npm install
```

# Configuration Changes(If required)

"For Connection URL for Mongo DB"

go to .env file

CONNECTION_URL=YOUR_CONNECTION_URL

"For Change Port Number

go to .env file

SERVER_PORT_NUMBER=REQUIRED PORT NUMBER

# USAGE

Use postman for sending HTTP request

example : To create user
HTTP POST REQUEST: http://localhost:9000/userHandler/register

Content-Type: application/json

{
"username":"xyz",
"password":"xyz@123",
"emailId":"xyz@gmail.com"
}

# Project Work

Designed a Backend for Garbage Reporting Application

Technologies Used

Node.js(Express)

MongoDB

# Support

emailId : ashishchandwani21@gmail.com
