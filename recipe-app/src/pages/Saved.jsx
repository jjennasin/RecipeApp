import { useState } from "react";

const recipesMock = [
  {
    title: "Recipe 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Recipe 2",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Recipe 3",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Recipe 4",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Recipe 5",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

export default function SavedRecipesPage() {
  const [recipes] = useState(recipesMock);

  return (
    <div className="w-96 h-screen px-5 pt-9 pb-14 relative bg-white inline-flex flex-col justify-start items-start gap-5 overflow-hidden">
      {/* Header */}
      <div className="self-stretch text-center text-navy text-4xl font-['Orelega_One']">
        Saved Recipes
      </div>

      {/* Recipe Cards */}
      <div
        data-layer="recipes"
        className="Recipes inline-flex self-stretch flex-col justify-start items-start gap-2.5 overflow-y-auto no-scrollbar">
        <div
          data-layer="Recipe"
          className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
        </div>
        <div
          data-layer="Recipe"
          className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
        </div>
        <div
          data-layer="Recipe"
          className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
        </div>
        <div
          data-layer="Recipe"
          className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
        </div>
        <div
          data-layer="Recipe"
          className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
        </div>
        <div
          data-layer="Recipe"
          className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
        </div>
        <div
          data-layer="Recipe"
          className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
