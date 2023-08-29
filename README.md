# webapp-prac

Welcome to webapp-prac, a simple web application that provides a log viewer for server logs. This application is built using Node.js and Express.js, with logging capabilities provided by the versatile logger middleware, Winston.

## Features

- Provides a user-friendly web interface for viewing server logs.
- Fetches and displays logs from log files: `combined.log` and `error.log`.
- Logs are displayed in a scrollable console-like box.

## Installation

1. Clone this repository to your local machine.
2. Install Node.js and npm if not already installed.
3. Navigate to the project directory and run the following command to install dependencies:

```
npm install express ejs winston
```


## Dependencies

- Express.js: Web application framework for routing and middleware.
- Winston: Versatile logger middleware

## Usage

1. After installing dependencies, start the server by running:
```
node server.js
```

2. Open a web browser and navigate to `http://localhost:3000` to access the log viewer.

## Directory Structure

- `views/`: Contains EJS templates for rendering the HTML pages.
- `static/`: Contains static assets such as CSS files.
- `server.js`: The main application file that configures the server and routes.
- `logger.js`: Custom logger configuration using Winston.

## Contributing

Contributions to this project are welcome. Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.