const express = require('express'),
    router = express.Router(),
    auth = require('./authFirebase');

// Authenticate user
router.get('/', async (req, res) => {
    try {
        const user = await auth.getAllUsers();
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;
