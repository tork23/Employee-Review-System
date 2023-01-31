const User = require("../models/users");
const Review = require("../models/review");

// Render Admin Page
module.exports.adminPage = async function(req, res){
    if(!req.isAuthenticated()){
        return res.redirect('/users/login');
    }else{
        if(req.user.isAdmin == false){
            console.log("You are not an admin");
            return res.redirect('/');
        }else{
            try{
                let user = await User.find({});
                var employeeList = [];
                for(let i = 0; i < user.length; i++){
                    var temp = {
                        name : user[i].name,
                        last_name : user[i].last_name,
                        id : user[i].id,
                    };
                    employeeList.push(temp);
                }
                
                return res.render('admin', {
                    title : "ERS | Admin page",
                    employeeList : employeeList,
                });
            }catch(err){
                console.log('Error while admin', err);
                return;
            }
        }
    }
};

// Render Admin Assign Page
module.exports.adminAssignPage = async function(req, res){
    if(!req.isAuthenticated()){
        return res.redirect('/users/login');
    }else{
        if(req.user.isAdmin == false){
            console.log("You are not an admin");
            return res.redirect('/');
        }else{
            try{
                let user = await User.find({});
                var employeeList = [];
                for(let i = 0; i < user.length; i++){
                    var temp = {
                        name : user[i].name,
                        last_name : user[i].last_name,
                        id : user[i].id,
                    };
                    employeeList.push(temp);
                }
                
                return res.render('admin_assign', {
                    title : "ERS | Admin Assign page",
                    employeeList : employeeList,
                });
            }catch(err){
                console.log('Error while admin', err);
                return;
            }
        }
    }
};


// Assign a review task for an employee
module.exports.setReviewrs = async function(req, res){
    try{
        if(!req.isAuthenticated()){
            return res.redirect('/users/login');
        }else{
            let employee = await User.findById(req.user.id);

            if(employee.isAdmin == false){
                console.log("You are not an admin");
                return res.redirect('/');
            }else if(req.body.Reviewer == req.body.Recipient){
                return res.redirect('back');
            }else{
                let reviewer = await User.findById(req.body.Reviewer);
                
                // if reviewer not found
                if(!reviewer){
                    return res.redirect('back');
                }

                let recipient = await User.findById(req.body.Recipient);

                if(!recipient){
                    return res.redirect('back');
                }

                reviewer.to.push(recipient);
                reviewer.save();

                recipient.from.push(reviewer);
                recipient.save();

                return res.redirect('back');
            }
        }
    }catch(err){
        console.log("Error", err);
        return;
    }
    
};

// Function to make Admin to an existing employee
module.exports.newAdmin = async function(req, res){
    try{
        if(!req.isAuthenticated()){
            return res.redirect('/users/login');
        }
        if(req.user.isAdmin == true){
            let employee = await User.findById(req.body.newAdmin);
    
            if(!employee){
                return res.redirect('back');
            }
    
            if(employee.isAdmin == true){
                return res.redirect('back');
            }
    
            if(employee.isAdmin == false){
                employee.isAdmin = true,
                employee.save();
    
                return res.redirect('/admin/admin-page');
            }
        }
    }catch(err){
        console.log("Error", err);
        return;
    };
    
};

// Render Employee List
module.exports.viewEmployees = async function(req, res){
    try{
        if(req.isAuthenticated()){
            if(req.user.isAdmin){
                let employees = await User.find({});
                
                if(employees){
                    return res.render('employee', {
                        title : "ERS | Employee",
                        employees : employees,
                    });
                }
            }else{
                console.log("user is not auth to view list of employees");
                return res.redirect('/');
            }
        }else{
            console.log("user not authenticated");
            return res.redirect("/users/login");
        }
    }catch(err){
        console.log("Error", err);
        return;
    }
};

// Delete existing employee
module.exports.deleteEmployee = async function(req, res){
    try{
        
        if(req.isAuthenticated()){
            if(req.user.isAdmin){
                await User.deleteOne({_id : req.params.id});
                return res.redirect('/admin/view-employees');
            }
        }
    }catch(err){
        console.log("Error", err);
        return;
    }
    
};