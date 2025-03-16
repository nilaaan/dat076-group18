import { User } from "../model/user.interface";

export interface IUserService {

    // registers a new user with the given username and password
    // returns the user object if successful, null if the username is already taken
    registerUser(username: string, password: string): Promise <User | null>;

    
    // finds a user with the given username and password
    // if password is not provided, only the username is used to find the user
    // returns the user object if successful, null if the user does not exist or the password is incorrect
    findUser(username: string, password ?: string): Promise <User | null>;

    
    updateGamesessionState(username: string): Promise<boolean | null>; 
}