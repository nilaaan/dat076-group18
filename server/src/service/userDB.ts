import { User } from "../model/user.interface";
import bcrypt from "bcrypt";
import { IUserService } from "./user.interface";
import { UserModel } from "../db/user.db";
import { TeamModel } from "../db/team.db";
import { TeamPlayers } from "../db/teamPlayers.db";
import { PlayerModel } from "../db/player.db";

export class UserDBService implements IUserService {

    async registerUser(username: string, password: string): Promise<User | null> {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const newUser = await UserModel.create({
                username: username,
                password: hashedPassword
            });

            const newTeam = await TeamModel.create({
                user_id: newUser.id,
                balance: 100000000,
                points: 0,
            });

            console.log(`Registered just now User with name ${username}`)
            // Convert the instance to a plain object and return it
            return {
                username: newUser.username,
                password: newUser.password,
                team: {
                    players: [],
                    balance: 100000000 
                }
            } as User;
        }
        catch (error) {
            if ((error as any).name === 'SequelizeUniqueConstraintError') {
                console.error(`User ${username} already exists`);
                return null;
            } else {
                console.error(`Error registering user ${username}: ${error}`);
                return null;
            }
        }
    }

    async findUser(username: string, password?: string): Promise<User | null> {

        const user = await UserModel.findOne({
            where: { username: username },
        });

        if (!user) {
            console.error(`User ${username} does not exist`);
            return null;
        }

        
        if (password && !await bcrypt.compare(password, user.password)) {
            console.error(`Wrong password`);
            return null;
        }

        // Find the team for the user
        const team = await TeamModel.findOne({
            where: { user_id: user.id }
        });

        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return null;
        }

        // Find the players associated with the user's team
        const teamPlayers = await TeamPlayers.findAll({
            where: { team_id: team.id },
        });

        // Extract the player IDs from the teamPlayers results
        const playerIds = teamPlayers.map(tp => tp.player_id);

        // Fetch the player details using the player IDs
        const players = await PlayerModel.findAll({
            where: { id: playerIds }
        });

        console.log(`User with name ${username} logged in just now`)

        return {
            username: user.username,
            password: user.password,
            team: {
                players: players.map(player => ({
                    id: player.id,
                    name: player.name,
                    position: player.position,
                    number: player.number,
                    club: player.club,
                    price: player.price,
                    image: player.image
                })),
                balance: team.balance
            }
        } as User;
    }
}