import { PlayerService } from "./player";
import { TeamService } from "./team"

test("Testing balance before and after purchasing a player", async () => {
    /*const desc = "Test description";
    const taskService = new TaskService();
    await taskService.addTask(desc);
    const tasks = await taskService.getTasks();
    expect(tasks.some((task) => task.description === desc)).toBeTruthy();*/

    const player = {
        id: 1,
        name: "Player Playersson",
        position: "CAM",
        number: 5,
        club: "gbg",
        price: 1000,
        available: true,
        points: 100
    };

    const playerService = new PlayerService();
    const teamService = new TeamService(playerService);

    const balanceBefore: number = await teamService.getBalance();

    await playerService.addPlayer(player);
    await teamService.buyPlayer(1);

    const balanceAfter: number = await teamService.getBalance();

    expect(balanceBefore - balanceAfter === player.price).toBeTruthy();
})