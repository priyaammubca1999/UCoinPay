const validator = require('node-validator');

let emptycheck = /([^\s])/;
let email = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

exports.postValidation = (req, res, next) => {
     try {
          let path = req.route.path;
          let data = req.body;
          let check;

          if (path == '/deleteWhitelist') {
               check = validator.isObject()
                    .withRequired('_id', validator.isString({ regex: emptycheck, message: "_id is required" }))
          }
          else if (path == '/setWhitelistStatus') {
               check = validator.isObject()
                    .withRequired('_id', validator.isString({ regex: emptycheck, message: "_id is required" }))
                    .withRequired('status', validator.isNumber())
          }
          else if (path == '/addBlocklist') {
               check = validator.isObject()
                    .withRequired('ip', validator.isString({ regex: emptycheck, message: "Ip is required" }))
          }
          else if (path == '/deleteBlocklist') {
               check = validator.isObject()
                    .withRequired('_id', validator.isString({ regex: emptycheck, message: "_id is required" }))
          }
          else if (path == '/setBlocklistStatus') {
               check = validator.isObject()
                    .withRequired('_id', validator.isString({ regex: emptycheck, message: "_id is required" }))
                    .withRequired('status', validator.isNumber())
          }
          else if (path == '/login') {
               check = validator.isObject()
                    .withRequired('email', validator.isString({ regex: email, message: "Please provide valid email" }))
                    .withRequired('password', validator.isString({ regex: emptycheck, message: "Please provide valid password" }))
                    .withRequired('pattern', validator.isString({ regex: emptycheck, message: "Please provide valid pattern" }))
                    .withOptional('otp', validator.isString({ regex: emptycheck, message: "Otp is required" }))
          }
          else if (path == '/tfasetup') {
               check = validator.isObject()
                    .withOptional('tfaenablekey', validator.isString({ regex: emptycheck, message: "Please provide valid tfa enable key" }))
                    .withOptional('token', validator.isString())
          }
          else if (path == '/changePassword') {
               check = validator.isObject()
                    .withRequired('currentpassword', validator.isString({ regex: emptycheck, message: "Please provide valid current password" }))
                    .withRequired('newpassword', validator.isString({ regex: emptycheck, message: "Please provide valid new password" }))
                    .withRequired('confirmpassword', validator.isString({ regex: emptycheck, message: "Please provide valid confirm password" }))
          }
          else if (path == '/changePattern') {
               check = validator.isObject()
                    .withRequired('currentpattern', validator.isString({ regex: emptycheck, message: "Please provide valid current pattern" }))
                    .withRequired('newpattern', validator.isString({ regex: emptycheck, message: "Please provide valid new pattern" }))
                    .withRequired('confirmpattern', validator.isString({ regex: emptycheck, message: "Please provide valid confirm pattern" }))
          }
          else if (path == '/createNFT') {
               check = validator.isObject()
                    .withRequired('name', validator.isString({ regex: emptycheck, message: "Name is required" }))
                    .withRequired('description', validator.isString({ regex: emptycheck, message: "Description is required" }))
                    .withRequired('tokenId', validator.isString({ regex: emptycheck, message: "Token Id is required" }))
                    .withRequired('ownerAddress', validator.isString({ regex: emptycheck, message: "Owner address is required" }))
                    .withRequired('orderData', validator.isArray())
                    .withRequired('buyerSignTuple', validator.isArray())
                    .withRequired('signTuple', validator.isArray())
          }
          else if (path == '/createOrder') {
               check = validator.isObject()
                    .withRequired('userNftId', validator.isString({ regex: emptycheck, message: "Token Id is required" }))
                    .withRequired('duration', validator.isString({ regex: emptycheck, message: "Duration is required" }))
                    .withRequired('orderType', validator.isString({ regex: emptycheck, message: "Order type is required" }))
                    .withRequired('orderPlacer', validator.isString({ regex: emptycheck, message: "Order placer is required" }))
                    .withRequired('amount', validator.isString({ regex: emptycheck, message: "Amount is required" }))
                    .withRequired('status', validator.isString({ regex: emptycheck, message: "Status is required" }))
          }
          else if (path === '/register') {
               check = validator.isObject()
                    .withRequired('email', validator.isString({ regex: email, message: "Email is Required" }))
                    .withRequired('password', validator.isString({ regex: emptycheck, message: "Password is Required" }))
          }
          else if (path === '/addCourse') {
               check = validator.isObject()
                    .withRequired('university', validator.isString({ regex: emptycheck, message: "University is Required" }))
                    .withRequired('name', validator.isString({ regex: emptycheck, message: "Course Name is Required" }))
                    .withRequired('level', validator.isString({ regex: emptycheck, message: "Course Level is Required" }))
          }
          else if (path === '/updateCourse') {
               check = validator.isObject()
                    .withRequired('university', validator.isString({ regex: emptycheck, message: "University is Required" }))
                    .withRequired('name', validator.isString({ regex: emptycheck, message: "Course Name is Required" }))
                    .withRequired('level', validator.isString({ regex: emptycheck, message: "Course Level is Required" }))
                    .withRequired('updatedUniversity', validator.isString({ regex: emptycheck, message: "University is Required" }))
                    .withRequired('updatedName', validator.isString({ regex: emptycheck, message: "Course Name is Required" }))
          }
          else if (path === '/universityData') {
               check = validator.isObject()
                    .withRequired('country', validator.isString({ regex: emptycheck, message: 'Country is Required' }))
                    .withRequired('city', validator.isString({ regex: emptycheck, message: 'City is Required' }))
                    .withRequired('name', validator.isString({ regex: emptycheck, message: 'Name is Required' }))
                    // .withRequired('type', validator.isString({ regex: emptycheck, message: 'Type is Required' }))
                    // .withRequired('coordinates', validator.isObject({ regex: emptycheck, message: 'Coordinates is Required' }))
                    // .withRequired('studentsYear', validator.isString({ regex: emptycheck, message: ' Year is Required' }))
                    .withOptional('location', validator.isObject())
                    .withOptional('students', validator.isArray())
          }
          else if (path === '/addCourseData') {
               check = validator.isObject()
                    .withRequired('name', validator.isString({ regex: emptycheck, message: 'name is required' }))
                    .withRequired('Appurtunity', validator.isString({ regex: emptycheck, message: 'Appurtunity is required' }))
          }

          validator.run(check, data, (errorcount, errors) => {
               if (errorcount == 0) {
                    next();
               } else {
                    let errormsg = '';
                    for (let i = 0; i < errors.length; i++) {
                         if (errormsg != '') {
                              errormsg += ', ';
                         }
                         if (errors[i].message == 'Required value.' && errors[i].value == undefined) {
                              errors[i].message = errors[i].parameter + ' is required'
                         }
                         else if (errors[i].value != undefined || errors[i].value == "" || errors[i].value == [] || errors[i].message == "Unexpected value.") {
                              errors[i].message = "Not a valid " + errors[i].parameter
                         }
                         else {
                              errors[i].message = errors[i].message;
                         }
                         errormsg += errors[i].message;
                    }
                    res.json({ "status": false, "message": errormsg })
               }
          })
     } catch (e) {
          console.log("Error catched in validation", e);
          res.json({ "status": false, "message": "Oops! Something went wrong. Please try again later" })
     }
}