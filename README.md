Bootscope
=============
Declarative module loader based on web page features.

**Table of Contents**

- [Why Bootscope ?](#why-bootscope-)
- [How it works ?](#how-it-works-)
  - [The parts](#the-parts)
  - [First steps](#first-steps)
      - [1. Add the script tag in the HTML page](#1-add-the-script-tag-in-the-html-page)
      - [2. Add data-feat attribute to any tag in the HTML document](#2-add-data-feat-attribute-to-any-tag-in-the-html-document)
      - [3. Add a route to the bootconfig module](#3-add-a-route-to-the-bootconfig-module)
      - [4. Create the module in menu-module.js in path/to/module](#4-create-the-module-in-menu-modulejs-in-pathtomodule)
  - [How to...](#how-to)
      - [I want to pass parameters from the backend to my scripts](#i-want-to-pass-parameters-from-the-backend-to-my-scripts)
      - [Ok, but my parameters are dynamics and can't be dumped in a JS file](#ok-but-my-parameters-are-dynamic-and-cant-be-dumped-in-a-js-file)
      - [Ok, but I want my parameters to be specific to a data-feat module](#ok-but-i-want-my-parameters-to-be-specific-to-a-data-feat-module)
      - [How to load a module before another one](#how-to-load-a-module-before-another-one)
      - [How not to load a module on the page load](#how-not-to-load-a-module-on-the-page-load)
      - [I have module not linked to a specific part of the page, what should I do ?](#i-have-module-not-linked-to-a-specific-part-of-the-page-what-should-i-do-)
      - [I need my modules to communicates each other, how do I pass data from one module to another ?](#i-need-my-modules-to-communicates-each-other-how-do-i-pass-data-from-one-module-to-another-)


Why Bootscope ?
---------------
Web Apps is the trending topic, this is a great paradigm change... but most of my time is still spent developing **web sites**.

*Web sites* are very different from *web apps*.

*Web sites* are not uniform and features scattered.

Some pages have forms, some have menus, some have widgets, some have no specific features.

Bootscope serves four purposes :

* Single script tag entry point for all pages of a site
* Only required features for a page are loaded
* Simple to setup
* Framework agnostic, it does not prescribes any MVC framework

How it works ?
--------------
When the page has loaded, Bootscope look at any element in the page holding a ``data-feat`` attribute. 
If the value of this attribute is linked to a module, Bootscope loads it. The module is then defined.

If the return value of the module's factory is a function [see here](#4-create-the-module-in-menu-modulejs-in-pathtomodule), Bootscope will execute it passing the element.

### The parts
Bootscope is made of three parts  
 
1. ``requiresjs-jquery.js`` : the [RequireJS](http://requirejs.org/docs/jquery.html) module loader
2. ``bootscope.js`` : a module. It contains Bootscope logic
3. ``bootconfig.js`` : a module. It holds the **routes** linking features to modules (you set it up)

### First steps
Once you have dropped these required files in your project, it's a four steps work :

#### 1. Add the ``script`` tag in the HTML page
         
```html
...
<head>
    <script src="requiresjs-jquery.js"
            data-main="path/to/bootscope"
            data-bootscope="bootconfig"
            type="text/javascript">
    </script>
</head>
...
```
The ``script`` tag holds some specific attributes :  
  * ``data-main`` attribute is standard to [RequireJS](http://requirejs.org/docs/api.html#jsfiles),
it's value is the first module loaded, in our case, it is ``bootscope.js``
(Note : never include the trailing ``.js`` when reference a module)  
  * ``data-bootscope`` attribute's value reference the ``bootconfig`` module  
        
#### 2. Add ``data-feat`` attribute to any tag in the HTML document
    
```html
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>
    <div data-feat="menu"></div>
  </body>
</html>
```  
This indicates that this ``div`` holds a specific feature named ``menu``  
#### 3. Add a _route_ to the ``bootconfig`` module
The ``bootconfig`` file is also a module, it returns a config object. This config object holds the routes. 
A **route** links a feature to a module    
        
```javascript
define({
    routes : {
        menu : "path/to/module/menu-module"
    }
});
```  
#### 4. Create the module in ``menu-module.js`` in ``path/to/module``
        
```javascript
define(["jquery"], function($){
    //Here is the module logic
    //The code here is executed once in page life, when the module is loaded 
    return function(element){
      //Here is the menu logic
      //This code is executed for each element found on the page with 
      //the data-feat attribute linked to this module
 
      //element is the div holding the data-feat attribute
    }
});
```

### How to...
#### I want to pass parameters from the backend to my scripts
The easiest way is to add a ``globals`` property to the ``bootconfig`` file :
```javascript
define({
    routes: { //Feature to module mapping
        menu : "path/to/module/menu-module"
    },
    globals: { //Any parameter that can be retreived in bootsope.global
        imgPath: "path/to/images/",
        dataJSONPath: "javascript/data/data.json"
    }
});
```
This ```bootscope``` script being a module itself, your modules can depend on it :
```javascript
define(["jquery", "bootscope"], function($, bs){
    //Data is retrieved from the globals property of the bootscope module
    var pathToImg = bs.globals.imgPath,
        json = bs.globals.dataJSONPath;
    return function(node){
    }
});
```
#### Ok, but my parameters are dynamics and can't be dumped in a JS file
The other option is to dump a JSON string within the ```script``` tag itself, thus being dropped in the HTML page, it can be pulled from your backend system :
```html
...
<head>
    <script src="require-jquery.js"
            data-main="path/to/bootscope"
            data-bootscope="bootconfig"
            type="text/javascript">
    '{
        "imgPath" : "path/to/img/",
        "data" : "path/to/data/"
    }'
    </script>
</head>
...
```
The magic is that you retrieved this JSON string parsed as an plain object in the ```locals``` property of the ```bootscope``` module.
```javascript
define(["jquery", "bootscope"], function($, bs){
    //Data is retrieved from the globals property of the bootscope module
    var pathToImg = bs.locals.imgPath,
        data= bs.locals.data;
    return function(node){
    }
});
```
#### Ok, but I want my parameters to be specific to a ```data-feat``` module
In this case, just drop other ```data-*``` attributes on your node :
```html
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>
    <div data-feat="menu" data-color="red"></div>
    <div data-feat="menu" data-color="blue"></div>
    <div data-feat="menu"></div>
  </body>
</html>
```  
You can then retrieve these parameters in your module (note : this time no dependency to ```bootscope``` is required) :
```javascript
define(["jquery"], function($){
    //Remember that the function below is executed for each menu element
    return function(menu){
        var $menu = $(menu),
            data = $menu.data();
        if(data.hasOwnProperty("color")){
            $menu.css("background-color", data.color);
        }
    }
});
```
#### How to load a module before another one
By default Bootscope loads module in the order of the HTML page. To gice a higher priority to a specific feature that is not a the top of the page simply add a ```data-priority``` atribute to the tag :
```html
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>
    <div data-feat="menu"></div>
    <div data-feat="search" data-priority="1"></div>
    <div data-feat="carousel"></div>
  </body>
</html>
```  
In this case the ```search``` module will be loaded before the menu and the carousel. 

Default priority for a module is ```0``` so you can pass a negative integer to lower thr priority of a module :
```html
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>
    <div data-feat="carousel" data-priority="-1"></div>
    <div data-feat="menu"></div>
    <div data-feat="search"></div>
  </body>
</html>
```  
While, in this case, the ```carousel``` is the first to appear in the page, it will be loaded after all the other one.
#### How not to load a module on the page load
It is possible to delay the load of a specific feature module adding a ```data-inactive``` attribute to the element.

Consider this case :
```html
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>
    <a href="#" data-feat="link"></div>
    <div id="dialog" data-feat="map" data-inactive="true" style="display:none"></div>
  </body>
</html>
```  

The bootconfig will look like this :
```javascript
define({
    routes: {
        link : "path/to/module/link",
        map : "path/to/module/map"
    }
});
```
The link module when clicked should show a dialog like box with a map in it.
While the ```map``` module is not executed automatically, the ```link``` module will be executed on page load :
```javascript
//link.js
define(["jquery", "bootscope"], function($, bs){
    return function(link){
        $(link).click(function(){
            var $dialog = $("#dialog");
            
            $dialog.show();
            //The bootscope loadFeatures method will force the load of the map module
            bs.loadFeatures($dialog);

            return false;
        });
    }
});


//map.js
define(["jquery"], function($){
    //Execution delayed after click on the link
    return function(map){
      //Logic to setup the map
    }
});
```

####I have module not linked to a specific part of the page, what should I do ?
If one or several modules are not linked to an element in the page, you can use the script tag to load it like this :
```html
...
<head>
    <script src="requiresjs-jquery.js"
            data-main="path/to/bootscope"
            data-bootscope="bootconfig"
            data-preload="module1, sub/module2"
            data-postload="sub2/module3, sub2/module4"
            type="text/javascript">
    </script>
</head>
...
```
```module1``` and  ```module2``` will be loaded as soon as possible. Bootscope will not wait for the page to be ready.  ```module3``` and  ```module4``` will be loaded after all the featured module in the page are loaded. This is useful for modules that need the page to be fully functionnal before being executed.
####I need my modules to communicates each other, how do I pass data from one module to another ?
Bootscope provides a specific module named ```mediator``` which act as a communication layer using the Pub/Sub pattern.
If ```moduleA``` wants to send to ```moduleB``` a message saying the data are updated passing the specific data.
```javascript
//moduleB.js
define(["jquery", "mediator"], function($, mediator){
    return function(node){
        //moduleB defines a function which handles the receiving data
        function dataHandler(data){
          //Do whatever you want with those data
          console.log(data);
        }


        //moduleB subscribe to 'data:updated' channel
        mediator.on("data:updated", dataHandler);
    }
});


//moduleB.js
define(["jquery", "mediator"], function($, mediator){
    return function(node){
      var object = {
        foo : "bar"
      };

      //moduleA publish its object to the channel "data:updated"
      //the object will be received by all modules subsribing to this channel
      mediator.trigger("data:updated", object);
    }
});
```
The ````mediator```` code is borrowed to [BackboneJS](http://backbonejs.org/#Events), click to see more information on channels.