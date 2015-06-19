import EventClass from "event-class";
import bootscope from "bootscope/bootscope";

class Green extends EventClass {
    constructor(){
        super();
        this.color = "#0f0";
        this.on("ready", this.ready)
    }

    ready(element){
        console.timeStamp("Green loaded");
        element.style.backgroundColor = this.color;
        element.querySelector("output").innerHTML = (Date.now() - bootscope.readyTime) + "ms";
    }
}

export default new Green();