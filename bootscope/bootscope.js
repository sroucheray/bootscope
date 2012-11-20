define(["jquery"], function ($) {
	var defaults = {
			featKey : "feat",
			priorityKey : "priority",
			executeHasKey : "executeHas",
			featuredKey : "featured",
			inactiveKey : "inactive",
			executeHas : "Module" //Module (default), Contructor, None, <anyMethodName>,
		},
		bootscope = {},
		options = {},
		globals = {},
		locals = {},
        bootScript,
		configModule,
		routes,
		dataDsh = "data-",
		featAtt,
		priorityAtt,
		executeHasAtt,
		featuredAtt,
		inactiveAtt;

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
		var aPrio = a.getAttribute(priorityAtt) || 0,
			bPrio = b.getAttribute(priorityAtt) || 0;

		if(aPrio === bPrio){
			return 0;
		}else if(aPrio > bPrio){
			return -1;
		}

		return 1;
	}

	/**
	 * Load modules from a required feature and
	 * executes it if it is a function passing the DOM element target
	 * as first parameter
	 */
	function loadModules($elementColl){
        var postLoadDependencies = [];
		$elementColl = Array.prototype.slice.call($elementColl, 0);
		$elementColl.sort(sortDomElements);
		$($elementColl).each(function(i, target){
			var $target = $(target),
				feature = $target.attr(featAtt),
				executeHas = $target.attr(executeHasAtt) || options.executeHas;
			if(routes && feature && routes.hasOwnProperty(feature)){
                postLoadDependencies.push(routes[feature]);
				require([routes[feature]], function(module){
					//test if module should execute
					if(executeHas === "Module"){
						module(target);
					}else if(executeHas === "Constructor"){
						new module(target);
					}else if(module.hasOwnProperty(executeHas) && typeof module[executeHas] === 'function'){
						module[executeHas](target);
					}
					$target.attr(featuredAtt, true);
				});
			}
		});
        
        require(postLoadDependencies, function(){
            preload(bootScript.getAttribute("data-postload"));
        });
	}

	/**
	 * Setup Bootscope when config module is loaded
	 */
	function setup(config){
		if(config){
			//check if in the config you don't have options that should be mixins with defaults
			$.extend(options, defaults, config.hasOwnProperty("options") ? config.options : {});
			$.extend(globals, config.hasOwnProperty("globals") ? config.globals : {});

			//Modify requirejs config from bootconfig
			if(config.hasOwnProperty("require")){
				require.config(config.require);
			}
			featAtt = dataDsh + options.featKey;
			priorityAtt = dataDsh + options.priorityKey;
			executeHasAtt = dataDsh + options.executeHasKey;
			featuredAtt = dataDsh + options.featuredKey;
			inactiveAtt = dataDsh + options.inactiveKey;

			routes = config.hasOwnProperty("routes") ? config.routes : config;
		}
	}

	function preload(modules){
		if(typeof modules === "string" && modules.length > 0){
			require(modules.split(","), function(){});
		}
	}


	//Get the config parsing the script tag
	eachReverse(document.getElementsByTagName("script"), function(script){
		var localsConf,
			tmpBaseUrl;

		configModule = script.getAttribute("data-bootscope");
		if(configModule){
            bootScript = script;
			tmpBaseUrl = script.getAttribute("data-baseurl");

			if(tmpBaseUrl){
				require.config({
					baseUrl : tmpBaseUrl
				});
			}

			localsConf = script.innerHTML;
			//Set local config
			localsConf = $.trim(localsConf);
			try{
				if(localsConf.length > 0){
					if(localsConf[0] === "{" || localsConf[0] === "["){
						localsConf = $.parseJSON(localsConf);
					}
				}
				if(localsConf){
					locals = localsConf;
				}
			}catch(e){}


			if(!require.defined(configModule)){
				require([configModule], function(config){
                    if(locals.hasOwnProperty("require")){
                        config.require = $.extend(true, {}, locals.require, config.require);
                    }
					setup(config);

					preload(script.getAttribute("data-preload"));
					//Wait for domready before loading modules
					$(function(){
						loadModules($("[" + featAtt + "]").not("[" + inactiveAtt + "]"));
					});
				});
			}

			return true;
		}
	});

	//External API
	bootscope = {
		/**
		 * Detect manually featured elements (usefull when DOM elements are added dynamically)
		 */
		loadFeatures : function(context, feature){
			var filteredElmnts = $("[" + featAtt + (feature ? "=" + feature : "") + "]", context).not("[" + featuredAtt + "]");
			//.not("[" + inactiveAtt + "]");
			filteredElmnts.attr("inactiveAtt", "");
			loadModules(filteredElmnts);
		},
		/** Return all featured DOM elements as a jQuery Collection, optionally exclude inactive elements */
		getFeaturedElements : function(context, excludeInactive){
			if(excludeInactive){
				return $("[" + featuredAtt + "]", context).not("[" + inactiveAtt + "]");
			}

			return $("[" + featuredAtt + "]", context);
		},
		globals : globals,
		locals : locals
	};

	return bootscope;
});