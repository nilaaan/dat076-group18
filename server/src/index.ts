import { app } from "./start";
import { initDB } from "./db/conn";
import { ClubModel } from "./db/club.db";
import { fetchPlayersAndInsertToDB } from "./service/api";
import { addPlayers, addRatings } from "./service/addPlayers";
/**
 * App Variables
 */

const PORT : number = 8080; 

/**
 * Server Activation
 */

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

initDB(); 
//fetchPlayersAndInsertToDB();

// for testing: 
//addPlayers();
//addRatings(); 




