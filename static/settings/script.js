// Function to change error texts
function errorText($id, $text){
    $($id).empty();
    $($id).append($text);
}

$(function(){
    $('#info').show();
    $('#social').hide();
    $('#privacy').hide();
    // Changing Tabs
    $('#info-tab').click(function(e){
        e.preventDefault();
        $('#info').show();
        $('#social').hide();
        $('#privacy').hide();
    });
    $('#social-tab').click(function(e){
        e.preventDefault();
        $('#info').hide();
        $('#social').show();
        $('#privacy').hide();
    });
    $('#privacy-tab').click(function(e){
        e.preventDefault();
        $('#info').hide();
        $('#social').hide();
        $('#privacy').show();
    });
    $('#cancel-tab').click(function(e){
        e.preventDefault();
        $(location).attr('href', '/settings');
    });

    // Updating Profile Info
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

    // Changing social media links
    $('#saveSocial').click(function(e){
        e.preventDefault();
        if ($('#twitter').val().length > 50 ||
        $('#insta').val().length > 50 ||
        $('#github').val().length > 50 ||
        $('#website').val().length > 50)
        {
	        errorText("#socialError", "All links must be less than 50 characters.");
	    }
	    else{
            errorText("#socialError", "");
            // Sending request to update social links
            $.ajax({
                url: '/update_social',
                data: $('#profileForm').serialize(),
                type: 'POST',
                success: function(response){
                    if (response["error"] != null){
                        // If some error occurred in python script
                        errorText("#socialError", response["error"]);
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

    // Updating Password
    $('#updatePassword').click(function(e){
        e.preventDefault();
	    // Checking form is filled or not
	    if ($('#oldPass').val() == "" ||
	        $('#newPass').val() == "" ||
	        $('#confirmPass').val() == ""
	    ){
	        errorText("#privacyError", "Fill the form");
	    }
	    else if ($('#newPass').val() != $('#confirmPass').val()){
	        errorText("#privacyError", "Password does not match.");
	    }
	    else{
	        errorText("#privacyError", "");
            // Sending request to update password
            $.ajax({
                url: '/update_password',
                data: $('#profileForm').serialize(),
                type: 'POST',
                success: function(response){
                    if (response["error"] != null){
                        // If some error occurred in python script
                        errorText("#privacyError", response["error"]);
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