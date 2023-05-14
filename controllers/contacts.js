const express = require('express');
const router = express();
const cors = require('cors');
const auth = require('../middleware/authorization');

const serverCorsOptions = {
    origin: "http://localhost:5173"
}

router.use(cors(serverCorsOptions));
const Contacts = require("../models/ContactsList");

router.get('/contacts', auth, (req, res) => {
    Contacts.findOne({userId: req.userData.userId})
        .exec()
        .then(resp => {
            console.log(resp)
            return res.status(200).json(resp)
        }).catch(err => res.status(500).json({ error: err }));
});

module.exports = router;