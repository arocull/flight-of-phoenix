Final Project for CGT141 (Web Design) at Purdue University. We decided a game would be fun to make!

This game was developed by Alan O'Cull, Patrick Ryan, and Shelby Hockaday.
As of 4/28/2021, it is available to play at [flightofphoenixga.me](http://flightofphoenixga.me), though may not be online forever.

# Play
To play, simply open [index.html](www/html/index.html) in your web browser browser.

# Modding
If you would like to mod the game or add more levels, the [scripts](www/html/scripts) contains a few scripts and subfolders.

Modify [engine-level](www/html/scripts/engine) scripts for fundamental changes.
Special game-specific or template objects can be stored in [special](www/html/scripts/special) scripts for easy organization.
Object, engine, and level tests can be stored in the [tests](www/html/scripts/tests) folder.
Finally, if you'd like to make your own levels, you can edit [levels.js](www/html/scripts/levels.js) or create your own script that is of similar format.

Remember to update your dependencies in [game.html](www/html/game.html)!
They should also be loaded in order of use (i.e. the Vector object is used in Ray objects, so the Vector module is loaded first).