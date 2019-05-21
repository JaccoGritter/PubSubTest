
let subscribers = [];


function scorebord(topic, data) {
    console.log("Scorebord: " + data.rondetijd);
}

function teamEngineer (topic, data) {
    if (data.rondetijden) console.log("Team:" + data.rondetijden);
    if (data.bandentemperatuur) console.log("Team:" + data.bandentemperatuur);
    if (data.motorstatus) console.log("Team:" + data.motorstatus);
}

subscribers.push (PubSub.subscribe("auto", teamEngineer));              // subscribe to all subjects
subscribers.push (PubSub.subscribe("auto.rondetijden", scorebord));     // subscribe to subject rondetijden only


PubSub.publish("auto.rondetijden", {rondetijd: 1.43});
PubSub.publish("auto.bandentemperatuur", {bandentemperatuur: 95});
PubSub.publish("auto.motorstatus", {motorstatus: "80%"});

//console.log(subscribers[0]);
//console.log(subscribers[1]);
