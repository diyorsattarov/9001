# webapp-prac

Welcome to webapp-prac, a simple web application that provides a log viewer for server logs. This application is built using Node.js and Express.js, with logging capabilities provided by the versatile logger middleware, Winston.

## Features

- User authentication using Passport.js with local strategy and flash messages.
- Provides a user-friendly web interface for viewing server logs.
- Fetches and displays logs from log files: `combined.log` and `error.log`.
- Log viewer to display server logs dynamically.

## Dependencies

- Express.js: Web application framework for routing and middleware.
- Winston: Versatile logger middleware
- Passport: Authentication middleware
- Passport-local: Local authentication strategy for Passport.js
- Connect-flash: Middleware for displaying flash messages

```
npm install express ejs winston passport passport-local connect-flash
```

## Usage

1. After installing dependencies, start the server by running:
```
node server.js
```

2. Open a web browser and navigate to `http://localhost:3000` to access the log viewer.
- **Login**: Access the login page at `/login` to enter your credentials. Incorrect credentials will trigger flash messages. Successful login redirects to the homepage.
- **Log Viewer**: View server logs dynamically in the log viewer.


## Directory Structure

- `views/`: Contains EJS templates for rendering the HTML pages.
- `static/`: Contains static assets such as CSS files.
- `server.js`: The main application file that configures the server and routes.

## Contributing

Contributions to this project are welcome. Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.