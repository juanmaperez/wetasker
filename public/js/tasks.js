$(document).ready(function(){
    var priority = ["hoy", "mañana", "esta semana", "este mes"];
    var priorityColor = ["#ff5252", "#f7bb62", "#f9e654", "#79e5b1"];


    $('.task-name').focusout(function(){
        let data = {};
        data.taskID = $(this).attr('id');
        data.name = $(this).val();
        
        $.ajax({
            method:  'POST',
            url:     'http://localhost:3000/dashboard/tasks/update',
              // The data key is for sending data in a POST, PUT or PATCH!
            data:    data,
            success: (response)=> {
                        $('.popup-success').show('slow', function(){
                            $('.popup-success').fadeOut('3000'); 
                        })
                        console.log(response.message)
                    },
            error:   (error) => {
                        $('.popup-error').show('slow', function(){
                            $('.popup-error').fadeOut('3000'); 
                        })
                    }
        });

        
        console.log(data);
    });


    $('.check-task').click(function(){
        let data = {};
        if($(this).hasClass("undone")){
            var url = 'http://localhost:3000/dashboard/tasks/check'
        } else {
            var url = 'http://localhost:3000/dashboard/tasks/uncheck'            
        }
        data.taskID = $(this).attr('data-taskID');

        $('#'+data.taskID).toggleClass("line-through");
        $(this).toggleClass('undone');
        $(this).toggleClass('done');
        
        $.ajax({
            method:  'POST',
            url:     url,
            // The data key is for sending data in a POST, PUT or PATCH!
            data:    data,
            success: (response)=> {
                $('.popup-success').show('slow', function(){
                    $('.popup-success').fadeOut('3000'); 
                })
                console.log(response.message)
            },
            error:   (error) => {
                $('.popup-error').show('slow', function(){
                    $('.popup-error').fadeOut('3000'); 
                })
            }
        });
        console.log(data.taskID);
    });

    $( function() {
        $( ".sortable" ).sortable({
          connectWith: "div",
          placeholder: 'line-dotted'
        });
    
    } );
  
})