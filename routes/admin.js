
const express = require('express');
const router = express.Router();
const passport = require('passport');

const adminController = require('../controllers/admin_controller');

// Render admin page
router.get('/admin-page', passport.checkAuthentication, adminController.adminPage);

// Render admin assign page
router.get('/admin-assign-page', passport.checkAuthentication, adminController.adminAssignPage);

// Set reviewers to employee
router.post('/set-Reviewers', passport.checkAuthentication, adminController.setReviewrs);

// Make new admin
router.post('/newAdmin', passport.checkAuthentication, adminController.newAdmin);

// Viewing all employees list
router.get('/view-employees', passport.checkAuthentication, adminController.viewEmployees);

// Delete an employee
router.get('/delete-employee/:id', passport.checkAuthentication, adminController.deleteEmployee);

module.exports = router;