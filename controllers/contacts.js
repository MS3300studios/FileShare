const express = require('express');
const router = express();
const cors = require('cors');
const auth = require('../middleware/authorization');

const serverCorsOptions = {
    origin: "http://localhost:5173"
}

router.use(cors(serverCorsOptions));
const Contacts = require("../models/ContactsList");
const User = require('../models/User').User;

router.get('/contacts', auth, (req, res) => {
    Contacts.findOne({userId: req.userData.userId})
        .exec()
        .then(resp => {
            return res.status(200).json(resp)
        }).catch(err => res.status(500).json({ error: err }));
});

router.get('/contacts/people', auth, (req, res) => {
    User.find()
        .exec()
        .then(resp => {
            const usersNoSelf = resp.filter(el => {
                const idstring = el._id.toString()
                return idstring !== req.userData.userId
            })

            const dtoArray = usersNoSelf.map(user => ({
                _id: user._id,
                email: user.email,
                nickname: user.nickname,
                photo: user.photo
            }));
            
            return res.status(200).json(dtoArray)
        }).catch(err => res.status(500).json({ error: err }));
});

module.exports = router;