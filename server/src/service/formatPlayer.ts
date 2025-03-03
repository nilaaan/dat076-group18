import { Player } from "../model/player.interface";

export function formatPlayer(apiData: any): Player {
  return {
    id: apiData.player.id,
    name: apiData.player.name,
    position: apiData.statistics[0]?.games?.position || "Unknown",
    number: 0,
    club: apiData.statistics[0]?.team?.name || "Unknown",
    price: apiData.player?.value || 10, 
    available: true, 
    points: apiData.statistics[0]?.games?.rating
      ? parseFloat(apiData.statistics[0]?.games?.rating)
      : 0,
  };
}
