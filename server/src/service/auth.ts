import { User } from "../model/user.interface";
import bcrypt from "bcrypt";

// TODO Database 
const users: User[] = [];

const user1 = {
   username: "Test player1",
   password: "Forward"
};

export const registerUser = async(username: string, password: string) => {
   // For the hashed password
   const salt = bcrypt.genSaltSync(10);

   if (users.find(u => u.username === username)) {
      console.error(`User ${username} already exist`);
      return false;
   }

   // TODO Database
   users.push({
      username: username,
      password: bcrypt.hashSync(password, salt),
      team: {
         players: [],
         balance: 0
      }
   });

   console.log(`Successfully registered user with name ${username}`)
   return (true);
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