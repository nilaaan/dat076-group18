export interface ITeamStateService {

    // updates the user's team points
    // returns true if the update was successful
    // returns undefined otherwise
    updateTeamPoints(user_id: number): Promise<boolean | undefined>;

    
}