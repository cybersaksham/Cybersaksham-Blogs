// Function to change error texts
function errorText($id, $text){
    $($id).empty();
    $($id).append($text);
}

$(function(){
    // Pressing cancel button
    $('#cancel-tab').click(function(e){
        e.preventDefault();
        $(location).attr('href', '/post/' + (window.location.href.split("/"))[(window.location.href.split("/")).length - 2]);
    });

	// Pressing edit post button
	$('#editPostSubmit').click(function(e){
	    e.preventDefault();
	    // Checking form is filled or not
	    if ($('#title').val().length < 5 || $('#title').val().length > 30
	    ){
	        errorText("#editPostError", "Title must be between 5 & 30 characters.");
	    }
	    else if ($('#subtitle').val().length < 5 || $('#subtitle').val().length > 30
	    ){
	        errorText("#editPostError", "Subtitle must be between 5 & 30 characters.");
	    }
	    else if ($('#description').val().length < 10 || $('#description').val().length > 100
	    ){
	        errorText("#editPostError", "Description must be between 10 & 100 characters.");
	    }
	    else if ($('#content').val().length < 50 || $('#content').val().length > 500
	    ){
	        errorText("#editPostError", "Content must be between 50 & 500 characters.");
	    }
	    else{
            errorText("#editPostError", "");
            // Sending request to edit post
            $.ajax({
                url: '/edit_post/' + (window.location.href.split("/"))[(window.location.href.split("/")).length - 2],
                data: $('#editForm').serialize(),
                type: 'POST',
                success: function(response){
                    if (response["error"] != null){
                        // If some error occurred in python script
                        errorText("#editPostError", response["error"]);
                    }
                    else {
                        // If no error then goto home page
                        $(location).attr('href', '/post/' + (window.location.href.split("/"))[(window.location.href.split("/")).length - 2]);
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