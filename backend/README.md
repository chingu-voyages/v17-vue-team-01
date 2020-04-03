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
    "TZ": "-5"
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
POST http://v17-vue-team-01.test:5000/api/users/login with raw JSON:
```
{
	"username": "Vue Chingu",
	"password": "test"
}
```
Other options can be tried (wrong password, non existing user)  
The output contains the token to be saved in local storage
Add at least 2 users for test purpose

+ Get token from output and used it for me route:

GET http://v17-vue-team-01.test:5000/api/users/profile with header key:x-access-token value:token from login
+ Output should be the user information, together with its events:
```
{
    "events": [
        "5e7b755606c9f25fad22248f"
    ],
    "TZ": 0,
    "_id": "5e6fc635916da9a710d2f8c0",
    "name": "Vue Chingu",
    "username": "Vue",
    "email": "vuechingu@gmail.com"
}
```

+ Logout route not needed as the token should be deleted from local storage, nevertheless it exists

GET http://v17-vue-team-01.test:5000/api/users/logout

---

+ Create Event using postman

POST http://v17-vue-team-01.test:5000/api/events/create with raw JSON :  

The user must be already logged in and the token also needs to be sent as header key:x-access-token value:token
```
{
	"title": "Chingu Event",
	"details": "Test event created for chingu vue",
    "color": "blue"
}
```
The event is created, and user is automatically inserted in event users array, and user events array also gets event id inserted. No dates are inserted, as event is not scheduled yet (only after the time slots are inserted by each user, the event start and end will be filled)

+ Add a user to an event

POST http://v17-vue-team-01.test:5000/api/events/add with raw JSON:
```
{
    "event_id": "5e7b755606c9f25fad22248f",
    "username": "Vue user"
}
```
A user needs to be logged, and event_id can be saved in local storage also (to be discussed)
If user exists, it will be added to event, and also event will be in user's events.  
If username doesn't exist, it will fail with msg no user found.

+ Remove a user from an event

POST http://v17-vue-team-01.test:5000/api/events/remove with raw JSON:
```
{
    "event_id": "5e7b755606c9f25fad22248f",
    "username": "Vue user"
}
```
A user needs to be logged, and event_id can be saved in local storage also (to be discussed)
If user exists, it will be removed from event, and also event will be removed from user's events.  
If username doesn't exist, it will fail with msg no user found.

+ Show event details

GET http://v17-vue-team-01.test:5000/api/events/show with raw JSON:
```
{
    "event_id": "5e7b755606c9f25fad22248f",
}
```
A user needs to be logged, and event_id can be saved in local storage also (to be discussed)
If event exists, it will show event details together with its users:
{
    "users": [
        "5e7dd9e3e6235cda68c6e026"
    ],
    "start": null,
    "end": null,
    "scheduled": false,
    "_id": "5e7e3a15bb97888661788ba2",
    "scheduled": false,
    "title": "Changed title again",
    "details": "Changed details again without title change",
    "__v": 0,
    "color": "blue"
}
If event doesn't exist, it will fail with msg no event found.


+ Update event details

POST http://v17-vue-team-01.test:5000/api/events/update with raw JSON:
```
{
    "event_id": "5e7b755606c9f25fad22248f",
    "name": "New name",
    "details": "New details",
    "start": "New start date",
    "end": "New end date",
    "color": "New color",
    "scheduled": false
}
```
A user needs to be logged, and event_id can be saved in local storage also (to be discussed)
If event exists, it will be updated with the new data, only if data is not empty (if empty it will not change). 
If event doesn't exist, it will fail with msg no event found.

+ Delete event

POST http://v17-vue-team-01.test:5000/api/events/delete with raw JSON:
```
{
    "event_id": "5e7b755606c9f25fad22248f",
}
```
A user needs to be logged, and event_id can be saved in local storage also (to be discussed)
If event exists, it will be deleted, and each user of this event will have the event removed from its profile.  
If event doesn't exist, it will fail with msg no event found.

