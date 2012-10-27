define(["bootscope"], function(bootscope){
	var color = "#AAA";
	
	console.timeStamp("Test loaded");
	console.log(bootscope);
	
	return function(target){
	
		console.timeStamp("Test executed");
		$(target).css("background-color", color);
		
		$("<div />").appendTo("body").attr("data-feat", "feat3").html("&nbsp;");
		bootscope.detectFeatures();
	}
});