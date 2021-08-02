// Function to change error texts
function errorText($id, $text){
    $($id).empty();
    $($id).append($text);
}

$(function(){
	// Pressing add post button
	$('#addPostSubmit').click(function(e){
	    e.preventDefault();
	    // Checking form is filled or not
	    if ($('#title').val().length < 5 || $('#title').val().length > 30
	    ){
	        errorText("#addPostError", "Title must be between 5 & 30 characters.");
	    }
	    else if ($('#subtitle').val().length < 5 || $('#subtitle').val().length > 30
	    ){
	        errorText("#addPostError", "Subtitle must be between 5 & 30 characters.");
	    }
	    else if ($('#description').val().length < 10 || $('#description').val().length > 50
	    ){
	        errorText("#addPostError", "Description must be between 10 & 50 characters.");
	    }
	    else if ($('#content').val().length < 50 || $('#content').val().length > 500
	    ){
	        errorText("#addPostError", "Content must be between 50 & 500 characters.");
	    }
	    else{
            errorText("#addPostError", "");
            // Sending request to add post
            $.ajax({
                url: '/add_post',
                data: $('#addForm').serialize(),
                type: 'POST',
                success: function(response){
                    if (response["error"] != null){
                        // If some error occurred in python script
                        errorText("#addPostError", response["error"]);
                    }
                    else {
                        // If no error then goto home page
                        $(location).attr('href', '/posts')
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