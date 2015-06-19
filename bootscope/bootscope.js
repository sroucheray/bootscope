import EventClass from "event-class";

const moduleAttributeName = "data-module",
      priorityAttributeName = "data-priority",
      disabledAttributeName = "data-disabled",
      loadedAttributeName = "data-loaded";

const selectors = {
    allFeaturedElements: `[${moduleAttributeName}]`,
    allValidElements: `[${moduleAttributeName}]:not([${loadedAttributeName}]):not([${disabledAttributeName}])`,
    allDisabledElements: `[${moduleAttributeName}][${disabledAttributeName}]:not([${loadedAttributeName}])`
};

class Selector {
    constructor(selector, context = document){
        this._selection = []

        if(selector instanceof Element){
            this._selection = [selector];
        }

        if(Array.isArray(selector)){
            this._selection = selector;
        }

        if(selector instanceof NodeList){
            this._selection = Array.from(selector);
        }

        if(!selector || selector === ""){
            this._selection = [];
        }

        if(typeof selector === "string"){
            this._selection = Array.from(context.querySelectorAll(selector));
        }

    }

    * [Symbol.iterator]() {
        for (let element of this._selection) {
            yield element;
        }
    }

    * import() {
        for (let element of this.selection) {
            let modulePath = element.getAttribute(moduleAttributeName);
            if(modulePath){
                yield System.import(modulePath).then(module => {
                    return { module, element };
                });
            }
        }
    }

    children(selector){
        if(this._selection.length){
            return new Selector(selector, this._selection[0]);
        }

        return new Selector();
    }

    childrenAndSelf(selector){
        let result = new Selector(selector, this._selection[0]);

        return new Selector([this._selection[0], ...result.selection]);
    }

    sort(sortFunction){
        this._selection.sort(sortFunction);

        return this;
    }

    get selection(){
        return this._selection;
    }
}

class Bootscope extends EventClass {
    constructor() {
        super();

        this.readyTime = (new Date()).getTime();

        let readyPromise = new Promise(function(resolve, reject) {
            if (document.readyState === "complete") {
                resolve(document.readyState);
            } else {
                document.addEventListener("DOMContentLoaded", function domReadyListener() {
                    document.removeEventListener("DOMContentLoaded", domReadyListener);
                    resolve(document.readyState);
                });
            }
        });

        readyPromise.then(this.ready.bind(this));
    }

    ready() {
        this.load(selectors.allValidElements);
    }

    getElementsAsArray(selector, htmlElementContext = document){
        return Array.from(htmlElementContext.querySelectorAll(selector));
    }

    /**
     * Sort elements based on their priority
     */
    sortElementsByPriority(a, b) {
        var aPrio = a.getAttribute(priorityAttributeName) || 0,
            bPrio = b.getAttribute(priorityAttributeName) || 0;

        if (aPrio === bPrio) {
            return 0;
        } else if (aPrio > bPrio) {
            return -1;
        }

        return 1;
    }

    /**
     * Given a context (@see Selector) load their modules
     */
    load(context) {
        let elements = new Selector(context).sort(this.sortElementsByPriority);

        let promises = [];
        for(let test of elements.import()){
            promises.push(test)
        }

        Promise.all(promises).then((modules) => {
            for(let {module, element} of modules){
                if(module.default && typeof module.default.trigger === "function"){
                    module.default.trigger("ready", element);
                    element.setAttribute(loadedAttributeName, true)
                }
            }
        }).catch((error)=>{
            console.error(error);
        });

        return this;
    }

    enableElements(context){
        let disabledElements = new Selector(context).childrenAndSelf(selectors.allDisabledElements);
        for (let element of disabledElements){
            element.removeAttribute(`${disabledAttributeName}`);
        }

        return this;
    }

    enableAndLoad(context){
        this.enableElements(context);
        this.load(new Selector(context).childrenAndSelf(selectors.allValidElements).selection);

        return this;
    }
}

export default new Bootscope();