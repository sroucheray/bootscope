import EventClass from "event-class";
import bootscope from "bootscope/bootscope";

class Disabled extends EventClass {
    constructor(){
        super();
        this.color = "#0ff";
        this.on("ready", this.ready)
    }

    ready(element){
        console.timeStamp("Disabled loaded");
        element.style.backgroundColor = this.color;
        element.querySelector("output").innerHTML = (Date.now() - bootscope.readyTime) + "ms";
    }
}

export default new Disabled();