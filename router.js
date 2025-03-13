const express = require('express');
const router = express.Router();

const users = new Map(); // Mock user storage
const events = [];
const categories = [];
const reminders = [];

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.has(username)) {
        return res.status(400).send('User already exists');
    }
    users.set(username, password);
    res.status(201).send('User created');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users.get(username) === password) {
        return res.status(200).send('Login successful');
    }
    res.status(401).send('Invalid credentials');
});

router.post('/events', (req, res) => {
    events.push(req.body);
    res.status(201).send('Event created');
});

router.post('/categories', (req, res) => {
    categories.push(req.body);
    res.status(201).send('Category created');
});

router.post('/reminders', (req, res) => {
    reminders.push(req.body);
    res.status(201).send('Reminder set');
});

router.get('/events', (req, res) => {
    res.status(200).json(events);
});

module.exports = router;
