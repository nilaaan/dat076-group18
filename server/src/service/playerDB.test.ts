import { RatingModel } from "../db/rating.db";
import { GameSessionService } from "./game_session";
import { PlayerDBService } from "./playerDB";
import { PlayerModel } from "../db/player.db";
import { PlayerService } from "./player";

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


export const addAllPlayers = async () => {
    const playerService = new PlayerService();
    const players = await playerService.getPlayers();

    // Add all players to the PlayerModel table before running the tests
    for (const player of players) {
        await PlayerModel.create(player);
    }
};

test("Retrieving the recent form of an available player", async () => {
    
        await addAllRatings();
    
        const playerDBService = new PlayerDBService();
    
        const recentForm = await playerDBService.getRecentForm(1, 5);

        console.log("Player 1 recent form: " + recentForm);

        expect(recentForm).toEqual(4.4); 
    
    }); 


test("If a specific player is requested then it should be returned", async () => {

    await addAllPlayers();

    const player1 = 
    {
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 10,
        image: "img1",
    }; 
    const playerDBService = new PlayerDBService();
    const player1copy = await playerDBService.getPlayer(1);
    expect(player1copy).toEqual(player1);
});

test("If a player that does not exist is requested then undefined should be returned", async () => {
    

    const playerDBService = new PlayerDBService();
    const undefPlayer = await playerDBService.getPlayer(1006);
    expect(undefPlayer).toBeUndefined();
});

test("All players should be returned", async () => {
    const allPlayers = [ 
        {
            id: 1, 
            name: "Test player1",
            position: "Forward",
            number: 10,
            club: "Test Club",
            price: 10,
            image: "img1",
        },
        {
            id: 2, 
            name: "Test player2",
            position: "Forward",
            number: 9,
            club: "Test Club",
            price: 10,
            image: "img2",
        },
        {
            id: 3, 
            name: "Test player3",
            position: "Defender",
            number: 3,
            club: "Test Club",
            price: 5,
            image: "img3",
        },
        {
            id: 4, 
            name: "Test player4",
            position: "Defender",
            number: 5,
            club: "Test Club",
            price: 5,
            image: "img4",
        },
        {
            id: 5, 
            name: "Test player5",
            position: "Midfielder",
            number: 10,
            club: "Test Club",
            price: 200000000,
            image: "img5",
        }
    ]

    const playerDBService = new PlayerDBService();
    const allPlayersCopy = await playerDBService.getPlayers();

    expect(allPlayersCopy).toEqual(allPlayers);
});

test("All top performers should be returned", async () => {

    const expectedPlayers = [{
        id: 2, 
        name: "Test player2",
        position: "Forward",
        number: 9,
        club: "Test Club",
        price: 10,
        image: "img2",
    }]
    const playerDBService = new PlayerDBService();
    const expectedPlayersCopy = await playerDBService.getTopPerformers(1);
    

    expect(expectedPlayersCopy).toEqual(expectedPlayers);
});

test("No players available in round 2, so no top performers", async () => {

    const playerDBService = new PlayerDBService();
    const expectedPlayersCopy = await playerDBService.getTopPerformers(2);
    expect(expectedPlayersCopy).toEqual(undefined);
});


test("Get round rating for available player", async () => {


        const playerDBService = new PlayerDBService();
        const player1Rating = await playerDBService.getRoundRating(2,1);
    
        expect(player1Rating).toEqual(7.3);
    });

test("Get round rating for unavailable player", async () => {


    const playerDBService = new PlayerDBService();
    const player1Rating = await playerDBService.getRoundRating(1,1);

    expect(player1Rating).toEqual(null);
});

test("Get round rating for non-existing player", async () => {


    const playerDBService = new PlayerDBService();
    const player1Rating = await playerDBService.getRoundRating(0,1);

    expect(player1Rating).toEqual(undefined);
});

test("Get round availability for player2 should be true", async () => {


    const playerDBService = new PlayerDBService();
    const player1Rating = await playerDBService.getRoundAvailability(2,1);

    expect(player1Rating).toEqual(true);
});

test("If a player has no rating for the round, it should not be available", async () => {


    const playerDBService = new PlayerDBService();
    const player1Rating = await playerDBService.getRoundAvailability(1,1);

    expect(player1Rating).toEqual(false);
});