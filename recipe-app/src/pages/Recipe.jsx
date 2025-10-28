import { useLocation, useNavigate } from "react-router-dom";

export default function RecipePage() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const cuisine = params.get("cuisine") || "None";
    const diet = params.get("diet") || "None";
    const time = params.get("time") || "60";
    const difficulty = params.get("difficulty") || "Medium";
    const details = params.get("details") || "None";

    const nav = useNavigate();

    return (
        <div className="w-96 h-screen px-5 pt-9 pb-20 bg-white flex flex-col gap-5 overflow-y-auto no-scrollbar">

            {/* Upper Nav */}
            <div className="flex justify-between items-center h-10">
                <img src="./src/assets/bArrow20.svg" className="w-5 h-5" alt="Back" onClick={() => nav("/search")}/>
                <img src="./src/assets/heart20.svg" className="w-5 h-5" alt="Favorite" />
            </div>

            {/* Image Placeholder */}
            <div data-layer="img" className="w-full h-[200px] p-5 bg-zinc-300 rounded-[10px] flex-shrink-0 flex-grow-0 flex flex-col justify-end overflow-hidden">
                {/* Use an actual image with object-cover if available */}
                {/* <img src="path-to-image" alt="Recipe" className="w-full h-full object-cover" /> */}
                <div className="text-white text-3xl font-['Orelega_One']">
                    Recipe
                </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-1">
                <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">Details</div>
                <div className="text-navy text-base font-['Franklin_Gothic_Book']">
                    Time: {time} minutes
                    <br />
                    Difficulty: {difficulty}
                </div>
            </div>

            {/* Ingredients */}
            <div className="flex flex-col gap-1">
                <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">Ingredients</div>
                <div className="text-navy text-base font-['Franklin_Gothic_Book']">
                    Num Ingredient 1
                    <br />
                    Num Ingredient 2
                    <br />
                    Num Ingredient 3
                </div>
            </div>

            {/* Instructions */}
            <div className="flex flex-col gap-1">
                <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">Instructions</div>
                <div className="text-navy text-base font-['Franklin_Gothic_Book']">
                    Instruction 1
                    <br />
                    Instruction 2
                    <br />
                    Instruction 3
                </div>
            </div>
        </div>
    );
}
