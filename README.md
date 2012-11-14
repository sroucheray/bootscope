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
Bootscope is made of three parts  
 
1. ``requiresjs-jquery.js`` : the module loader [RequireJS](http://requirejs.org/docs/jquery.html)
2. ``bootscope.js`` : a module which will load other modules based on feature detection in the page
3. ``bootconfig.js`` : a module which hold all the configuration and specifically the **routes** linking features to modules

Once you have dropped these required files in your project, it's a four steps work :

1. Add the ``script`` tag in the HTML page
         
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
``data-main`` attribute is standard to [RequireJS](http://requirejs.org/docs/api.html#jsfiles),
it's value is the first module loaded, in our case, it is ``bootscope.js`` (Note : never include the trailing ``.js`` when reference a module)
``data-bootscope`` attribute value reference the ``bootconfig`` module  
2. Add ``data-feat`` attribute to any tag in the HTML document
    
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
3. Add a _route_ to the ``bootconfig`` file
        
```javascript
define({
    routes : {
        menu : "path/to/module/menu-module"
    }
});
```  
The ``bootconfig`` file is also a module, it returns a config object.  
A **route** links a feature to a module  
4. Create the module in ``menu-module.js`` in ``path/to/module``
        
```javascript
define(["jquery"], function(){
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