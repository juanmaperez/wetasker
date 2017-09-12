$(document).ready(function(){
    $('.project-name').focusout(function(){
        let data = {};
        data.projectID = $(this).attr('id');
        data.name = $(this).val();

        $.ajax({
            method:  'POST',
            url:     'http://localhost:3000/dashboard/projects/update',
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

        //console.log(data)
          
    })

   
});    