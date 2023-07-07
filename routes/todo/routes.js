"use strict"

const express = require("express");
const router = express.Router()

const {
    add, 
    get,
    modify,
    remove
} = require("./controller");

router.post("/add", add)
router.get("/", get)
router.put("/:title", modify)
router.delete("/:title", remove)

module.exports = router;