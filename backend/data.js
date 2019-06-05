// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
    {
        id: Number,
        vorname: String,
        nachname: String,
        geschlecht: String,
        strasse: String,
        postleitzahl: Number,
        ort: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);
