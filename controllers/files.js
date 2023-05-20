const express = require('express');
const router = express();
const cors = require('cors');
const auth = require('../middleware/authorization');
const upload = require('../middleware/upload');
const path = require('path');
const File = require('../models/File');
const User = require('../models/User').User;

router.use(cors());

router.post('/files/add', auth, upload.single('file'), (req, res) => {
    if(!req.file){
        res.sendStatus(400)
    }

    const file = new File({
        userId: req.userData.userId,
        participants: [],
        name: req.body.name,
        type: req.body.type,
        path: req.file.path,
        systemName: req.file.filename
    });

    file.save().then(resp => {
        res.sendStatus(201)
    }).catch(err => {
        console.log(err);
    });
})

router.get('/files', auth, (req, res) => {
    File.find({ userId: req.userData.userId }).exec().then(files => {
        res.status(200).json({ files: files })
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
    });
})

router.get('/files/notSharedWith/:contactId', auth, (req, res) => {
    File.find({ userId: req.userData.userId }).exec().then(files => {
        const filteredFiles = files.filter(el => {
            const participantsIds = el.participants.map(el => el._id.toString())
            if(participantsIds.indexOf(req.params.contactId) === -1) return true;
        })

        res.status(200).json({ files: filteredFiles })
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
    });
})

router.get('/files/sharedWith/:contactId', auth, (req, res) => {
    File.find({ userId: req.userData.userId }).exec().then(files => {
        const filteredFiles = files.filter(el => {
            const participantsIds = el.participants.map(el => el._id.toString())
            if(participantsIds.indexOf(req.params.contactId) !== -1) return true;
        })

        res.status(200).json({ files: filteredFiles })
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
    });
})

//get all files that are shared with the user (where he is a participant for a file)
router.get('/files/shared', auth, (req, res) => {
    File.find().exec().then(allFiles => {
        const userFiles = allFiles.map(file => {
            const participantsIds = file.participants.map(participant => participant._id.toString());
            if(participantsIds.indexOf(req.userData.userId) !== -1){
                return file
            }
        })

        res.status(200).json({ files: userFiles })
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
    })
})

router.get('/files/download/:fileId', auth, (req, res) => {
    //check if user is an author of the file, or a participant
    // res.sendFile(path.resolve("uploads/1684328453309_1386b239-c3d6-45dc-acd0-dbfe8975668b.odt"))
})

router.get('/files/participants/:fileId', auth, async (req, res) => {
    const file = await File.findById(req.params.fileId).exec();
    if(file.userId !== req.userData.userId){
        res.sendStatus(401);
        return;
    }

    res.status(200).json(file.participants)
})

router.post('/files/share', auth, async (req, res) => {
    try{
        const file = await File.findById(req.body.fileId).exec();
        //check if the author of the request is the owner of this file
        if(file.userId !== req.userData.userId){
            res.sendStatus(401);
            return;
        }

        //check if the contact we want to add to the participants already is a participant
        const participantsIds = file.participants.map(el => el._id.toString());
        if(participantsIds.indexOf(req.body.contactId) !== -1){
            res.sendStatus(403);
            return;
        }

        const contact = await User.findById(req.body.contactId);
        file.participants.push(contact)
        file.save().then(resp => {
            res.sendStatus(200)
        }).catch(err => {
            console.log(err)
        })

    } catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/files/removeAccess', auth, async (req, res) => {
    try{
        const file = await File.findById(req.body.fileId).exec();
        //check if the author of the request is the owner of this file
        if(file.userId !== req.userData.userId){
            res.sendStatus(401);
            return;
        }

        //check if the contact we want to remove from the participants is a participant in the first place
        const participantsIds = file.participants.map(el => el._id.toString());
        if(participantsIds.indexOf(req.body.contactId) === -1){
            res.sendStatus(403); //contact is not a participant yet
            return;
        }

        const contact = await User.findById(req.body.contactId);

        const newParticipants = file.participants.filter(el => el._id.toString() !== req.body.contactId);
        file.participants = newParticipants;

        file.save().then(resp => {
            res.sendStatus(200)
        }).catch(err => {
            console.log(err)
        })

    } catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;