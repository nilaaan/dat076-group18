import { PlayerModel } from "../db/player.db";
import { RatingModel } from "../db/rating.db";

const positions = ["goalkeeper", "defender", "midfielder", "attacker"];
const clubs = Array.from({ length: 20 }, (_, i) => `testClub${i + 1}`);

const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(1);
const getRandomRating = () => (Math.random() < 0.2 ? null : parseFloat(getRandomFloat(1, 10))); // 20% chance of null

const addPlayers = async () => {
    // Delete all existing entries in the PlayerModel table
    await PlayerModel.destroy({ where: {}, truncate: true });
    
    for (let i = 1; i <= 20; i++) {
        await PlayerModel.create({
            id: i,
            name: `testPlayer${i}`,
            position: getRandomElement(positions),
            number: getRandomNumber(1, 10),
            club: clubs[i - 1],
            price: getRandomNumber(10, 30),
            image: "default_image",
        });
    }

    console.log("20 players added to the PlayerModel table.");
};

const addRatings = async () => {
    // Delete all existing entries in the RatingModel table
    await RatingModel.destroy({ where: {}, truncate: true });

    for (let round = 1; round <= 38; round++) {
        for (let player_id = 1; player_id <= 20; player_id++) {
            await RatingModel.create({
                player_id,
                round,
                rating: getRandomRating(),
            });
        }
    }

    console.log("Ratings added to the RatingModel table for 38 rounds.");
};

export { addPlayers, addRatings };