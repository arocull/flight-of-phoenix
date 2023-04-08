Final Project for CGT141 (Web Design) at Purdue University. We decided a game would be fun to make!
If you'd like to see the version we submitted, check out the branch `archive-cgt141`

This game was developed by Alan O'Cull, Patrick Ryan, and Shelby Hockaday.
As of April 18th, 2023, it is available to play at [alanocull.com/phoenix](https://alanocull.com/phoenix/), though may not be online forever.

# Play
To play, simply open [game.html](www/html/game.html) in your web browser browser.

Home page is [index.html](www/html/index.html), and there is a feedback submission form at [feedback.html](www/html/feedback.html), though it does not actually send any data (but it does validate it!).

# Modding
If you would like to mod the game or add more levels, the [scripts](www/html/scripts) contains a few scripts and subfolders.

Modify [engine-level](www/html/scripts/engine) scripts for fundamental changes.
Special game-specific or template objects can be stored in [special](www/html/scripts/special) scripts for easy organization.
Object, engine, and level tests can be stored in the [tests](www/html/scripts/tests) folder.
Finally, if you'd like to make your own levels, you can edit [levels.js](www/html/scripts/levels.js) or create your own script that is of similar format.

Remember to update your dependencies in [game.html](www/html/game.html)!
They should also be loaded in order of use (i.e. the Vector object is used in Ray objects, so the Vector module is loaded first).
