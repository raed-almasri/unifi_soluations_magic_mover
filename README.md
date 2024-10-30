## Magic Transporters - Unifi Solutions ✨

This project is a robust backend application built to handle a variety of transportation-related tasks.

## Features

-   **Secure Authentication**:

    -   Utilizes JWT (JSON Web Tokens) for user authentication and authorization, ensuring that only authenticated users can access protected routes. 🔒

-   **Role-Based Authorization**:

    -   Implemented role-based access control (RBAC) to manage user permissions. Different roles (e.g., admin, user, guest) determine access to various API endpoints. 🛡️

-   **Input Validation**:

    -   Ensures that all incoming data is validated to prevent attacks such as SQL injection and XSS. Utilizes libraries like Joi or express-validator for robust input validation. ✅

-   **Database Integration**:

    -   Leverages MongoDB for data persistence and management, ensuring efficient data retrieval and storage. 🗄️

-   **Rate Limiting**:

    -   Implements rate limiting to protect against abuse and denial-of-service (DoS) attacks using middleware like express-rate-limit. 🚦

-   **Localization**:

    -   Supports multiple languages and regional settings. Utilizes libraries such as i18next for managing translations and locale-specific data. 🌍

-   **RESTful API**:

    -   Exposes a well-defined REST API for interacting with the application, adhering to best practices for RESTful design. 📡

-   **Test-Driven Development**:

    -   Built with a strong emphasis on unit testing and integration testing using frameworks like Jest or Mocha for quality assurance. 🧪

-   **Documentation**:
    -   Includes generated documentation for API endpoints and core functionalities, ensuring that developers can easily understand and use the API. 📚

## Security Best Practices

-   Store sensitive data securely, utilize environment variables for configuration.
-   Ensure HTTPS is enforced for all connections to enhance data security in transit.
-   Regularly update dependencies to patch vulnerabilities.

## Getting Started

### Prerequisites

1. **Node.js and npm:** Install the latest versions of Node.js and npm from [https://nodejs.org/](https://nodejs.org/).
2. **MongoDB:** Download and install MongoDB from [https://www.mongodb.com/](https://www.mongodb.com/). Start the MongoDB server.

### Installation & Setup

1.  **Clone the repository:**

    bash git clone cd magic-transporters `git clone https://github.com/raed-almasri/unifi_soluations_magic_mover.git`

2.  **Install Dependencies:**

        ```bash
        npm install
        ```

3.  **Environment Configuration:**

    -   Create a `.env` file in the root of your project directory.
    -   Add the following environment variables to your `.env` file:

        ```dotenv
        MONGODB_URL="mongodb://localhost:27017/magic_transporters"
        LINK=http://localhost:4001
        TOKEN_SECRET_KEY="YOUR_SECRET_KEY"
        TOKEN_EXPIRES_IN="1d"
        REFRESH_TOKEN_SECRET_KEY="YOUR_REFRESH_TOKEN_SECRET"
        REFRESH_TOKEN_EXPIRES_IN="30d"
        ```

        **Important:**

        -   Replace `"YOUR_SECRET_KEY"` and `"YOUR_REFRESH_TOKEN_SECRET"` with strong, unique secret keys. These are crucial for security.
        -   Adjust the `LINK` variable if you plan to run the app on a different port.

### Running the Application

1.  **Start the development server:**

        ```bash
        npm run start:dev
        ```

    The application will typically be accessible at `http://localhost:4001` (or the port specified in your `.env` file).

### Testing

-   **Unit Tests: E2E**
    -   Run the unit tests with:
        ```bash
        npm run test
        ```
        _Note: This is also non-functional due to time constraints, but I have the setup_

### Documentation

-   **JSDoc:**

    -   Generate JSDoc documentation using:
        ```bash
        npm run jsdoc
        ```
    -   The generated documentation will be located in the `docs` folder.

        _Note: This is also non-functional due to time constraints, but I have the setup_

-   **Swagger:**

    -   Generate Swagger documentation using:

    [http://localhost:4001/api-docs](http://localhost:4001/api-docs)

    -   Note: ensure you NODE_ENV is developer mode because in the production mode that is not allowed

### Postman Collection

-   Import the Postman collection:
    -   The collection is located in `others/Magic Transporters.postman_collection.json`
    -   You can import it into Postman to easily explore the available API endpoints and test requests.

## Contributing

We welcome contributions from the community!

-   **Issues:** If you encounter any bugs, feature requests, or have suggestions, please create an issue on the GitHub repository.
-   **Pull Requests:** Contributions are always welcome! Feel free to submit pull requests for bug fixes, feature enhancements, and improvements to the codebase.

## License

This project is licensed under the MIT License.

## Eng.Raed Al Masri
