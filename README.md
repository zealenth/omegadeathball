# Omega Deathball

A project that aims to combine all match data to create a wonderful graph of death. Taking the assumption that all kills and assists are equal, nodes are made of champions participating in a kill. With the advent of URF and the sabotage of NURF this became a solo operation. The strategic nature of NURF would have allowed this graph to display true strengths of teams and how they perform. Instead this now has shifted to rogue solo or duo operation.


This project actually uses static data gathered the from urf endpoint. It however is relatively easy to convert this to continuous operation. A source of matches would need to be added, and an expiration date on the tree query should be all that is required. There are some interesting occurrences as the main processor will create child nodes say 5-3 -> 3,5 but not parent nodes 5-3 -> 5-3-{135x} so there are some interesting gaps of compositions that have not been seen in the ~80,000 URF matches.

This project can be viewed with data on lol.lunarvoid.com or taran.io:9000.
# Installation
Mongo 2.6+ should be installed for bulk imports  
git clone  
npm install && bower install  
tar --xz -xf /server/dbops/*.xz  
sh populateDB.sh    
grunt serve

# Custom Matches
Custom matches could be generated through the mongoHelper in dbops, it just needs to be pointed to the matches folder of .json files

# Data Collecting
Scripts folder contains two files. rito-gamer-parser.js is used as a one shot persistent runner where as the apifetch.js takes the lazy way out and relies on cron to invoke it every 5 minutes.
