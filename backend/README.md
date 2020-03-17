Vue-team-v17 Backend

1. Clone repository
2. npm install
3. npm install -g nodemon
4. nodemon app.js


+ Register using postman

POST http://v17-vue-team-01.test:5000/api/users/register with raw JSON:
```
{
    "name": "Vue Chingu",
    "username": "Vue",
    "email": "vuechingu@gmail.com",
    "password": "test",
    "confirm_password": "test"
}
```
Other options can be tried (username or email already used, password mismatch)

+ Login with postman

POST http://v17-vue-team-01.test:5000/api/users/login with raw JSON:
```
{
	"username": "Vue",
	"password": "test"
}
```
Other options can be tried (wrong password, non existing user)

+ Get token from output and used it for me route:

GET http://v17-vue-team-01.test:5000/api/users/me with header key:x-access-token value:token from login
+ Output should be the user information:
```
{
    "_id": "5e6fc635916da9a710d2f8c0",
    "username": "Vue",
    "name": "Vue Chingu",
    "email": "vuechingu@gmail.com",
    "iat": 1584398427,
    "exp": 1585003227
}
```

+ Logout route not needed as the token should be deleted from local storage, nevertheless it exists

GET http://v17-vue-team-01.test:5000/api/users/logout



