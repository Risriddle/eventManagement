
# Event Management

This is a event management website where users can create events and track the people attending the event in real time.


## Tech Stack

**Client:** React JS , CSS , socket-io client
 
**Server:** Express js , socket.io

**Database:** MongoDB


## Features

- Complete user Authentication along with email verification and use of JWT
- WebSockets on client and server side for real time updates
- Automatic refresh of access token by refresh cookie
- Integration of AWS S3 for storing event images
- Feature of guest login valid for 1 day
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URI`
`PORT`
`MAIL_USERNAME`
`MAIL_PASSWORD`
`OAUTH_CLIENTID`
`OAUTH_CLIENT_SECRET`
`OAUTH_REFRESH_TOKEN`
`ACCESS_JWT_SECRET`
`REFRESH_JWT_SECRET`
`GUEST_JWT_SECRET`
`AWS_ACCESS_KEY_ID`
`AWS_SECRET_ACCESS_KEY`
`S3_BUCKET_NAME`


## Run Locally

Clone the project

```bash
  git clone https://github.com/Risriddle/eventManagement.git
```

Go to the project directory

```bash
  cd eventManagement
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev (Frontend)
```

```bash
  nodemon server.js / node server.js (Backend)
```
