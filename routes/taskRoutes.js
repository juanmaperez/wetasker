const express = require('express');
const taskRoutes = express.Router();

const Task = require('../models/task');
const User = require('../models/user');
const Project = require('../models/project');
// falta el módelo de las tareas o recursos. Ya veremos...


// Comprobar autenticación del usuario
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  } else {
    res.redirect('/')
  }
}

taskRoutes.get('/', ensureAuthenticated, (req, res, next)=>{
    Project
    .find({"_creator": req.user._id })
    .populate('_tasks')
    .exec((err, projects) => {
      console.log(projects)
      
      res.render('dashboard/tasks/list', {user: req.user, projects});
    });

})


taskRoutes.post('/new', ensureAuthenticated, (req , res, next)=>{
  let projectInfo = req.body.project.split('-');
  let projectName = projectInfo[0];
  let projectID = projectInfo[1];

  Project.findById(projectID, (err, project)=>{
    if(err || !project){
      return next(new Error("404"));
    }
  

    const newTask = new Task({
      project: projectName,    
      name: req.body.name,
      priority: req.body.priority,
      _project: projectID,
      // We're assuming a user is logged in here
      // If they aren't, this will throw an error
      _creator: req.user._id,
    });

    newTask.save( (err, task) => {
        if (err) {
            res.render('/dashboard/tasks', { task: newTask });

        } else {
            project._tasks.push(task._id);
            project.save( (err) => {
              if (err) {
                return next(err);
              } 
            });
            
            res.redirect(`/dashboard/tasks`);
        }
    });
  });
});
  


taskRoutes.post('/update', ensureAuthenticated, (req, res, next)=>{
  
  Task.findByIdAndUpdate(req.body.taskID, {name : req.body.name}, (error, task)=>{
    if(error){
        console.log("error")
        return res.send('dasboard/tasks');                    
    }
    if (!task) {
        return next(new Error('404'));
    }
  
    return res.status(200).json({message:'success'})
    
  })
})


taskRoutes.post('/check', ensureAuthenticated, (req , res, next)=>{
   
  Task.findByIdAndUpdate(req.body.taskID, {done : true}, (error, task)=>{
      if(error){
          console.log("error")
          return res.send('dashboard/tasks');                    
      }
      if (!task) {
          return next(new Error('404'));
      }

      return res.status(200).json({message:'success'})
      
  });
});


taskRoutes.post('/uncheck', ensureAuthenticated, (req , res, next)=>{
   
  Task.findByIdAndUpdate(req.body.taskID, {done : false}, (error, task)=>{
      if(error){
          console.log("error")
          return res.send('dashboard/tasks');                    
      }
      if (!task) {
          return next(new Error('404'));
      }

      return res.status(200).json({message:'success'})
      
  });
});

taskRoutes.post('/delete/:id', ensureAuthenticated, (req,res,next)=>{
  const projectID = req.body.projectID;
  const taskID = req.params.id;
  
  Project.update(projectID,{ "$pull": { "_tasks": taskID  } }, (error, project)=>{
    Task.findByIdAndRemove(taskID, (err, task)=>{
        if(err){
            next(err);
        }else{
            return res.redirect('/dashboard/tasks');
        }
    })
  })

});


taskRoutes.post('/update-priority', ensureAuthenticated,(req, res, next)=>{
  Task.findByIdAndUpdate(req.body.taskID, {priority : req.body.taskPriority}, (error, task)=>{
    if(error){
        console.log("error")
        return res.send('dasboard/tasks');                    
    }
    if (!task) {
        return next(new Error('404'));
    }
  
    return res.status(200).json({message:'success'})
    
  })
})


module.exports = taskRoutes;