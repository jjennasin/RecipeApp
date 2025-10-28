import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SearchPage() {
    const [cuisine, setCuisine] = useState("");
    const [diet, setDiet] = useState("");
    const [time, setTime] = useState(60);
    const [difficulty, setDifficulty] = useState(2);
    const [details, setDetails] = useState("");

    const nav = useNavigate();

    const handleSubmit = () => {
        // Construct URL search params
        const params = new URLSearchParams({
            cuisine,
            diet,
            time: time.toString(),
            difficulty: difficulty.toString(),
            details,
        });

        // Navigate to /recipe with query string
        nav(`/recipe?${params.toString()}`);
    };

    return (
        <div
            data-layer="Init search"
            className="InitSearch w-96 h-screen px-5 pt-9 pb-20 relative bg-white inline-flex flex-col justify-start items-start gap-5 overflow-y-auto scrollbar-none"
        >
            {/* Title */}
            <div className="text-center text-navy self-stretch text-4xl font-['Orelega_One']">
                What are you working with?
            </div>

            {/* Camera Button */}
            <button
                type="button"
                className="self-stretch h-12 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-center items-center gap-[5px] text-navy font-['Franklin_Gothic_Book'] hover:bg-greenishYellow/50 transition"
                onClick={() => alert("Camera/ingredient detection feature coming soon!")}
            >
                <img src="./src/assets/camera32.svg" className="w-6 h-6" alt="Camera" />
                Find Ingredients
            </button>

            {/* Cuisine Dropdown */}
            <div className="self-stretch flex flex-col gap-1">
                <label className="text-navy text-base font-['Franklin_Gothic_Book']">
                    Cuisine
                </label>
                <div className="relative w-full">
                    <select
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                        className="appearance-none h-12 w-full p-2.5 pr-10 rounded-[10px] border border-darkYellow text-navy font-['Franklin_Gothic_Book'] bg-white focus:outline-none focus:ring-0 focus:border-darkYellow">
                        <option value="">Select</option>
                        <option value="italian">Italian</option>
                        <option value="mexican">Mexican</option>
                        <option value="indian">Indian</option>
                        <option value="japanese">Japanese</option>
                        <option value="american">American</option>
                    </select>
                    <img
                        src="./src/assets/dArrow20.svg" alt="Dropdown Arrow"
                        className="absolute right-3 top-1/2 w-5 h-5 transform -translate-y-1/2 pointer-events-none"
                    />
                </div>
            </div>

            {/* Time Slider */}
            <div className="self-stretch flex flex-col gap-1">
                <div className="flex justify-between text-navy text-base font-['Franklin_Gothic_Book']">
                    <span>Time</span>
                    <span>{time} min</span>
                </div>
                <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full accent-darkRed"
                />
                <div className="flex justify-between text-darkRed text-sm font-['Franklin_Gothic_Book']">
                    <span>5 min</span>
                    <span>60 min</span>
                    <span>120 min</span>
                </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="self-stretch flex flex-col gap-1">
                <label className="text-navy text-base font-['Franklin_Gothic_Book']">
                    Dietary Restrictions
                </label>
                <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    className="h-12 w-full p-2.5 rounded-[10px] border border-darkYellow text-navy font-['Franklin_Gothic_Book']"
                >
                    <option value="">Select</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="dairy-free">Dairy-Free</option>
                    <option value="nut-free">Nut-Free</option>
                </select>
            </div>

            {/* Difficulty Slider */}
            <div className="self-stretch flex flex-col gap-1">
                <label className="text-navy text-base font-['Franklin_Gothic_Book']">
                    Difficulty
                </label>
                <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full accent-darkRed"
                />
                <div className="flex justify-between text-darkRed text-sm font-['Franklin_Gothic_Book']">
                    <span>Easy</span>
                    <span>Medium</span>
                    <span>Hard</span>
                </div>
            </div>

            {/* Extra Details */}
            <div className="self-stretch flex flex-col gap-1">
                <label className="text-navy text-base font-['Franklin_Gothic_Book']">
                    Any other details?
                </label>
                <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Type here..."
                    className="h-24 w-full p-2.5 rounded-[10px] border border-darkYellow text-navy font-['Franklin_Gothic_Book'] resize-none"
                />
            </div>

            {/* Submit */}
            <button
                type="button"
                onClick={handleSubmit}
                className="mt-3 w-full py-2  bg-lighterRed rounded-[10px] text-white text-base font-normal font-['Franklin_Gothic_Book'] hover:bg-darkRed transition-all"
            >
                Search Recipes
            </button>
        </div>
    );
}
