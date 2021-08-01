// Function to change error texts
function errorText($id, $text){
    $($id).empty();
    $($id).append($text);
}

$(function(){
    $('#saveProfile').click(function(e){
        e.preventDefault();
	    // Checking form is filled or not
	    if ($('#firstname').val() == "" ||
	        $('#lastname').val() == "" ||
	        $('#address').val() == "" ||
	        $('#about').val() == ""
	    ){
	        errorText("#profileError", "Fill the form");
	    }
	    else if ($('#firstname').val().length > 12 || $('#lastname').val().length > 12){
	        errorText("#profileError", "First & last names must be less than 12 characters");
	    }
	    else if ($('#address').val().length > 50 || $('#address').val().length < 10){
	        errorText("#profileError", "Address must be between 10 & 50 characters");
	    }
	    else if ($('#about').val().length > 200 || $('#about').val().length < 50){
	        errorText("#profileError", "About must be between 50 & 200 characters");
	    }
	    else{
	        errorText("#profileError", "");
            // Sending request to update profile
            $.ajax({
                url: '/update_profile',
                data: $('#profileForm').serialize(),
                type: 'POST',
                success: function(response){
                    if (response["error"] != null){
                        // If some error occurred in python script
                        errorText("#profileError", response["error"]);
                    }
                    else {
                        // If no error then goto home page
                        $(location).attr('href', '/')
                    }
                },
                error: function(error){
                    // If error occurred in post request
                    console.log(error);
                }
            });
	    }
    });
});