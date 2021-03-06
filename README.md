# Interview Scheduler

Interview Scheduler is a simple yet effective single-page application that (you guessed it) schedules interviews!

This project uses ReactJS on the front-end and Node, Express, PosgreSQL, Axios, and WebSockets on the backend. 

## Feature List:
- Responsive design that allows you to book, change, or edit interviews from a list of interviewers. 
- Updates automatically when other clients book appointments using websockets. 
- Can be easily deployed using a Heroku, CircleCI and Netflify stack.

# Final Product

### Book an Appointment!
!["Book an appointment!"](docs/create.gif)

### Nevermind...Delete it!
!["Nevermind...delete it!"](docs/delete.gif)


## Setup

Clone the repository, then install dependencies with `npm install`.

Note - In order to properly book and have interviews saved, the Scheduler API must also be installed from https://github.com/lighthouse-labs/scheduler-api and a posgreSQL database must be set up either locally on an hosted service.

## Running The App (Webpack Development Server)

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Known Issues

* Websockets were added to the project. Due to the additions, some tests were skipped from the Application.test.js testing suite as the tests failed once the app was optimized for WebSockets. This is because the tests rely on updating the state locally, while the websocket implementation updates the state once it receives update data from the API server. I have implemented websocket tests in useRealtimeUpdate.test.js.
