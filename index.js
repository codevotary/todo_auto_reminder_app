'use strict'

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

require("dotenv").config()

const todo = require("./routes/todo/routes");

const app = express();
app.use(express.json())
app.use(cors())
app.use("/todo", todo);

app.get("/", (req, res) => {
    res.status(200).json({
        success: 1,
        message: "OK"
    })
})

const PORT = process.env.PORT || 3500;




app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})

