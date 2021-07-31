// Function to change error texts
function errorText($id, $text){
    $($id).empty();
    $($id).append($text);
}

$(function(){
    // Initially showing login form
    $('#register-form').hide();
    $('#forgot-form').hide();
    $('#login-form').show();

    // Pressing register either button
	$('#registerEither').click(function(e){
	    errorText("#loginError", "")
	    errorText("#forgotError", "")
	    e.preventDefault();
		$('#register-form').show();
        $('#login-form').hide();
        $('#forgot-form').hide();
	});

    // Pressing login either button
	$('#loginEither').click(function(e){
	    errorText("#registerError", "")
	    errorText("#forgotError", "")
	    e.preventDefault();
		$('#register-form').hide();
        $('#login-form').show();
        $('#forgot-form').hide();
	});
	$('#loginEither2').click(function(e){
	    errorText("#registerError", "")
	    errorText("#forgotError", "")
	    e.preventDefault();
		$('#register-form').hide();
        $('#login-form').show();
        $('#forgot-form').hide();
	});

	// Pressing forgot password button
	$('#forgotPassword').click(function(e){
	    errorText("#registerError", "")
	    errorText("#loginError", "")
	    e.preventDefault();
		$('#register-form').hide();
        $('#login-form').hide();
        $('#forgot-form').show();
	});

	// Pressing send otp button on register form
	$('#sendOtp').click(function(e){
	    e.preventDefault();
	    errorText("#registerError", "")
	    // Checking for email filled or not
	    if ($('#register_email').val() == ""){
	        errorText("#registerError", "Fill the email.")
	    }
	    else{
	        // Sending request to send otp
            $.ajax({
                url: '/send_otp',
                data: $('#register-form-group').serialize(),
                type: 'POST',
                success: function(response){
                    if (response["response"]["otp"] == null){
                        // If otp not sent successfully
                        errorText("#registerError", "Some error occurred. Try again.")
                    }
                },
                error: function(error){
                    // If error occurred in sending request
                    errorText("#registerError", "Some error occurred. Try again.")
                }
            });
        }
	});

	// Pressing send otp button on forgot password form
	$('#sendOtpForgot').click(function(e){
	    e.preventDefault();
	    errorText("#forgotError", "")
	    // Checking email is filled or not
	    if ($('#forgot_email').val() == ""){
	        errorText("#forgotError", "Fill the email.")
	    }
	    else{
	        // Sending request to send otp
            $.ajax({
                url: '/send_otp',
                data: $('#forgot-form-group').serialize(),
                type: 'POST',
                success: function(response){
                    if (response["response"]["otp"] == null){
                        // If otp is not sent successfully
                        errorText("#forgotError", "Some error occurred. Try again.")
                    }
                },
                error: function(error){
                    // If error occurred in post request
                    errorText("#forgotError", "Some error occurred. Try again.")
                }
            });
        }
	});

	// Logging in
	$('#loginBtn').click(function(e){
	    e.preventDefault();
	    // Checking form is filled or not
	    if ($('#login_email').val() == "" ||
	        $('#login_password').val() == "")
	    {
	        errorText("#loginError", "Fill the form");
	    }
	    else{
            errorText("#loginError", "");
            // Sending request to getting logged in
            $.ajax({
                url: '/login_user',
                data: $('#login-form-group').serialize(),
                type: 'POST',
                success: function(response){
                    if (response["error"] != null){
                        // If some error occurred in python script
                        errorText("#loginError", response["error"]);
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

	// Registering new user
	$('#registerBtn').click(function(e){
	    e.preventDefault();
	    // Checking form is filled or not
	    if ($('#register_email').val() == "" ||
	        $('#register_password').val() == "" ||
	        $('#register_otp').val() == ""
	    ){
	        errorText("#registerError", "Fill the form");
	    }
	    else{
            errorText("#registerError", "");
            // Sending request to getting registered
            $.ajax({
                url: '/register_user',
                data: $('#register-form-group').serialize(),
                type: 'POST',
                success: function(response){
                    if (response["error"] != null){
                        // If some error occurred in python script
                        errorText("#registerError", response["error"]);
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

	// Forgot Password
	$('#forgotBtn').click(function(e){
	    e.preventDefault();
	    // Checking form is filled or not
	    if ($('#forgot_email').val() == "" ||
	        $('#forgot_password').val() == "" ||
	        $('#forgot_otp').val() == ""
	    ){
	        errorText("#forgotError", "Fill the form");
	    }
	    else{
            errorText("#forgotError", "");
            // Sending request to update password
            $.ajax({
                url: '/forgot_user',
                data: $('#forgot-form-group').serialize(),
                type: 'POST',
                success: function(response){
                    if (response["error"] != null){
                        // If some error occurred in python script
                        errorText("#forgotError", response["error"]);
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