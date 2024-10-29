# Magic Transporters

## Introduction

Magic Transporters, the future of moving things easily. These super cool transporters, powered by virtual magic, are here to make shipping stuff a breeze. In the world of Magic Transporters, there are special people known as Magic Movers. They use nifty gadgets to move important things. Fueled by virtual magic, these Movers go on quick missions to carry items around.

## Overview

A Magic Mover has:

-   Weight limit (the most they can carry)
-   Energy (their total magic power)
-   Quest state (what they’re currently doing: resting, loading, on a mission, or done)

Each Magic Item they carry has:

-   Name (what it’s called)
-   Weight (how much magic power it needs)

## API Endpoints

### Authentication

-   Login to System as magic mover and admin
-   Logout
-   Refresh token

### Admin / Magic Mover

-   Add new magic mover
-   Update magic mover
-   Delete magic mover

### Admin / Users

-   Add new user
-   Update user
-   Delete user
-   Fetch all
-   List who completed the most missions with a fetch endpoint (descending order)

### Magic Mover

-   Create trip
-   Update trip
-   Delete trip
-   Fetch all my trips with magic items
-   Add magic item to trip
-   Delete magic item
-   Change state of any trip it is not completed yet
-   get all my magic mover

## Installation

1. Clone the repository.
2. Run `npm i` to install dependencies.

## Running the Project

To run the project, use one of the following commands:

-   First create new file `.env` in `./` path
-   Second create database and set the Database URL in `.env` file
-   then should add you own details about connection Mongoose and JWT
    Like this details
    `MONGODB_URL`="mongodb://localhost:27017/magice_tansporters"
    `lINK`=http://localhost:4001
    `TOKEN_SECRET_KEY`="secret key of jwt"
    `TOKEN_EXPIRES_IN`="1d"
    `REFRESH_TOKEN_SECRET_KEY`="refresh token secret"
    `REFRESH_TOKEN_EXPIRES_IN`="30d"

-   **To start the project:** `npm run start:dev`

-   **To run the E2E tests:** `npm run test`  
    _Note: This is currently non-functional as I didn’t have enough time to finalize the implementation. However, I've set up the framework and written a single test for login authentication._

-   **To generate JSDoc documentation:** `npm run jsdoc`  
    _Note: This is also non-functional due to time constraints, but I have the setup_

-   **To import Postman Collection:**  
    _Note:you can import it and you can find it in `others/Magic Transporters.postman_collection.json`_

## Contributing

Contributions are welcome. Please follow the project's contribution guidelines.

## License

This project is licensed under ENG.Raed Al Masri
