import { Player } from "../model/player.interface";
import { formatPlayer } from "./formatPlayer";
import dotenv from "dotenv";
import { PlayerModel } from "../db/player.db";

dotenv.config({ path: './src/.env' });

if (!process.env.API_KEY) {
  console.log("Could not find API_KEY in .env file");
  process.exit();
}

const API_URL = "https://v3.football.api-sports.io/players";
const API_KEY = process.env.API_KEY;

async function fetchPlayersFromTeam(teamId: number, season: number): Promise<Player[]> {
  const response = await fetch(
    `${API_URL}?team=${teamId}&season=${season}`,
    {
      method: "GET",
      headers: {
        "x-apisports-key": API_KEY,
      },
    });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response.map(formatPlayer);
}

async function fetchLeagueTeams(leagueId: number, season: number) {
  const response = await fetch(
    `https://v3.football.api-sports.io/teams?league=${leagueId}&season=${season}`,
    {
      method: "GET",
      headers: {
        "x-apisports-key": API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch teams: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response.map((team: any) => ({
    id: team.team.id,
    name: team.team.name,
  }));
}

export async function fetchAllLeaguePlayers(leagueId: number, season: number) {
  try {
    const teams = await fetchLeagueTeams(leagueId, season);
    console.log("Teams:", teams);

    let allPlayers: Player[] = [];

    for (const team of teams) {
      const players = await fetchPlayersFromTeam(team.id, season);
      console.log(`Fetched ${players.length} players from ${team.name}`);
      allPlayers = allPlayers.concat(players);
    }

    console.log("Total players fetched:", allPlayers.length);
    return allPlayers;

  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}

async function insertPlayersIntoDB(players: Player[]) {
  try {
    for (const player of players) {

      // Check if the player already exists by ID 
      const existingPlayer = await PlayerModel.findOne({
        where: { id: player.id },
      });

      if (!existingPlayer) {
        // Insert the player into the database if it doesn't already exist
        await PlayerModel.create({
          id: player.id,
          name: player.name,
          position: player.position,
          number: player.number,
          club: player.club,
          price: player.price,
          image: player.image,
        });
        console.log(`Inserted player ${player.name} into the database.`);
      } else {
        console.log(`Player ${player.name} already exists in the database.`);
      }
    }
  } catch (error) {
    console.error('Error inserting players into the database:', error);
  }
}

export async function fetchPlayersAndInsertToDB() {
  let allPlayers: Player[] = await fetchAllLeaguePlayers(39, 2023);
  insertPlayersIntoDB(allPlayers);
}