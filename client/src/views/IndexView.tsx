import stadium from '/stadium.jpeg';
import '../App.css';

const IndexView = () => {
    return (
        <div className="flex flex-col items-center overflow-hidden">
            <div className="h-40 md:h-72 lg:h-96 flex justify-center items-center overflow-hidden">
                <img src={stadium} className="object-center" />
            </div>
            <div className="w-full  preset-gradient">
                Test
            </div>
        </div>
    );
};

export default IndexView;