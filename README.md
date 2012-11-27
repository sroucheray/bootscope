Bootscope
=============

Declarative module loader based on web page features.

Why Bootscope ?
---------------
Web development trending topics are web apps, but must of my time is still spent developing 'web sites'.

Web sites are very different from web apps.

Web sites are not uniform and features scattered.

Some pages have forms, some have menus, some have widgets, some have no specific features.

Bootscope serves four purposes :

* Single script tag entry point for all pages of a site
* Only required features for a page are loaded
* Simple to setup
* Framework agnostic, it does not prescribes any MVC framework

How it works ?
--------------
When the page has loaded, Bootscope look at any nodes holding a ``data-feat`` attribute. 
If the value of this attribute is linked to a module, Bootscope loads it. The module is then defined.
If the return value of the module's factory is a function [see here](#4-create-the-module-in-menu-modulejs-in-pathtomodule), Bootscope will execute it passing the node.

### The parts
Bootscope is made of three parts  
 
1. ``requiresjs-jquery.js`` : the module loader [RequireJS](http://requirejs.org/docs/jquery.html)
2. ``bootscope.js`` : a module, it contains Bootscope logic
3. ``bootconfig.js`` : a module, it holds the **routes** linking features to modules

### First steps
Once you have dropped these required files in your project, it's a four steps work :

#### 1. Add the ``script`` tag in the HTML page
         
```html
...
<head>
    <script
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
        
```javascript
define({
    routes : {
        menu : "path/to/module/menu-module"
    }
});
```  
The ``bootconfig`` file is also a module, it returns a config object.  
A **route** links a feature to a module  
#### 4. Create the module in ``menu-module.js`` in ``path/to/module``
        
```javascript
define(["jquery"], function($){
    //Here is the module logic
    //The code here is executed once in page life, when the module is loaded 
    return function(node){
      //Here is the menu logic
      //This code is executed for each node found on the page with 
      //the data-feat attribute linked to this module
 
      //node is the div holding the data-feat attribute
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
#### Ok, but my parameters are dynamic and can't be dumped in a JS file
The other option is to dump a JSON string within the ```script``` tag itself, thus being dropped in the HTML page, it can be pulled from your backend system :
```html
...
<head>
    <script
        data-main="path/to/bootscope"
        data-bootscope="bootconfig"
        type="text/javascript">
    {
        "imgPath" : "path/to/img/",
        "data" : "path/to/data/"
    }
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
You can then retrieve these parameters in your module (note : this time no dependency to ```bootscope``` required) :
```javascript
define(["jquery"], function($){
    //Remember that the function below is executed for each menu
    return function(menu){
        var $menu = $(menu),
            data = $menu.data();
        if(data.hasOwnProperty("color")){
            $menu.css("background-color", data.color);
        }
    }
});
```