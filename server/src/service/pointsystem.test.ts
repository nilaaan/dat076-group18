import { PointSystemService } from "./pointsystem";


test("a rating should correclty be converted into a point value between 0-70", async () => {

    const pointsystem = new PointSystemService();
    const points = pointsystem.calculatePoints(5);

    expect(points).toBe(22.5);
}); 


test("if a rating value outside of 0-10 is passed, then undefined should be returned", async () => {

    const pointsystem = new PointSystemService();
    const points = pointsystem.calculatePoints(-4);

    expect(points).toBe(undefined);
}); 