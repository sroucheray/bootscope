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
 
1. ``requiresjs-jquery.js`` : the module loader
2. ``bootscope.js`` : a module which will load other module based on feature detection in the page
3. ``bootconfig.js`` : a module which hold all the configuration and specifically the **routes** linking features to modules

Once you have dropped this required file in your project, it's a three steps work :

1. Add ``data-feat`` attribute to any tag in the HTML document  
```html
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>
    <div data-feat="menu"></div>
  </body>
</html>
```  
This indicates that this ``div`` hold a specific feature named ``menu``
2. Add a _route_ to the bootconfig  
```javascript
...
routes : {
  ...
  menu : "path/to/module/menu-module"
  ...
}
...
```
A **route** links a feature to a module
3. Create the module in ``menu-module.js`` in ``path/to/module``   
```javascript
define(["jquery"], function(){
  //The code here is executed once
  return function(node){
    //This code is executed for each node found on the page with 
    //the data-feat attribute linked to this module
 
    //node is the div holding the data-feat attribute
  }
});
```