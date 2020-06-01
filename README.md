# Chingu Time 

Make scheduling meetings across different timezones easier with Chingu Time!

This Project is part of the [Chingu.io](https:chingu.io) Voyages - [#17 - Project Vue-01]

## Preview

![Preview of the live chingutime website](https://i.imgur.com/xsrAlSm.png)

## Description

This is an ongoing project with multiple purposes in mind.<br/>
First of all, we wanted to create an easy, simple way to schedule events/meetings for people in different timezones. <br/>
Secondly, this functions as a project to learn vue.js, a major frontend library, node.js as the backend and MongoDB as the database.<br/>If possible, this project will be constantly updated and will hopefully have new features in the future.

## Chingu

This project is part of the [Chingu](https://chingu.io) program.<br/>
"Chingu is a remote 6-week program for web developers. <br/>You will build a project in a remote team and level up with the technical and soft skills required in a professional software job."<br/>
Please visit them at the link above!

## Livesite

![badge website online](https://img.shields.io/website?style=for-the-badge&up_message=online&url=http%3A%2F%2Fnovelslist.netlify.com%2F)  
Live website can be found under: [chingutime](https://chingutime.netlify.app/)

## Features

* Now
  * Login and edit your account details
  * Create an event and add other users
  * Select different hours and get advises on best hours for all event users
  * Schedule the event and download ics file for gmail or outlook calendar 
  * View all your scheduled events in calendar
  * Mobile App (PWA)
  * Unschedule events/Edit scheduled events
  * Send emails on schedule 
* Future
  * Work with non hourly timezones
  * Handling daylight saving changes

## Roadmap

A finished MVP version of the website is currently live. <br/>
The current Roadmap for us is to correct existing bugs and issues in beta version, and afterwards we will start implementing new features.

## Project setup

To implement the backend server you need to:

### Clone repository

### Install packages
```
npm install
```
### Install nodemon
```
npm install -g nodemon
```
### Starts server with hot-reloads for development
```
nodemon app.js
```
### Starts server for production
```
node app.js
```
### To implement a development database you need to:
Create an account with mongoDB and start a local database <br/>
Local backend will be connected with local mongoDB on localhost port 27017
### Change all API routes to localhost server instead chingutime server
### To implement the frontend server you need to:
```
cd client
```
```
npm install
```
### Compiles and hot-reloads for development
```
npm run serve
```
### Compiles and minifies for production
```
npm run build
```

### Full Backend Reference can be found here:
See [Backend Readme](README_BE.md).

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Packages

For Frontend Packages please refere here:
[Package.json](client/package.json) <br/> 
For Backend Packages please refere here:
[Package.json](package.json)

## Authors

- [Youngmi Lee](https://github.com/ally0426) - Also known as [Ally](https://ally0426.github.io/Basic_Portfolio/). Looking for a full stack developer position(MERN)
- [Oleksandr Malakhov](https://github.com/Alexever17) - Also known as Alexever17. Hobby web dev. Maker of games and reader of novels
- [Marcos Mendes](https://github.com/MarcosMe) - Also known as [MarcosMe](https://marcosmendes.eu). Technical Support. Fullstack developer. RaspberryPi tinker

## Contributing

Contributing is very welcome. Open a pull request if you want to help out.<br/> 
Make sure not to make any big changes to the overall structure! Thanks.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
