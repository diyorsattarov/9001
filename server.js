const express = require('express');
const path = require('path');
const logger = require('./logger'); 

const app = express();
const port = process.env.PORT || 3000;
  
logger.info('Server starting...');

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'static')));

app.use((req, res, next) => {
    logger.info(`Request made to: ${req.method} ${req.url}`);
    next();
});

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/logs', (req, res) => {
    const logs = readLogsFromFiles();
    res.json(logs);
});

function readLogsFromFiles() {
    const fs = require('fs');
    const logs = [];
    
    try {
        const combinedLog = fs.readFileSync('combined.log', 'utf8');
        const errorLog = fs.readFileSync('error.log', 'utf8');
        logs.push(...combinedLog.split('\n'), ...errorLog.split('\n'));
    } catch (error) {
        logger.error('Error reading log files:', error);
    }

    return logs.filter(log => log.trim() !== '');
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
