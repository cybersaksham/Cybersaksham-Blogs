$(function(){
    // Pressing add post button
	$('#addPost').click(function(e){
	    e.preventDefault();
	    $(location).attr('href', '/add');
	});

	// Pressing edit post button
	$('#editPost').click(function(e){
	    e.preventDefault();
	    $(location).attr('href', window.location.href + '/edit')
	});

	// Pressing delete post button
	$('#deletePost').click(function(e){
	    e.preventDefault();
        if (confirm("Do you really want to delete this post")){
            // Sending request to delete post
            $.ajax({
                url: '/delete_post?url=' + window.location.href,
                type: 'POST',
                success: function(response){
                    $(location).attr('href', '/posts')
                },
                error: function(error){
                    // If error occurred in post request
                    console.log(error);
                }
            });
        }
        else{
            $(location).attr('href', window.location.href)
        }
	});
});