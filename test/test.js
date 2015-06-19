import EventClass from "event-class";
import bootscope from "bootscope/bootscope";

class Test extends EventClass {
    constructor(){
        super();
        this.color = "#aaa";
        this.on("ready", this.ready)
    }

    ready(element){
        console.timeStamp("Test loaded");

        element.style.backgroundColor = this.color;
        element.querySelector("output").innerHTML = (Date.now() - bootscope.readyTime) + "ms";

        let div = document.createElement("div");
        div.setAttribute("data-module", "test/red");
        div.innerHTML = "7th created dynamically "
        div.appendChild(document.createElement("output"));
        document.body.appendChild(div);
		bootscope.load(div);
        div.querySelector("output").innerHTML = (Date.now() - bootscope.readyTime) + "ms";

        setTimeout(()=>{
        	bootscope.enableAndLoad(document.body);
        }, 1000);
    }
}

export default new Test();