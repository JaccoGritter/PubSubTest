
window.onload = function() { 

    document.getElementById("myStartButton").addEventListener("click", startStopRace);
    document.getElementById("myMenuButton").addEventListener("click", kiesTeam);

    // build scoreboard for 5 cars (for the time being)
    for(let i = 0; i < 5; i++) {
        let newDiv = document.createElement("div");
        document.getElementById("scorebordContainer").appendChild(newDiv).setAttribute("id", "row" + i);
    }


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
        PubSub.publish("auto.bandentemperatuur", {bandentemperatuur: randomTemperatuur});

        let randomTijd = "2." + Math.floor(Math.random() * 60);
        PubSub.publish("auto.rondetijden", {teamnaam: this.teamnaam, rondetijd: randomTijd});

        let randomMotorstatus = "" + (Math.floor(Math.random() * 50) + 50) + "%";
        PubSub.publish("auto.motorstatus", {motorstatus: randomMotorstatus});

        
    }
}

class RaceEngineer {
    constructor(naam, teamnaam) {
        this.naam = naam;
        this.teamnaam = teamnaam;
        //this.isActive = false;
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
        //console.log(raceEngineers.get(engineerLoggedin).getTeamnaam() == data.teamnaam); 
        if ( (engineerLoggedin != "") && (raceEngineers.get(engineerLoggedin).getTeamnaam() == data.teamnaam) ) {
            document.getElementById("teamnaam").innerHTML = data.teamnaam;
            //console.log((topic == "auto.motorstatus") + " - " + data.motorstatus);
            if (topic == "auto.rondetijden") document.getElementById("tijd").innerHTML = data.rondetijd;
            if (topic == "auto.bandentemperatuur") document.getElementById("bandentemp").innerHTML = data.bandentemperatuur + " deg. celsius";
            if (topic == "auto.motorstatus") document.getElementById("motorstatus").innerHTML = data.motorstatus;
        }

    }

}

const scorebord = {
    updateBord : function(topic, data) {
        let pos = getMapPositionTeam (data.teamnaam);
        document.getElementById("row" + pos).innerHTML = data.teamnaam + ": " + data.rondetijd;
       
    }
}


let raceBezig = false;

let subscribers = [];
let raceDeelnemers = new Map();
let raceEngineers = new Map();

let engineerLoggedin = "";

let rondeTimer;  // variable voor het zetten van de timer

//let raceMonitor = new DataMonitor();

raceDeelnemers.set("Verstappen", new RaceAuto("Red Bull"));  
raceEngineers.set("Harry", new RaceEngineer("Harry", "Red Bull"));

raceDeelnemers.set("LeClerc", new RaceAuto("Ferrari"));   
raceEngineers.set("Peter", new RaceEngineer("Peter", "Ferrari"));

// set the options for the selection field
for (let value of raceEngineers.values()) {
    let menu = document.getElementById("teamselector");
    let option = document.createElement("option");
    option.text = value.getNaam() + "-" + value.getTeamnaam();
    option.value = value.getNaam();
    menu.add(option);
}


// subscribe monitor to all subjects
subscribers.push (PubSub.subscribe("auto", DataMonitor.showData));


// scorebord subscribes to subject rondetijden only
subscribers.push (PubSub.subscribe("auto.rondetijden", scorebord.updateBord));   

function getMapPositionTeam(team) {
    let i = 0;
    for (let value of raceDeelnemers.values()) {
        if (value.getTeamnaam() == team) return i;  
        i++;         
    }
    return -1;
}

function kiesTeam() {
    //console.log("!" + activeTeam);
    let keuze = document.getElementById("teamselector").value;
    engineerLoggedin = keuze;
    console.log(engineerLoggedin);
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

}