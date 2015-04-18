# Omega Deathball

A project that aims to combine all match data to create a wonderful graph of death. Nodes are made of champions participating in a kill making the assumption that all kills and assists are equal. The advent of URF and the sabotage of NURF all but killed this plan. The strategic nature of NURF would have allowed this graph to display true strengths of teams and their performance. Instead the focus is now on the duo and solo operations.


This project actually uses static data gathered from urf endpoint. It however relatively easy to convert this to continuous operation. A source of matches would need to be added, and an expiration date on the tree query should be all that is required. There are some interesting occurrences as the main processor will create child nodes say 5-3 -> 3,5 but not parent nodes 5-3 -> 5-3-{135x} so there are some interesting gaps of compositions that have not been seen in the ~80,000 URF matches.


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
