import { RatingModel } from "../db/rating.db";
import { PlayerDBService } from "./playerDB";



const addAllRatings = async () => {
    const ratings = [
        { player_id: 1, round: 1, rating: null },
        { player_id: 2, round: 1, rating: 7.3 },
        { player_id: 1, round: 2, rating: null },
        { player_id: 2, round: 2, rating: null },
        { player_id: 1, round: 3, rating: 3.1 },
        { player_id: 2, round: 3, rating: 6.2 },
        { player_id: 1, round: 4, rating: 5.7 },
        { player_id: 2, round: 4, rating: null },
        { player_id: 1, round: 5, rating: 7.2 },
        { player_id: 2, round: 5, rating: null },
        { player_id: 1, round: 6, rating: null },
        { player_id: 2, round: 6, rating: null },
        { player_id: 1, round: 7, rating: 7.1 },
        { player_id: 2, round: 7, rating: null },
        { player_id: 1, round: 8, rating: 3.2 },
        { player_id: 2, round: 8, rating: 6.0 },
        { player_id: 1, round: 9, rating: null },
        { player_id: 2, round: 9, rating: 8.0 },
    ];

    for (const rating of ratings) {
        await RatingModel.create(rating); 
    }
};

test("testing obtainRecentForm method", async () => {
    
        await addAllRatings();
    
        const playerDBService = new PlayerDBService();
    
        const recentForm = await playerDBService.obtainRecentForm(1, 5);

        console.log("Player 1 recent form: " + recentForm);

        expect(recentForm).toEqual(4.4); 
    
    }); 