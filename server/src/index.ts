import { app } from "./start";
import { initDB } from "./db/conn";
import { ClubModel } from "./db/club.db";
import { fetchPlayersAndInsertToDB, fetchMockupPlayers } from "./service/api";
import { addPlayers, addRatings } from "./service/addPlayers";
import { UserModel } from "./db/user.db";
import { Game_sessionModel } from "./db/game_session.db";
import { User_games } from "./db/user_game.db";
import { TeamModel } from "./db/team.db";
import { TeamPlayers } from "./db/teamPlayers.db";
import dotenv from "dotenv";
/**
 * App Variables
 */

const PORT : number = 8080; 

/**
 * Server Activation
 */

const deleteAllEntries = async () => {
    try {
        await Game_sessionModel.destroy({ where: {} });
        await UserModel.destroy({ where: {} });
        await User_games.destroy({ where: {} });
        await TeamModel.destroy({ where: {} });
        await TeamPlayers.destroy({ where: {} });

        console.log("All entries in gamesession, user, and usergames tables have been deleted.");
    } catch (error) {
        console.error("Error deleting entries in gamesession, user, and usergames tables:", error);
    }
};

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

dotenv.config({ path: './src/.env' });

if (!process.env.API_KEY) {
  console.log("Could not find MOCK_PLAYERS in .env file");
  process.exit();
}

const MOCK_PLAYERS = process.env.MOCK_PLAYERS;

if (MOCK_PLAYERS === "true") {
    fetchMockupPlayers();
} else {
    fetchPlayersAndInsertToDB();
}

initDB(); 
//deleteAllEntries(); 
//fetchPlayersAndInsertToDB();

// for testing: 
//addPlayers();
//addRatings(); 




