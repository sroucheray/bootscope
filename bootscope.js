define(["jquery"], function ($) {
	var defaults = {
			featKey : "feat",
			priorityKey : "priority",
			executeHasKey : "executeHas",
			featuredKey : "featured",
			executeHas : "Module" //Module (default), Contructor, None, <anyMethodName>,
		},
		options = {},
		configModule,
		routes,
		dataDsh = "data-",
		featAtt,
		priorityAtt,
		executeHasAtt,
		featuredAtt;
	
	/**
	 * Helper function for iterating over an array backwards. If the func
	 * returns a true value, it will break out of the loop.
	 * Copied and pasted from requirejs
	 */
	function eachReverse(ary, func) {
		var i;
		if (ary) {
			for (i = ary.length - 1; i > -1; i -= 1) {
				if (ary[i] && func(ary[i], i, ary)) {
					break;
				}
			}
		}
	}
	
	/**
	 * Sort features based on their priority
	 */
	function sortDomElements(a, b){
		var aPrio = a.getAttribute(priorityAtt) || Number.MIN_VALUE,
			bPrio = b.getAttribute(priorityAtt) || Number.MIN_VALUE;

		if(aPrio === bPrio){
			return 0;
		}else if(aPrio > bPrio){
			return -1;
		}
		
		return 1;
	}
	
	/**
	 * Load modules from a required feature and
	 * executes it if a function passing the DOM element target
	 * as first parameter
	 */
	function loadModules($elementColl){
		Array.sort.call(null, $elementColl, sortDomElements);
		$elementColl.each(function(i, target){
			var $target = $(target),
				feature = $target.attr(featAtt),
				executeHas = $target.attr(executeHasAtt) || options.executeHas;
			if(routes && feature && routes.hasOwnProperty(feature)){
				require([routes[feature]], function(module){
					$target.attr(featuredAtt, true);
					//test if module should execute
					if(executeHas === "Module"){
						module(target);
					}else if(executeHas === "Constructor"){
						new module(target);
					}else if(module.hasOwnProperty(executeHas) && typeof module[executeHas] === 'function'){
						module[executeHas](target);
					}
				});
			}
		});
	}
	
	/**
	 * Setup Bootscope when config module is loaded
	 */
	function setup(config){
		if(config){
			//check if in the config you don't have options that should be mixins with defaults
			$.extend(options, defaults, config.hasOwnProperty("options") ? config.options : {});
			//Modify requirejs config from bootconfig
			if(config.hasOwnProperty("require")){
				require.config(config.require);
			}
			
			featAtt = dataDsh + options.featKey;
			priorityAtt = dataDsh + options.priorityKey;
			executeHasAtt = dataDsh + options.executeHasKey;
			featuredAtt = dataDsh + options.featuredKey;
			
			routes = config.hasOwnProperty("routes") ? config.routes : config;
		}
	}
	
	//Get the config parsing the script tag
	eachReverse(document.getElementsByTagName("script"), function(script){
		configModule = script.getAttribute("data-bootscope");
		if(configModule){
			if(!require.defined(configModule)){
				require([configModule], function(config){
					setup(config);
			
					//Wait for domready before loading modules
					$(function(){
						loadModules($("[" + featAtt + "]"));
					});
				});
			}
			
			return true;
		}
	});
	
	//
	return {
		/** Manually set a new complete config */
		setOptions : setup,
		/** 
		 * Detect manually featured elements (usefull when DOM elements are added dynamically)
		 */
		detectFeatures : function(context){
			var filteredElmnts = $("[" + featAtt + "]", context).not("[" + featuredAtt + "]");
			loadModules(filteredElmnts);
		},
		/** Return all featured DOM elements as a jQuery Collection */
		getFeaturedElements : function(context){
			return $("[" + featuredAtt + "]", context);
		}
	};
});

//Sequence
//1 - load this scripts
//2 - check for config file path in data-bootscope
//3 - load the config file
//4 - mixin options with defautlts
//5 - setup the 'routes' / features attached functions