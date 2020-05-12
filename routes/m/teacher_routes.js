const express = require("express");
const router = express.Router();
const teacherSchema = require("../../schemas/m/teacher_schema");
const authSchema = require("../../schemas/auth_schema");
const meetingSchema = require("../../schemas/meeting_schema");
const tokenSchema = require("../../schemas/token_schema");
const utils = require("../../utils/util_methods");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const configs = require("../../config/config.json");
const constants = require("../../utils/constants");

//Get all teachers
router.post("/retrieve",  utils.extractToken, (req, res) => {
    tokenSchema.find({token: req.token})
        .exec()
        .then(resultList => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Invalid Token"
                });
            }
            teacherSchema.find((err, teacher) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(teacher);
                }
            });
        });
});

//Get teacher By ID
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
            teacherSchema.find({id: id})
                .exec()
                .then(teacherList => {
                    if (teacherList.length < 1) {
                        return res.status(401).json({
                            message: "Authorization Failed!"
                        });
                    }
                    if (teacherList) {
                        res.json(teacherList[0]);
                    }
                })
        });
});

//add new teacher
router.post("/add", utils.extractToken, (req, res) => {
    tokenSchema.find({token: req.token})
        .exec()
        .then(resultList => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Invalid Token"
                });
            }
            const  hash = bcrypt.hashSync(req.body.password, 8);
            const newObjectID = mongoose.Types.ObjectId();
            let teacherModel = new teacherSchema({
                _id: newObjectID,
                user_type: constants.USER_TYPE_TEACHER,
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
                reg_no: req.body.reg_no,
                reg_date: req.body.reg_date,
                end_date: req.body.end_date,
                teacher_grade_id: req.body.teacher_grade_id,
                marital_status_id: req.body.marital_status_id,
            });
            const authModel = new authSchema({
                user_id: newObjectID,
                nic: req.body.nic,
                phone: req.body.phone,
                userType: constants.USER_TYPE_TEACHER,
                passwordHash: hash
            });
            authModel.save().catch(err => {
                console.log(err.message);
                res.status(500).json({
                    error: err
                });
            });
            teacherModel
                .save()
                .then(result => {
                    res.status(200).json({
                        message: "New teacher added successfully",
                        createdTeacher: result
                    });
                })
                .catch(err => {
                    res.status(400).json({
                        message: "Adding new teacher failed",
                        error: err
                    });
                });
        });
});

//Update teacher
router.post("/update/:id", utils.extractToken, (req, res) => {
    tokenSchema.find({token: req.token})
        .exec()
        .then(resultList => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Invalid Token"
                });
            }
            teacherSchema.update({id: req.params.id}, req.body)
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

//teacher Delete
router.delete("/delete/:id", utils.extractToken, (req, res) => {
    tokenSchema.find({token: req.token})
        .exec()
        .then(resultList => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Invalid Token"
                });
            }
            teacherSchema.findOneAndDelete(
                {id: req.params.id},
                (err, teacher) => {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json("Deleted successfully");
                    }
                }
            );
        });
});

// teacher schedules a parent meeting
router.post("/scheduleMeeting", utils.extractToken, (req, res) => {
    tokenSchema.find({token: req.token})
        .exec()
        .then(resultList => {
            if (resultList.length < 1) {
                return res.status(401).json({
                    message: "Invalid Token"
                });
            }
            const meetingModel = new meetingSchema({
                _id: mongoose.Types.ObjectId(),
                teacherID: req.body.teacherID,
                parentIDs: req.body.parentIDs,
                date: req.body.date,
            });
            meetingModel.save()
                .then(result => {
                    res.status(200).json({
                        message: "Parent-Teacher meeting added successfully",
                        createdMeeting: result
                    });
                })
                .catch(err => {
                console.log(err.message);
                res.status(500).json({
                    error: err
                });
            });
        });
});

module.exports = router;
