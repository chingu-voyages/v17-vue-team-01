Vue-team-v17 Backend

1. Clone repository
2. npm install
3. npm install -g nodemon
4. node app.js (nodemon app.js for development)


+ Register users using postman (register at least 3 users for test purpose!)

POST http://v17-vue-team-01.test:5000/api/users/register with raw JSON :
```
{
    "name": "test",
    "username": "test",
    "email": "chingutime@gmail.com",
    "password": "test1234",
    "TZ": "0"
}

{
    "name": "test1",
    "username": "test1",
    "email": "chingutime1@gmail.com",
    "password": "test1234",
    "TZ": "-1"
}

{
    "name": "test2",
    "username": "test2",
    "email": "chingutime2@gmail.com",
    "password": "test1234",
    "TZ": "-2"
}
```
Other options can be tried (username or email already used) password mismatch is removed from code  
If no TZ provided, defaults to GMT

+ Login with postman

POST http://v17-vue-team-01.test:5000/api/users/login with raw JSON:
```
{
	"username": "test",
	"password": "test1234"
}
```
Other options can be tried (wrong password, non existing user)  
The output contains the token to be saved in local storage, token expiration time is currently 7 days


+ Get token from output and use it for profile route:

GET http://v17-vue-team-01.test:5000/api/users/profile with header key:x-access-token value:token from login
+ Output should be the user information, together with its events:
```
[
    {
        "events": [
            "5e95d8412bd2d450d8376a6c"
        ],
        "TZ": 0,
        "_id": "5e95d6942bd2d450d8376a69",
        "name": "test",
        "username": "test",
        "email": "chingutime@gmail.com"
    },
    [
        "5e95d8412bd2d450d8376a6c",
        "Chingu Event",
        false
    ]
]
```
It will also include a second array with user events information (id, title and if scheduled or not)  

+ Update user details

POST http://v17-vue-team-01.test:5000/api/users/update with raw JSON:
```
{
	"username": "new username",
    "name": "new Name",
    "email": "new email",
}
```
A user needs to be logged. 
If user exists, it will be updated with the new data, only if data is not empty (if empty it will not change). 
If user doesn't exist, it will fail with msg no user found.

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
    "color": "blue",
    "possibleDays": ["2020-12-03", "2020-12-04"]
}
```
The event is created, and user is automatically inserted in event users array, and user events array also gets event id inserted. No dates are inserted, as event is not scheduled yet (only after the time slots are inserted by each user, the event start and end will be filled). You need to also include and array with the possible days (start day and end day) to display the timeslots to choose.

+ Add a user to an event

POST http://v17-vue-team-01.test:5000/api/events/add with raw JSON:
```
{
    "event_id": "5e95d8412bd2d450d8376a6c",
    "username": "test1"
}

