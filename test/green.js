define(function(){
	//ex�cuter une fois au moment du load du module
	var color = "#00ff00";
	
	console.timeStamp("Green loaded");
	return function(target){
	
		console.timeStamp("Green executed");
		//ex�cuter pour chaque noeud
		$(target).css("background-color", color);
	}
});