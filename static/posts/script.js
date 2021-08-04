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
	});

	// Pressing copy post url button
	$('#copyPost').click(function(e){
	    e.preventDefault();
	    $temp = $("<input>");
	    $url = window.location.href;
	    $("body").append($temp);
	    $temp.val($url).select();
	    document.execCommand("copy");
	    $temp.remove();
	    alert("Copied url : " + $url);
	});
});