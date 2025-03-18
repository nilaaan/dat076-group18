import { User } from "../model/user.interface";
import bcrypt from "bcrypt";
import { IUserService } from "./user.interface";
import { UserModel } from "../db/user.db";


// Takes care of all user related operations
// Stores all users in memory
export class AuthService implements IUserService {

   users: User[] = [];
   private currentId: number = 1;


   // registers a new user with the given username and password
   // returns the new user if successful, otherwise null
   async registerUser(username: string, password: string) : Promise <User | null> {
      // For the hashed password
      const salt = bcrypt.genSaltSync(10);

      if (this.users.find(u => u.username === username)) {
         console.error(`User ${username} already exist`);
         return null;
      }

      const newUser: User = {
         id: this.currentId++,
         username,
         password: bcrypt.hashSync(password, salt),
         team: {
            players: [],
            balance: 100000000,
            points: 0
         }
      }
      this.users.push(newUser);

      console.log(`Successfully registered user with name ${username}`)
      return (newUser);
   }

   // finds a user with the given username and password
   // returns the user if successful, otherwise null
   async findUser(username: string, password ?: string) : Promise <User | null> {

      const user = this.users.find(u => u.username === username);

      if (!user) {
         console.error(`User ${username} does not exist`);
         return null;
      }

      if (!password) {
         return user;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         console.error(`Wrong password`);
         return null;
      }

      console.log(`Logged in as ${username}`);
      return user;
      };


      getUser(username: string): Promise<UserModel | null> {
         // not used before creating UserDB and therefore has no implementation
         throw new Error("Method not implemented.");
      }


      getUserById(id: number): Promise<UserModel | null> {
         // not used before creating UserDB and therefore has no implementation
         throw new Error("Method not implemented.");
      }
   
};