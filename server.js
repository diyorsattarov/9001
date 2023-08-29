// Import necessary modules and libraries
const express = require('express');
const path = require('path');
const winston = require('winston');
const fs = require('fs/promises');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

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
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // Add this line to initialize connect-flash
app.use(bodyParser.urlencoded({ extended: false })); // For parsing form data
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

// Endpoint to render the login page
app.get('/login', (req, res) => {
    res.render('login'); // Assuming 'login' is the name of your login view file (e.g., login.ejs)
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

// Login route
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true // Enable flash messages for failed login attempts
    })
);

// Endpoint to fetch flash messages
app.get('/flash-messages', (req, res) => {
    const flashMessages = req.flash('error'); // Assuming you're using 'error' for flash messages
    res.json(flashMessages);
});


// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Protected route (example)
app.get('/protected', (req, res) => {
    if (req.isAuthenticated()) {
        // User is authenticated, proceed
        res.send('Protected content');
    } else {
        // User is not authenticated, redirect to login page
        res.redirect('/');
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

// Mock user data (replace with a real user database)
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

// Configure local strategy
passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
    }
));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});


// Start the server
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
