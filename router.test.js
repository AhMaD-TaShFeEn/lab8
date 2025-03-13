const request = require('supertest');
const express = require('express');
const router = require('./router.js'); // Ensure router.js also uses CommonJS

const app = express();
app.use(express.json()); 
app.use(router);

describe('API Routes', () => {
    
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({ username: 'testuser', password: 'testpass' });

        expect(response.status).toBe(201);
        expect(response.text).toBe('User created');
    });

    it('should not register an existing user', async () => {
        await request(app)
            .post('/register')
            .send({ username: 'testuser', password: 'testpass' });

        const response = await request(app)
            .post('/register')
            .send({ username: 'testuser', password: 'testpass' });

        expect(response.status).toBe(400);
        expect(response.text).toBe('User already exists');
    });

    it('should allow login for a registered user', async () => {
        await request(app)
            .post('/register')
            .send({ username: 'loginuser', password: 'password' });

        const response = await request(app)
            .post('/login')
            .send({ username: 'loginuser', password: 'password' });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Login successful');
    });

    it('should reject login for incorrect credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: 'wronguser', password: 'wrongpass' });

        expect(response.status).toBe(401);
        expect(response.text).toBe('Invalid credentials');
    });

    it('should create a new event', async () => {
        const response = await request(app)
            .post('/events')
            .send({ name: 'Event 1', description: 'Test Event', date: '2025-01-01', time: '10:00' });

        expect(response.status).toBe(201);
        expect(response.text).toBe('Event created');
    });

    it('should create a new category', async () => {
        const response = await request(app)
            .post('/categories')
            .send({ name: 'Music' });

        expect(response.status).toBe(201);
        expect(response.text).toBe('Category created');
    });

    it('should create a new reminder', async () => {
        await request(app)
            .post('/events')
            .send({ name: 'Meeting', description: 'Office Meeting', date: '2025-01-10', time: '15:00' });

        const response = await request(app)
            .post('/reminders')
            .send({ event: 'Meeting', time: '14:30' });

        expect(response.status).toBe(201);
        expect(response.text).toBe('Reminder set');
    });

    it('should retrieve all events', async () => {
        await request(app)
            .post('/events')
            .send({ name: 'Birthday Party', description: 'Party Event', date: '2025-02-15', time: '18:00' });

        const response = await request(app)
            .get('/events');

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

});
