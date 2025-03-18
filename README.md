# dat076-group18

The project report can be found in the root folder, called project-submission.pdf. 

The repo contains the following folders:
### client 
All frontend code and the frontend-api can be found inside of "src". "views" contain the different views, tabs, etc. The code inside of "components" is used to build most of the views. 

### server
All backend code and the database can be found inside of "src". "db" contains the configuration of the database, as well as the tables. "model" contains custom data structures, which are mostly interfaces. "router" contains the connection between the backend and the frontend, here we have the methods that the frontend api calls. "service" contains all of the logic, user authentication, players, teams, etc. The "router" code uses methods from the "service" layer.
