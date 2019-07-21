const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('In the comics home route..');
});

module.exports = router;