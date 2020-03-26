Vue-team-v17 Backend

1. Clone repository
2. cd /backend
3. npm install
4. npm install -g nodemon
5. node app.js (nodemon app.js for development)


+ Register using postman

POST http://v17-vue-team-01.test:5000/api/users/register with raw JSON :
```
{
    "name": "Vue Chingu",
    "username": "Vue",
    "email": "vuechingu@gmail.com",
    "password": "test",
    "confirm_password": "test",
    "TZ": "-5", 
}
```
Other options can be tried (username or email already used, password mismatch)  
If no TZ provided, defaults to GMT

+ Login with postman

POST http://v17-vue-team-01.test:5000/api/users/login with raw JSON:
```
{
	"username": "Vue",
	"password": "test"
}
```
Other options can be tried (wrong password, non existing user)  
The output contains the token to be saved in local storage

+ Get token from output and used it for me route:

GET http://v17-vue-team-01.test:5000/api/users/profile with header key:x-access-token value:token from login
+ Output should be the user information, togheter with its events:
```
{
    "events": [
        "5e7b755606c9f25fad22248f"
    ],
    "TZ": 0,
    "_id": "5e6fc635916da9a710d2f8c0",
    "name": "Vue Chingu",
    "username": "Vue",
    "email": "vuechingu@gmail.com",
}
```

+ Get user events route is not needed as the user profile route already has that informationt, nevertheless it exists (it could be removed in a next commit)

GET http://v17-vue-team-01.test:5000/api/users/events

+ Logout route not needed as the token should be deleted from local storage, nevertheless it exists

GET http://v17-vue-team-01.test:5000/api/users/logout

---

+ Create Event using postman

POST http://v17-vue-team-01.test:5000/api/events/create with raw JSON :  
current_timestamp comes from pre-request script in postman:
```
var current_timestamp = new Date();
postman.setEnvironmentVariable("current_timestamp", current_timestamp.toISOString());
```
The user must be already logged in and the token also needs to be sent as header key:x-access-token value:token
```
{
	"name": "Chingu Event",
	"details": "Test event created for chingu vue",
	"date": "{{current_timestamp}}"
}
```
The event is created, and user is automatically inserted in event users array, and user events array also gets event id inserted

+ Add user to event

POST http://v17-vue-team-01.test:5000/api/users/login with raw JSON:
```
{
    "event_id": "5e7b755606c9f25fad22248f",
    "username": "Vue user"
}
```
User needs to be logged, and event_id can be saved in local storage also (to be discussed)
If user exists, it will be added to event, and also event will be in user's events.  
If username doesn't exist, it will fail with msg no user found.





