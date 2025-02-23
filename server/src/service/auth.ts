import { User } from "../model/user.interface";
import bcrypt from "bcrypt";

// TODO Database 
const users: User[] = [];

export const registerUser = async(username: string, password: string) : Promise <User | null> => {
   // For the hashed password
   const salt = bcrypt.genSaltSync(10);

   if (users.find(u => u.username === username)) {
      console.error(`User ${username} already exist`);
      return null;
   }

   const newUser: User = {
      username,
      password: bcrypt.hashSync(password, salt),
      team: {
         players: [],
         balance: 0
      }
   }
   // TODO Database
   users.push(newUser);

   console.log(`Successfully registered user with name ${username}`)
   return (newUser);
}

export const loginUser = async(username: string, password: string) => {

   // maybe more secure to not tell wheter name or pass is wrong
   // users.find((user) => user.username === username && bcrypt.compare(password, user.password))

   // TODO Database
   const user = users.find(u => u.username === username);

   if (!user) {
      console.error(`User ${username} does not exist`);
      return false;
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);

   if (!isPasswordValid) {
      console.error(`Wrong password`);
      return false;
   }

   console.log(`Logged in as ${username}`);
   return true;
}