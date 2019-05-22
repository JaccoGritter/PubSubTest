
window.onload = function() { 
    document.getElementById("myButton").addEventListener("click", startStopRace) 
};



let raceBezig = false;

let subscribers = [];
let rondeTimer;  // variable voor het zetten van de timer



const tijdwaarneming = {
    zendTijd : function() {
        let randomTijd = "2." + Math.floor(Math.random() * 60);
        PubSub.publish("auto.rondetijden", {rondetijd: randomTijd});
    }
}

function scorebord(topic, data) {
    document.getElementsByClassName("tijd")[0].innerHTML = data.rondetijd;
}

function teamEngineer (topic, data) {
    if (topic == "auto.rondetijden") document.getElementsByClassName("tijd")[1].innerHTML = data.rondetijd;
    if (topic == "auto.bandentemperatuur") document.getElementById("bandentemp").innerHTML = data.bandentemperatuur + " deg. celsius";
    if (topic == "auto.motorstatus") document.getElementById("motorstatus").innerHTML = data.motorstatus;
}

subscribers.push (PubSub.subscribe("auto", teamEngineer));              // subscribe to all subjects
subscribers.push (PubSub.subscribe("auto.rondetijden", scorebord));     // subscribe to subject rondetijden only

function startStopRace() {
    if (!raceBezig) {
        document.getElementById("myButton").innerHTML = "Stop de race!";
        rondeTimer = setInterval(rondjesRijden, 2000);
        raceBezig = true;
    } else {
        clearInterval(rondeTimer);
        document.getElementById("myButton").innerHTML = "Herstart de race!";
        raceBezig = false;
    }

function rondjesRijden() {

    tijdwaarneming.zendTijd();

    let randomTemperatuur = Math.floor(Math.random() * 30) + 80;
    PubSub.publish("auto.bandentemperatuur", {bandentemperatuur: randomTemperatuur});

    let randomMotorstatus = "" + (Math.floor(Math.random() * 50) + 50) + "%";
    PubSub.publish("auto.motorstatus", {motorstatus: randomMotorstatus});

    } 


}
