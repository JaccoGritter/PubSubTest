<b>Demonstratie gebruik van het publisher/subscriber pattern</b>

Er wordt een f1 race gesimuleerd met 5 teams. Ieder team heeft 1 auto en 1 raceengineer.
Een rondje duurt op het circuit tussen 2 en 3 minuten maar voor ons 2 seconden.

Er zijn 3 objecten die data ontvangen (subscriber) of zenden (publisher):

1. Raceauto - zend ieder rondje data met rondetijd, motorstatus en bandentemperatuur 

2. Datamonitor - de ingelogde raceengineer ziet hierop alle data van zijn team

3. Rondetijdenbord - ontvangt alleen de rondetijden

Met de start/stop knop kan een race worden gestart of beeindigd.