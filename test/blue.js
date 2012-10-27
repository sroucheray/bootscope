define(function(){
	var color = "#0000ff";
	
	console.timeStamp("Blue loaded");
	return function(target){
	
		console.timeStamp("Blue executed");
		$(target).css("background-color", color);
	}
});