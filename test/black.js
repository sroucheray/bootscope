import EventClass from "event-class";
import bootscope from "bootscope/bootscope";

class Black extends EventClass {
    constructor(){
        super();
        this.color = "#000";
        this.on("ready", this.ready)
    }

    ready(element){
        console.timeStamp("Black loaded");
        element.style.backgroundColor = this.color;
        element.querySelector("output").innerHTML = (Date.now() - bootscope.readyTime) + "ms";
    }
}

export default new Black();

