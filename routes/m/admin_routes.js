const express = require("express");
const adminSchema = require("../../schemas/m/admin_schema");
const authSchema = require("../../schemas/auth_schema");
const tokenSchema = require("../../schemas/token_schema");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const utils = require("../../utils/util_methods");
const constants = require("../../utils/constants");

const router = express.Router();

// Retrieve all admins
router.post("/retrieve/", utils.extractToken, (req, res) => {
    tokenSchema.find({token: req.token})
        .exec()
        .then(resultList => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Invalid Token"
                });
            }
            adminSchema.find((err, adminList) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json({adminList});
                }
            });
        });
});

// Retrieve admin  by ID
router.post("/retrieve/:id", utils.extractToken, (req, res) => {
    tokenSchema.find({token: req.token})
        .exec()
        .then(resultList => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Invalid Token"
                });
            }
            let id = req.params.id;
            adminSchema.find({_id: id})
                .exec()
                .then(adminList => {
                    if (adminList.length < 1) {
                        return res.status(401).json({
                            message: "Authorization Failed!"
                        });
                    }
                    if (adminList) {
                        res.json(adminList[0]);
                    }
                })
        });
});

//Add new admin
router.post("/add", (req, res) => {
    adminSchema.find( { $or:[ {'nic': req.body.nic}, {'phone':req.body.phone} ]},
        function(err,matchingAdmins){
            if (matchingAdmins.length >= 1) {
                console.log(matchingAdmins);
                res.status(409).json({
                    message: "admin already exists"
                });
            } else {
                const  hash = bcrypt.hashSync(req.body.password, 8);
                const newObjectID = mongoose.Types.ObjectId();
                const adminModel = new adminSchema({
                    _id: newObjectID,
                    user_type: constants.USER_TYPE_ADMIN,
                    nic: req.body.nic,
                    email: req.body.email,
                    passport: req.body.passport,
                    title_id: req.body.title_id,
                    first_name: req.body.first_name,
                    middle_name: req.body.middle_name,
                    last_name: req.body.last_name,
                    sex: req.body.sex,
                    dob: req.body.dob,
                    phone: req.body.phone,
                    access_level_id: req.body.access_level_id,
                });
                const authModel = new authSchema({
                    user_id: newObjectID,
                    nic: req.body.nic,
                    phone: req.body.phone,
                    user_type: constants.USER_TYPE_ADMIN,
                    password_hash: hash
                });
                authModel.save().catch(err => {
                    console.log(err.message);
                    res.status(500).json({
                        error: err
                    });
                });
                adminModel
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "admin added",
                            createdAdmin: result
                        });
                    })
                    .catch(err => {
                        console.log(err.message);
                        res.status(500).json({
                            error: err
                        });
                    });
            }
        });
    });

//update
router.post("/update/:id", utils.extractToken, (req, res) => {
    tokenSchema.find({token: req.token})
        .exec()
        .then(resultList => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Invalid Token"
                });
            }
            adminSchema.update({id: req.params.id}, req.body)
                .then(result => {
                    res.status(200).json({
                        message: "Updated successfully",
                        createdParent: result
                    });
                })
                .catch(err => {
                    res.status(400).json({
                        message: "Updating failed",
                        error: err
                    });
                });
        });
});

router.post("/delete/:id", utils.extractToken, (req, res) => {
    tokenSchema.find({token: req.token})
        .exec()
        .then(resultList => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Invalid Token"
                });
            }
            adminSchema.findOneAndDelete({_id: req.params.id}, (err, admin) => {
                if (err) {
                    res.json(err);
                } else {
                    authSchema.findOneAndDelete({user_id: req.params.id}, (err, admin) => {
                        if (err) {
                            res.json(err);
                        } else {
                            tokenSchema.findOneAndDelete({user_id: req.params.id}, (err, admin) => {
                                if (err) {
                                    res.json(err);
                                } else {
                                    res.json("deleted successfully");
                                }
                            });
                        }
                    });
                }
            });
        });
});

module.exports = router;
