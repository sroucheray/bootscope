define(function(){
	var color = "#ff0000";
	
	console.timeStamp("Red loaded");
	return function(target){
	
		console.timeStamp("Red executed");
		$(target).css("background-color", color);
	}
});