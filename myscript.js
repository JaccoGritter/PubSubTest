
window.onload = function() { 

class RaceAuto {
    constructor(teamnaam) {
        this.teamnaam = teamnaam;
        this.rondetijd = 0;
        this.bandentemperatuur = 0;
        this.motorstatus = 0;
    }

    getTeamnaam () {
        return this.teamnaam;
    }

    sendCarStats() {

        let randomTemperatuur = Math.floor(Math.random() * 30) + 80;
        PubSub.publish("auto.bandentemperatuur", {teamnaam: this.teamnaam, bandentemperatuur: randomTemperatuur});

        let randomTijd = "2." + Math.floor(Math.random() * 60);
        PubSub.publish("auto.rondetijden", {teamnaam: this.teamnaam, rondetijd: randomTijd});

        let randomMotorstatus = "" + (Math.floor(Math.random() * 50) + 50) + "%";
        PubSub.publish("auto.motorstatus", {teamnaam: this.teamnaam, motorstatus: randomMotorstatus});

        
    }
}

class RaceEngineer {
    constructor(naam, teamnaam) {
        this.naam = naam;
        this.teamnaam = teamnaam;
    }

    getNaam() {
        return this.naam;
    }

    getTeamnaam() {
        return this.teamnaam;
    }
}

const DataMonitor = {
    
    showData : function(topic, data) {
        if ( (engineerLoggedin != "") && (raceEngineers.get(engineerLoggedin).getTeamnaam() == data.teamnaam) ) {
            document.getElementById("teamnaam").innerHTML = data.teamnaam;
            if (topic == "auto.rondetijden") document.getElementById("tijd").innerHTML = data.rondetijd;
            if (topic == "auto.bandentemperatuur") document.getElementById("bandentemp").innerHTML = data.bandentemperatuur + " deg. celsius";
            if (topic == "auto.motorstatus") document.getElementById("motorstatus").innerHTML = data.motorstatus;
        }

    }

}

const Rondetijdenbord = {
    updateBord : function(topic, data) {
        let pos = getMapPositionTeam (data.teamnaam);
        document.getElementById("row" + pos).innerHTML = data.teamnaam + ": " + data.rondetijd;
       
    }
}

function getMapPositionTeam(team) {
    let i = 0;
    for (let value of raceDeelnemers.values()) {
        if (value.getTeamnaam() == team) return i;  
        i++;         
    }
    return -1;
}

function engineerLogin() {
    let keuze = document.getElementById("teamselector").value;
    engineerLoggedin = keuze;
}

function startStopRace() {
    if (!raceBezig) {
        document.getElementById("myStartButton").innerHTML = "Stop de race!";
        rondeTimer = setInterval(rondjesRijden, 2000);
        raceBezig = true;
    } else {
        clearInterval(rondeTimer);
        document.getElementById("myStartButton").innerHTML = "Herstart de race!";
        raceBezig = false;
    }
}

function rondjesRijden() {
        for (let value of raceDeelnemers.values()) {
            value.sendCarStats();
        }
    } 


function buildRondetijdenbord () {
    // build laptimes board for 5 cars (for the time being)
    for(let i = 0; i < 5; i++) {
        let newDiv = document.createElement("div");
        document.getElementById("scorebordContainer").appendChild(newDiv).setAttribute("id", "row" + i);
    }
}

function setEngineerloginoptions() {
    // set the options for the selection field
    for (let value of raceEngineers.values()) {
        let menu = document.getElementById("teamselector");
        let option = document.createElement("option");
        option.text = value.getNaam() + "-" + value.getTeamnaam();
        option.value = value.getNaam();
        menu.add(option);
    }
}

document.getElementById("myStartButton").addEventListener("click", startStopRace);
document.getElementById("myMenuButton").addEventListener("click", engineerLogin);

let raceBezig = false;

let raceDeelnemers = new Map();
let raceEngineers = new Map();

let engineerLoggedin = "";

let rondeTimer;  // variable voor het zetten van de timer

raceDeelnemers.set("Verstappen", new RaceAuto("Red Bull"));  
raceEngineers.set("Harry", new RaceEngineer("Harry", "Red Bull"));

raceDeelnemers.set("LeClerc", new RaceAuto("Ferrari"));   
raceEngineers.set("Peter", new RaceEngineer("Peter", "Ferrari"));

raceDeelnemers.set("Hamilton", new RaceAuto("Mercedes"));   
raceEngineers.set("John", new RaceEngineer("John", "Mercedes"));

raceDeelnemers.set("Ricciardo", new RaceAuto("Renault"));   
raceEngineers.set("Angela", new RaceEngineer("Angela", "Renault"));

raceDeelnemers.set("Sainz", new RaceAuto("McClaren"));   
raceEngineers.set("Oege", new RaceEngineer("Oege", "McClaren"));

buildRondetijdenbord();
setEngineerloginoptions()

// subscribe monitor to all subjects
PubSub.subscribe("auto", DataMonitor.showData);

//scorebord subscribes to subject rondetijden only 
PubSub.subscribe("auto.rondetijden", Rondetijdenbord.updateBord);

}