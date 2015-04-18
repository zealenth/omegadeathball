# Omega Deathball

A project that aims to combine all match data to create a wonderful graph of death. Taking the assumption that all kills and assists are equal nodes are made of champions participating in a kill. With the advent of URF and the sabotage of NURF this became a solo operation. The strategic nature of NURF would have allowed this graph to display true strengths of teams and how they perform. Instead this now has shifted to rogue solo or duo operation.


This project actually uses static data gathered from urf endpoint. It however relatively easy to convert this to continuous operation. A source of matches would need to be added, and an expiration date on the tree query should be all that is required. There are some interesting occurrences as the main processor will create child nodes say 5-3 -> 3,5 but not parent nodes 5-3 -> 5-3-{135x} so there are some interesting gaps of compositions that have not been seen in the ~80,000 URF matches.


# Installation
Mongo 2.6+ should be installed for bulk imports  
git clone  
npm install && bower install  
tar --xz -xf /server/dbops/*.xz  
sh populateDB.sh  

# Custom Matches
Custom matches could be generated through the mongoHelper in dbops, it just needs to be pointed to the matches folder of .json files
