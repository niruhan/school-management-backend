const express = require("express");
const router = express.Router();
const teacherSchema = require("../schemas/teacher_schema");

router.get("/test", (req, res) => res.json({msg: "instructor Works"}));

//login
router.post("/login", (req, res) => {
    console.log(req.body.instructorID);
    teacherSchema.find({instructorID: req.body.instructorID})
        .exec()
        .then(inst => {
            console.log(inst);
            if (inst.length < 1) {
                return res.status(401).json({
                    message: 'Authorization Failed!'
                });
            }
            if (inst) {
                //correct password
                const token = jwt.sign({
                        id: inst[0]._id,
                        instructorID: inst[0].instructorID,
                        userType: inst[0].userType
                    },
                    JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                // console.log(instructorID);
                return res.status(200).json({
                    message: 'Authorization Success',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Authorization Failed!'
            });
        }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

//Get all teachers
router.get("/", (req, res) => {
    teacherSchema.find((err, instructor) => {
        if (err) {
            console.log(err);
        } else {
            res.json(instructor);
        }
    });
});

//Get Instructor By ID
router.get("/:id", (req, res) => {
    let id = req.params.id;
    teacherSchema.findById(id, (err, instructor) => {
        res.json(instructor);
    });
});

//add new Instructor
router.post("/add", (req, res) => {
    let instructormodel = new teacherSchema(req.body);

    instructormodel
        .save()
        .then(instructor => {
            res.status(200).json({teacher: "instructor added successfully"});
        })
        .catch(err => {
            res.status(400).send("adding new instructor failed");
        });
});

//Update instructor
router.post("/update/:id", (req, res) => {
    teacherSchema.findById(req.params.id, (err, instructor) => {
        if (!instructor) {
            res.status(404).send("data is not found");
        } else {
            instructor.name = req.body.name;
            instructor.mail = req.body.mail;
            instructor.contactNumber = req.body.number;
            instructor.dept = req.body.dept;
            instructor.title = req.body.title;
            instructor.password = req.body.password;

            instructor
                .save()
                .then(instructor => {
                    res.json("instructor updated");
                })
                .catch(err => {
                    res.status(400).send("updated not successfully");
                });
        }
    });
});

//instructor Delete
router.delete("/delete/:id", (req, res) => {
    teacherSchema.findOneAndDelete(
        {_id: req.params.id},
        (err, instructor) => {
            if (err) {
                res.json(err);
            } else {
                res.json("deleted successfully");
            }
        }
    );
});

module.exports = router;
