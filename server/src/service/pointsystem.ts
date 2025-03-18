import { IPointSystemService } from './pointsystem.interface';



export class PointSystemService implements IPointSystemService {

    
    calculatePoints(rating: number | null) : number | undefined {
        if (rating === null) {
            console.log("got heere");
            console.log("rating is: " + rating);
            return 0;
        }
        if (rating < 0 || rating > 10) {
            console.error("Rating must be between 0 and 10.");
            return undefined; 
        }
        
        const a = 0.5;
        const b = 2;

        return a * Math.pow(rating, 2) + b * rating;
    };
}
