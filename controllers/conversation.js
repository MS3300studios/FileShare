const express = require('express');
const router = express();
const cors = require('cors');
const auth = require('../middleware/authorization');

const serverCorsOptions = {
    origin: "http://localhost:5173"
}

router.use(cors(serverCorsOptions));
const Conversation = require("../models/Chat");
const User = require('../models/User').User;

router.get('/conversation/:secondId', auth, (req, res) => {
    Conversation.find().exec().then(async allConversations => {
        let selectedConversation;
        let conversationWasFound = false;
        allConversations.forEach(conversation => {
            const convParticipants = conversation.participants.map(el => el._id.toString())
            if(convParticipants.indexOf(req.userData.userId) !== -1 && convParticipants.indexOf(req.params.secondId) !== -1){
                selectedConversation = conversation;
                conversationWasFound = true;
            }
        })

        if(!conversationWasFound){
            const user1 = await User.findById(req.userData.userId);
            const user2 = await User.findById(req.params.secondId);

            const newConv = new Conversation({ participants: [user1, user2], messages: [] });
            newConv.save().then(() => {
                res.sendStatus(201)
            }).catch(err => console.log(err))
        } else {
            res.status(200).json(selectedConversation);
        }
    })
})

module.exports = router;