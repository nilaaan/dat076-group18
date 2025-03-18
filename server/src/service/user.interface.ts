import { UserModel } from "../db/user.db";
import { User } from "../model/user.interface";

export interface IUserService {

    // registers a new user with the given username and password
    // returns the user object if successful, null if the username is already taken
    registerUser(username: string, password: string): Promise <User | null>;

    
    // finds a user with the given username and password
    // if password is not provided, only the username is used to find the user
    // returns the user object if successful, null if the user does not exist or the password is incorrect
    findUser(username: string, password ?: string): Promise <User | null>;
    

    // Returns the user row of the given user from the User database table
    // Returns null if the user does not exist
    getUser(username: string): Promise<UserModel | null> 

    
    // Returns the user row of the given user (by id) from the User database table
    // Returns null if the user does not exist
    getUserById(id: number): Promise<UserModel | null> 


}