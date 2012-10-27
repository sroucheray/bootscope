define(function(){
	var color = "#000";
	
	console.timeStamp("Black loaded");
	return function(target){
	
		console.timeStamp("Black executed");
		$(target).css("background-color", color);
	}
});