
window.onload = function() { 
    document.getElementById("myButton").addEventListener("click", startStopRace) 
};

class RaceAuto {
    constructor(teamnaam, idno) {
        this.teamnaam = teamnaam;
        this.idno = idno;
        this.rondetijd = 0;
        this.bandentemperatuur = 0;
        this.motorstatus = 0;
    }

    getTeamnaam () {
        return this.teamnaam;
    }

    carStats() {

        let randomTemperatuur = Math.floor(Math.random() * 30) + 80;
        PubSub.publish("auto.bandentemperatuur", {bandentemperatuur: randomTemperatuur});

        let randomMotorstatus = "" + (Math.floor(Math.random() * 50) + 50) + "%";
        PubSub.publish("auto.motorstatus", {motorstatus: randomMotorstatus});

        let randomTijd = "2." + Math.floor(Math.random() * 60);
        PubSub.publish("auto.rondetijden", {teamnaam: this.teamnaam, rondetijd: randomTijd});
        
    }
}

class RaceEngineer {
    constructor(naam, idno) {
        this.naam = naam;
        this.idno = idno;
    }
    getData(topic, data) {
        if (topic == "auto.rondetijden") document.getElementById("tijd").innerHTML = data.rondetijd;
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
        document.getElementById("teamnaam").innerHTML = data.teamnaam;
        document.getElementById("rondetijd").innerHTML = data.rondetijd;
    }
}


let raceBezig = false;

let subscribers = [];
let raceDeelnemers = [];
let raceEngineers = [];
let rondeTimer;  // variable voor het zetten van de timer

raceDeelnemers.push (new RaceAuto("Red Bull", raceDeelnemers.length));   // set id no. to place in array
raceEngineers.push (new RaceEngineer("Harry", raceDeelnemers.length));


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
