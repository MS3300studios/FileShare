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
            const safeContacts = resp.contacts.map(contact => ({
                nickname: contact.nickname,
                email: contact.email,
                photo: contact.photo,
                _id: contact._id
            }));

            const safeDto = {
                userId: resp.userId,
                contacts: safeContacts
            }

            return res.status(200).json(safeDto)
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        });
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

router.get('/contacts/add/:personId', auth, async (req, res) => {
    const userContacts = await Contacts.findOne({userId: req.userData.userId}).exec();
    let isPersonAlreadyInContacts = false;
    userContacts.contacts.forEach(contact => {
        if(contact._id.toString() === req.params.personId) isPersonAlreadyInContacts = true
    });

    if(isPersonAlreadyInContacts){
        return res.status(400).json({ error: "user already in contacts "})
    }

    User.findById(req.params.personId).exec().then(newContact => {
        userContacts.contacts.push(newContact)
        userContacts.save()
            .then(resp => {
                res.status(200).json({ message: "user added" });
            })
            .catch(err => console.log(err));
    })    
});

router.get('/contacts/remove/:personId', auth, async (req, res) => {
    const userContacts = await Contacts.findOne({userId: req.userData.userId}).exec();
    const newContacts = userContacts.contacts.filter(el => el._id.toString() !== req.params.personId)
    console.log(newContacts)

    userContacts.contacts = newContacts;
    userContacts.save().then(resp => {
        res.status(200).json(resp);
    }).catch(err => {
        console.log("error in saving usercontacts after deleting user from that list", err)
        res.status(500).json({error: err})
    });
})

module.exports = router;