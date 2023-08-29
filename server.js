// Import necessary modules and libraries
const express = require('express');
const path = require('path');
const winston = require('winston');
const fs = require('fs/promises');

// Create a logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Create an Express app instance
const app = express();
const port = process.env.PORT || 3000;

// Set up view engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));

// Middleware to log requests
app.use((req, res, next) => {
    logger.info(`Request made to: ${req.method} ${req.url}`);
    next();
});

// Endpoint to serve favicon
app.get('/favicon.ico', (req, res) => res.status(204));

// Endpoint to render the index page
app.get('/', (req, res) => {
    res.render('index');
});

// Endpoint to fetch logs
app.get('/logs', async (req, res) => {
    try {
        const logs = await readLogsFromFiles();
        res.json(logs);
    } catch (error) {
        logger.error('Error reading log files:', error);
        res.status(500).json({ error: 'An error occurred while fetching logs.' });
    }
});

// Function to read logs from files
async function readLogsFromFiles() {
    try {
        const combinedLog = await fs.readFile('combined.log', 'utf8');
        const errorLog = await fs.readFile('error.log', 'utf8');
        const logs = [...combinedLog.split('\n'), ...errorLog.split('\n')];
        return logs.filter(log => log.trim() !== '');
    } catch (error) {
        throw error;
    }
}

// Start the server
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
