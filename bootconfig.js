define({
	require : {  //RequireJS config 
		paths : {
			"libs" : "../libs",
			"mediator" : "bootscope/mediator"
		},
		shim : {
		}
	},
	routes : { //Feature to module mapping
		red : "test/red",
		green : "test/green",
		blue : "test/blue",
		black : "test/black"
	},
	globals : {//Any parameter that can be retreived in bootsope.globals
		imgPath : "path/to/img/",
	}
});