import EventClass from "event-class";
import bootscope from "bootscope/bootscope";

class Red extends EventClass {
    constructor(){
        super();
        this.color = "#f00";
        this.on("ready", this.ready)
    }

    ready(element){
        console.timeStamp("Red loaded");
        element.style.backgroundColor = this.color;
        element.querySelector("output").innerHTML = (Date.now() - bootscope.readyTime) + "ms";
    }
}

export default new Red();