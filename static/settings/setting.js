$(function(){
    // Changing Tabs
    $('#edit-tab').click(function(e){
        e.preventDefault();
        $(location).attr('href', '/edit')
    });
    $('#delete-tab').click(function(e){
        e.preventDefault();
        if (confirm("Do you really want to delete account permanently")){
            // Sending request to delete user
            $.ajax({
                url: '/delete_user',
                type: 'POST',
                success: function(response){
                    $(location).attr('href', '/')
                },
                error: function(error){
                    // If error occurred in post request
                    console.log(error);
                }
            });
        }
        else{
            $(location).attr('href', '/settings')
        }
    });
    $('#logout-tab').click(function(e){
        e.preventDefault();
        if (confirm("Do you really want to logout")){
            // Sending request to logout user
            $.ajax({
                url: '/logout_user',
                type: 'POST',
                success: function(response){
                    $(location).attr('href', '/')
                },
            });
        }
        else{
            $(location).attr('href', '/settings')
        }
    });
    $('#home-tab').click(function(e){
        e.preventDefault();
        $(location).attr('href', '/')
    });

    // Adding url in url_nonLogin field
    $('#url_nonLogin').val(window.location.origin + '/' + $('#url_nonLogin').val() + '/about');

	// Pressing copy profile url button
	$('#copyUrl').click(function(e){
	    e.preventDefault();
	    $temp = $("<input>");
	    $url = $('#url_nonLogin').val();
	    $("body").append($temp);
	    $temp.val($url).select();
	    document.execCommand("copy");
	    $temp.remove();
	    alert("Copied url : " + $url);
	    $(location).attr('href', window.location.href)
	});
});