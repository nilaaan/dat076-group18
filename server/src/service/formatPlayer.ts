import { Player } from "../model/player.interface";

export function formatPlayer(apiData: any): Player {
  return {
    id: apiData.player.id,
    name: apiData.player.name,
    position: apiData.statistics[0]?.games?.position || "Unknown",
    number: apiData.statistics[0]?.games?.number || 0,
    club: apiData.statistics[0]?.team?.name || "Unknown",
    price: apiData.player?.value || 10,  
    image: apiData.player?.photo || ""
  };
}
