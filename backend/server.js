const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const dbRoute = "mongodb+srv://test:test123@testcluster-jmy3i.mongodb.net/test?retryWrites=true";

mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
});

router.post('/updateData', (req, res) => {
    const { id, update } = req.body;
    Data.findByIdAndUpdate(id, update, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

router.delete('/deleteData', (req, res) => {
    const { id } = req.body;
    Data.findByIdAndRemove(id, (err) => {
        if (err) return res.send(err);
        return res.json({ success: true });
    });
});

allElementsFilled = (id, vorname, nachname, geschlecht, strasse, postleitzahl, ort) => {
    if (!id && id !== 0) {
        return false
    } else if (!vorname) {
        return false
    } else if (!nachname) {
        return false
    } else if (!geschlecht) {
        return false
    } else if (!strasse) {
        return false
    } else if (!postleitzahl) {
        return false
    } else if (!ort) {
        return false
    }
    return true
}

router.post('/putData', (req, res) => {
    let data = new Data();

    const { id, vorname, nachname, geschlecht, strasse, postleitzahl,ort } = req.body;

    if (!allElementsFilled) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS',
        });
    }
    data.vorname = vorname;
    data.nachname = nachname;
    data.geschlecht = geschlecht;
    data.strasse = strasse;
    data.postleitzahl = postleitzahl;
    data.ort = ort;
    data.id = id;
    data.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

app.use('/api', router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));