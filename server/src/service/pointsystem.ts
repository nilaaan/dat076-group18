import { IPointSystemService } from './pointsystem.interface';


export class PointSystemService implements IPointSystemService {



    // calculatePoints() (for a given round and user's team), will be broken down into several methods 
        // get all team_players and their last_rating from TeamPlayer table
        // convert their rating to points (using some point system (separate method))
        // add all points and return 

        // DONT FORGET TO TAKE INTO CONSIDERATION THAT LAST_RATING MIGHT BE NULL (if user chose to stick with injured/unavailable
        // player, IN THAT CASE TURN THE POINTS TO 0)


}
