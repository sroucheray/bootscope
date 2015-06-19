import EventClass from "event-class";
import bootscope from "bootscope/bootscope";

class Blue extends EventClass {
    constructor(){
        super();
        this.color = "#00f";
        this.on("ready", this.ready)
    }

    ready(element){
        console.timeStamp("Blue loaded");
        element.style.backgroundColor = this.color;

        element.querySelector("output").innerHTML = (Date.now() - bootscope.readyTime) + "ms";
    }
}

export default new Blue();