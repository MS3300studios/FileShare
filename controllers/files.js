const express = require('express');
const router = express();
const cors = require('cors');
const auth = require('../middleware/authorization');
const upload = require('../middleware/upload');
const path = require('path');
const File = require('../models/File');

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

router.get('/files/:fileId', auth, (req, res) => {
    //check if user is an author of the file, or a participant
    // res.sendFile(path.resolve("uploads/1684328453309_1386b239-c3d6-45dc-acd0-dbfe8975668b.odt"))
})

module.exports = router;