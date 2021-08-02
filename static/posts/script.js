$(function(){
    // Pressing add post button
	$('#addPost').click(function(e){
	    e.preventDefault();
	    $(location).attr('href', '/add');
	});
});