{
    "event_id": "5e95d8412bd2d450d8376a6c",
    "username": "test2"
}
```
A user needs to be logged, and event_id can be saved in local storage also (to be discussed)
If user exists, it will be added to event, and also event will be in user's events.  
If username doesn't exist, it will fail with msg no user found.
Any user already in the event can add another user.

+ Remove a user from an event

POST http://v17-vue-team-01.test:5000/api/events/remove with raw JSON:
```
{
    "event_id": "5e95d8412bd2d450d8376a6c",
    "username": "test2"
}
```
A user needs to be logged, and event_id can be saved in local storage also (to be discussed)
If user exists, it will be removed from event, and also event will be removed from user's events.  
If username doesn't exist, it will fail with msg no user found.
Only the creator of the event can remove users.
It will also delete timeslots for this user of this event.

+ Show event details

GET http://v17-vue-team-01.test:5000/api/events/show/id:

A user needs to be logged, and event_id can be saved in local storage also (to be discussed)
If event exists, it will send four arrays, first with event details together with its users, the second with all timeslots for that event (for display), the third array, either a string with information (no advisable timeslots for only one user, or still no advisable timeslots), or the array with advisable timeslots for schedule, and a fourth array with event users information (id and username):
```
[
    {
        "users": [
            "5e95d6942bd2d450d8376a69",
            "5e95d6d02bd2d450d8376a6a",
            "5e95d7032bd2d450d8376a6b"
        ],
        "start": null,
        "end": null,
        "scheduled": false,
        "possibleDays": [
            "2020-12-03",
            "2020-12-04"
        ],
        "_id": "5e95d8412bd2d450d8376a6c",
        "title": "Chingu Event",
        "details": "Test event created for chingu vue",
        "color": "blue",
        "__v": 0
    },
    [
        {
            "_id": "5e95db002bd2d450d8376a6f",
            "user": "5e95d6942bd2d450d8376a69",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-03",
            "time": "2",
            "__v": 0
        },
        {
            "_id": "5e95db002bd2d450d8376a6e",
            "user": "5e95d6942bd2d450d8376a69",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-03",
            "time": "1",
            "__v": 0
        },
        {
            "_id": "5e95db002bd2d450d8376a6d",
            "user": "5e95d6942bd2d450d8376a69",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-03",
            "time": "0",
            "__v": 0
        },
        {
            "_id": "5e95db002bd2d450d8376a70",
            "user": "5e95d6942bd2d450d8376a69",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-04",
            "time": "0",
            "__v": 0
        },
        {
            "_id": "5e95db002bd2d450d8376a71",
            "user": "5e95d6942bd2d450d8376a69",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-04",
            "time": "1",
            "__v": 0
        },
        {
            "_id": "5e95db002bd2d450d8376a72",
            "user": "5e95d6942bd2d450d8376a69",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-04",
            "time": "2",
            "__v": 0
        },
        {
            "_id": "5e95dc4d2bd2d450d8376a7f",
            "user": "5e95d6d02bd2d450d8376a6a",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-03",
            "time": "1",
            "__v": 0
        },
        {
            "_id": "5e95dc4d2bd2d450d8376a80",
            "user": "5e95d6d02bd2d450d8376a6a",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-03",
            "time": "2",
            "__v": 0
        },
        {
            "_id": "5e95dc4d2bd2d450d8376a81",
            "user": "5e95d6d02bd2d450d8376a6a",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-03",
            "time": "3",
            "__v": 0
        },
        {
            "_id": "5e95dc4d2bd2d450d8376a82",
            "user": "5e95d6d02bd2d450d8376a6a",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-04",
            "time": "1",
            "__v": 0
        },
        {
            "_id": "5e95dc4d2bd2d450d8376a83",
            "user": "5e95d6d02bd2d450d8376a6a",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-04",
            "time": "2",
            "__v": 0
        },
        {
            "_id": "5e95dc4d2bd2d450d8376a84",
            "user": "5e95d6d02bd2d450d8376a6a",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-04",
            "time": "3",
            "__v": 0
        },
        {
            "_id": "5e95dc552bd2d450d8376a85",
            "user": "5e95d7032bd2d450d8376a6b",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-03",
            "time": "2",
            "__v": 0
        },
        {
            "_id": "5e95dc552bd2d450d8376a86",
            "user": "5e95d7032bd2d450d8376a6b",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-03",
            "time": "3",
            "__v": 0
        },
        {
            "_id": "5e95dc552bd2d450d8376a87",
            "user": "5e95d7032bd2d450d8376a6b",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-03",
            "time": "4",
            "__v": 0
        },
        {
            "_id": "5e95dc552bd2d450d8376a88",
            "user": "5e95d7032bd2d450d8376a6b",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-04",
            "time": "2",
            "__v": 0
        },
        {
            "_id": "5e95dc552bd2d450d8376a89",
            "user": "5e95d7032bd2d450d8376a6b",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-04",
            "time": "3",
            "__v": 0
        },
        {
            "_id": "5e95dc552bd2d450d8376a8a",
            "user": "5e95d7032bd2d450d8376a6b",
            "event": "5e95d8412bd2d450d8376a6c",
            "day": "2020-12-04",
            "time": "4",
            "__v": 0
        }
    ],
    [
        "2020-12-03T2C3",
        "2020-12-04T2C3"
    ],
    [
        "5e95d6942bd2d450d8376a69",
        "test",
        "5e95d6d02bd2d450d8376a6a",
        "test1",
        "5e95d7032bd2d450d8376a6b",
        "test2"
    ]
]
```
If event doesn't exist, it will fail with msg no event found.  
Tha advisable timeslots array will contain the days and times that all users from the event have already selected.
If no advisable timeslots yet, array has only a single string with output.

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
If event scheduled boolean is changed to true, it must send also the start and end parameters correctly filled. If scheduled is changed to true BE will create an ics file with relevant information and send it to user. Also to be implemented, send the emails to each attendee informing them the event is scheduled (ics file can be included in the email).

+ Delete event

POST http://v17-vue-team-01.test:5000/api/events/delete with raw JSON:
```
{
    "event_id": "5e95d8412bd2d450d8376a6c",
}
```
A user needs to be logged, and event_id can be saved in local storage also (to be discussed)
If event exists, it will be deleted, and each user of this event will have the event removed from its profile.  
If event doesn't exist, it will fail with msg no event found.  
It will also delete all timeslots from this event.

---

+ Create timeslots

POST http://v17-vue-team-01.test:5000/api/timeslots/create with raw JSON:
```
{
    "event_id": "5e878fa4af0fe51310e6d8b5",
    "timeslots": [["2020-12-03","0","1", "2"],["2020-12-04","0","1","2"]]
}
```
A user needs to be logged, and event_id can be saved in local storage also (to be discussed)
timeslots[0] of each array within the timeslots array is for the day and the rests are the respective timeslots associated with the day.
Timeslots are saved with the user id, the event id, the day and the time of the day (hour).  
It will always save the hour as GMT. For instance, in this case, if the user has a TZ of GMT-15, it will save in timeslots as 15, 14, 13, 15, 14 and 13 respectively.
If the timeslot is created at 23 and timezone is GMT+2, it will save it on the next day (or next month if last day) and with time 1. The same for timeslot created at 1 and TZ is GMT-2, timeslot will be save on previous day (or previous month).

+ Update timeslots

POST http://v17-vue-team-01.test:5000/api/timeslots/create with raw JSON:
```
{
    "event_id": "5e878fa4af0fe51310e6d8b5",
    "timeslots": [["2020-12-03","15","1"],["2020-12-04","7","8","9"]]
}
```
A user needs to be logged, and event_id can be saved in local storage also (to be discussed)
Update timeslots for a given user and event is the same as create new ones. The same route can be used, as it will search for all timeslots for this user and for event, will delete all timeslots found and create the new requested ones.

+ Delete timeslot

POST http://v17-vue-team-01.test:5000/api/timeslots/delete with raw JSON:
```
{
    "timeslot_id": "5e95dc552bd2d450d8376a8a"
}
```
A user needs to be logged, and timeslot_id can be saved in local storage also (to be discussed)
To be discussed the need of this route :)
