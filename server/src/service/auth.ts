import { User } from "../model/user.interface";
import bcrypt from "bcrypt";
import { IUserService } from "./user.interface";

export class AuthService implements IUserService {

   users: User[] = [];

   async registerUser(username: string, password: string) : Promise <User | null> {
      // For the hashed password
      const salt = bcrypt.genSaltSync(10);

      if (this.users.find(u => u.username === username)) {
         console.error(`User ${username} already exist`);
         return null;
      }

      const newUser: User = {
         username,
         password: bcrypt.hashSync(password, salt),
         team: {
            players: [],
            balance: 100000000
         }
      }
      // TODO Database
      this.users.push(newUser);

      console.log(`Successfully registered user with name ${username}`)
      return (newUser);
   }

   async findUser(username: string, password ?: string) : Promise <User | null> {

      // maybe more secure to not tell wheter name or pass is wrong
      // users.find((user) => user.username === username && bcrypt.compare(password, user.password))

      // TODO Database
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
};