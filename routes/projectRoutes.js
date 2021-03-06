const express = require('express');
const projectRoutes = express.Router();

const Project = require('../models/project');
const User = require('../models/user')
const Task = require('../models/task')


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); 
    } else {
      res.redirect('/')
    }
}

projectRoutes.get('/', ensureAuthenticated, (req,res, next)=>{
    Project
        .find({"_creator": req.user._id })
        .populate('_tasks')
        .exec((err, projects) => {
        res.render('dashboard/projects/list', {user: req.user, projects});
    });
})


projectRoutes.post('/new', ensureAuthenticated, (req, res , next)=>{
    const newProject = new Project({
        color: req.body.color,
        name : req.body.name,
        _creator: req.user._id
    })

    newProject.save( (err) => {
        if (err) {
            res.render('/dashboard/projects/list', { project: newProject });
        } else {
            res.redirect(`/dashboard/projects`);
        }
    });
})

projectRoutes.post('/update', ensureAuthenticated, (req, res , next)=>{
    const projectID = req.body.projectID;
    const name = req.body.name;

    Project.findByIdAndUpdate(projectID, {name : name},(err, project)=>{
        if(err){
            console.log("error")
            return res.send('dasboard/projects');                    
        }
        if (!project) {
            return next(new Error('404'));
        }
        return res.status(200).json({message:'success'})
        
    })
})

projectRoutes.post('/delete/:id', ensureAuthenticated, (req, res, next)=>{
    Project.findByIdAndRemove(req.params.id, (err, project)=>{
        if(err){
            next(err);
        } else {

            if(project._tasks.length > 0){
                
                Task.remove({"_project": req.params.id}, (error, removed)=>{
                    if(error){
                        next(error);
                    }
                })
            }
       
            return res.redirect('/dashboard/projects');
            
        }
    })
})
    

module.exports = projectRoutes