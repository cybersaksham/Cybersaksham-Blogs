// Function to change error texts
function errorText($id, $text){
    $($id).empty();
    $($id).append($text);
}

$(function(){
	// Pressing send button
	$('#submitButton').click(function(e){
	    e.preventDefault();
	    // Checking form is filled or not
	    if ($('#name').val() == "" ||
	        $('#email').val() == "" ||
	        $('#phone').val() == "" ||
	        $('#message').val() == "")
	    {
	        errorText("#contactError", "Fill the form");
	    }
	    else{
            errorText("#contactError", "");
            // Sending request to send email
            $.ajax({
                url: '/send_email',
                data: $('#contactForm').serialize(),
                type: 'POST'
            });
            $(location).attr('href', 'about')
		}
	});
});