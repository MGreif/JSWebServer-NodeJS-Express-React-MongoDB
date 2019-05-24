// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
    {
        id: Number,
        vorname: String,
        nachname: String,
        alter: Number
    },
    { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);
