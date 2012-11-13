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
		zoom : "init/zoom-map-initializer",
		minimap : "map/minimap",
		villagesList : "init/villages-list",
		mapSelector : "init/map-selector"
	},
	globals : {//Any parameter that can be retreived in bootsope.globals
		imgPath : "path/to/img/",
	}
});