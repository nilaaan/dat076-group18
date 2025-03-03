import { Player } from "../model/player.interface";
import { formatPlayer } from "./formatPlayer";
import dotenv from "dotenv";

dotenv.config({ path: './src/.env' });

if (!process.env.API_KEY) {
    console.log("Could not find API_KEY in .env file");
    process.exit();
}

const API_URL = "https://v3.football.api-sports.io/players";
const API_KEY = process.env.API_KEY;

export async function fetchPlayers(teamId: number, season: number): Promise<Player[]> {
  const response = await fetch(`${API_URL}?team=${teamId}&season=${season}`, {
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
