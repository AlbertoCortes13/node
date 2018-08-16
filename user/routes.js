const express = require('express');
const userService = require('./userService');
const log = require('../__utils__/logger');

const router = express.Router();

router.use((req, res, next) => {
    log.info(`Running ${req.method} at /users${req.url}`);
    next(); // make sure we go to the next routes and don't stop here
});

// Get All Users
router.get('/', async (req, res) => {
    try {
        const user = await userService.getAllUsers();
        res.status(user.status).json(user);
    } catch (e) {
        log.error(e.message);
        res.status(500).json(e);
    }
});

// View Account Information
router.get('/info', async (req, res) => {
    try {
        const userInfo = await userService.getUserInfo(req.headers['x-gsw-session-token']);
        res.status(userInfo.status).json(userInfo);
    } catch (e) {
        log.error(e);
        res.status(500).json(e);
    }
});

// Get user by id
router.get('/id=:id', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(user.status).json(user);
    } catch (e) {
        log.error(e);
        res.status(500).json(e);
    }
});

// Get user by email
router.get('/email=:email', async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.params.email);
        res.status(user.status).json(user);
    } catch (e) {
        log.error(e);
        res.status(500).json(e);
    }
});

// Modify user
router.put('/id=:id', async (req, res) => {
    try {
        const status = await userService.updateExistingUser(req.params.id, req.body);
        res.status(status.status).json(status);
    } catch (e) {
        log.error(e.message);
        res.status(500).send(e.message);
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const status = await userService.login(req.body);
        res.status(status.status).json(status);
    } catch (e) {
        log.error(e);
        res.status(500).json(e);
    }
});

// Logout User
router.post('/logout', async (req, res) => {
    try {
        await userService.logout(req.headers['x-gsw-session-token']);
        res.status(200);
    } catch (e) {
        log.error(e);
        res.status(500).json(e);
    }
});

// Create account
router.post('/', async (req, res) => {
    try {
        const response = await userService.createUserAccount(req.body);
        res.status(response.status).json(response);
    } catch (e) {
        log.error(e.stack);
        res.status(500).json(e.message);
    }
});

// Remove user
router.delete('/id=:id', async (req, res) => {
    try {
        const status = await userService.removeExistingUserById(req.params.id);
        res.status(status.status).json(status);
    } catch (e) {
        log.error(e);
        res.status(500).send(e);
    }
});

// Remove User
router.delete('/email=:email', async (req, res) => {
    try {
        const status = await userService.removeExistingUserByEmail(req.params.email);
        res.status(status.status).json(status);
    } catch (e) {
        // Handling your errors
        log.error(e);
        res.status(500).send(e);
    }
});

// Get if user is Season Ticket Holder or Media Member
router.get('/is_ticket_holder', async (req, res) => {
    try {
        const status = await userService.getVisitorInformation(req.headers['x-gsw-session-token']);
        res.status(status.status).json(status);
    } catch (e) {
        // Error Handling
        log.error(e);
        res.status(500).json(e);
    }
});

module.exports = router;
