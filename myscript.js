
window.onload = function() { 
    document.getElementById("myButton").addEventListener("click", startStopRace) 
};

class RaceAuto {
    constructor(teamnaam) {
        this.teamnaam = teamnaam;
        this.rondetijd = 0;
        this.bandentemperatuur = 0;
        this.motorstatus = 0;
    }

    carStats() {

        let randomTemperatuur = Math.floor(Math.random() * 30) + 80;
        PubSub.publish("auto.bandentemperatuur", {bandentemperatuur: randomTemperatuur});

        let randomMotorstatus = "" + (Math.floor(Math.random() * 50) + 50) + "%";
        PubSub.publish("auto.motorstatus", {motorstatus: randomMotorstatus});

        let randomTijd = "2." + Math.floor(Math.random() * 60);
        PubSub.publish("auto.rondetijden", {rondetijd: randomTijd});
        
    }
}

class RaceEngineer {
    constructor(naam) {
        this.naam = naam;
    }
    getData(topic, data) {
        if (topic == "auto.rondetijden") document.getElementsByClassName("tijd")[1].innerHTML = data.rondetijd;
        if (topic == "auto.bandentemperatuur") document.getElementById("bandentemp").innerHTML = data.bandentemperatuur + " deg. celsius";
        if (topic == "auto.motorstatus") document.getElementById("motorstatus").innerHTML = data.motorstatus;
    }
}


const tijdwaarneming = {
    zendTijd : function() {
        let randomTijd = "2." + Math.floor(Math.random() * 60);
        PubSub.publish("auto.rondetijden", {rondetijd: randomTijd});
    }
}

const scorebord = {
    updateBord : function(topic, data) {
        document.getElementsByClassName("tijd")[0].innerHTML = data.rondetijd;
    }
}


let raceBezig = false;

let subscribers = [];
let raceDeelnemers = [];
let raceEngineers = [];
let rondeTimer;  // variable voor het zetten van de timer

raceDeelnemers.push (new RaceAuto("Red Bull"));
raceEngineers.push (new RaceEngineer("Harry"));


subscribers.push (PubSub.subscribe("auto", raceEngineers[0].getData));   // subscribe to all subjects
subscribers.push (PubSub.subscribe("auto.rondetijden", scorebord.updateBord));     // subscribe to subject rondetijden only

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

    
    raceDeelnemers[0].carStats();

    } 


}
