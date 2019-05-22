
window.onload = function() { 

    document.getElementById("myStartButton").addEventListener("click", startStopRace);
    document.getElementById("myMenuButton").addEventListener("click", kiesTeam);

    // build scoreboard for 5 cars (for the time being)
    for(let i = 0; i < 5; i++) {
        let newDiv = document.createElement("div");
        document.getElementById("scorebordContainer").appendChild(newDiv).setAttribute("id", "row" + i);
    }



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
        PubSub.publish("auto.rondetijden", {teamnaam: this.teamnaam, idno: this.idno, rondetijd: randomTijd});
        
    }
}

class RaceEngineer {
    constructor(naam, idno) {
        this.naam = naam;
        this.idno = idno;
        this.isActive = false;
    }

    setActive (active) {
        this.isActive = active;
    }

    getData(topic, data) {
        console.log(this.idno +"-" + data.idno);

        if (this.isActive && (this.idno == data.idno)) {
            console.log(this.naam);
            document.getElementById("teamnaam").innerHTML = raceDeelnemers[activeTeam].getTeamnaam();
            if (topic == "auto.rondetijden") document.getElementById("tijd").innerHTML = data.rondetijd;
            if (topic == "auto.bandentemperatuur") document.getElementById("bandentemp").innerHTML = data.bandentemperatuur + " deg. celsius";
            if (topic == "auto.motorstatus") document.getElementById("motorstatus").innerHTML = data.motorstatus;
        }
    }
}

const scorebord = {
    updateBord : function(topic, data) {
        document.getElementById("row" + data.idno).innerHTML = data.teamnaam + ": " + data.rondetijd;
    }
}


let raceBezig = false;

let subscribers = [];
let raceDeelnemers = [];
let raceEngineers = [];
let activeTeam = 0;     // team waarvan de teamdata getoond wordt
let rondeTimer;  // variable voor het zetten van de timer

raceDeelnemers.push (new RaceAuto("Red Bull", 0));  // set id no. to place in array
raceEngineers.push (new RaceEngineer("Harry", 0 ));

raceDeelnemers.push (new RaceAuto("Ferrari", 1));   // set id no. to place in array
raceEngineers.push (new RaceEngineer("Peter", 1 ));

for (let i=0; i<raceDeelnemers.length; i++) {
    let menu = document.getElementById("teamselector");
    let option = document.createElement("option");
    //let value = document.createElement("value");
    option.text = raceDeelnemers[i].getTeamnaam();
    option.value = i;
    menu.add(option);
    }

    //console.log (document.getElementById("teamselector").value);

 // subscribe all engineers to all subjects for their own car
for (let i=0; i < raceDeelnemers.length; i++) {
    subscribers.push (PubSub.subscribe("auto", raceEngineers[i].getData.bind(raceEngineers[i])));
    }

// scorebord subscribes to subject rondetijden only
subscribers.push (PubSub.subscribe("auto.rondetijden", scorebord.updateBord));   

for (let i; i < raceDeelnemers.length; i++) {
    getElementById
}

function kiesTeam() {
    console.log("!" + activeTeam);
    let keuze = document.getElementById("teamselector").value;
    
    raceEngineers[activeTeam].setActive(false);
    activeTeam = keuze;
    raceEngineers[activeTeam].setActive(true);
    console.log(activeTeam);
    raceEngineers.forEach(element => {
        console.log(element.isActive);
        
    });
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

    for (let i=0; i<raceDeelnemers.length; i++){
        raceDeelnemers[i].carStats();
        }
    } 



}