import { useNavigate, Link } from "react-router-dom";

export default function Browse() {
  const nav = useNavigate();

  return (
    <div
      data-layer="init Browse Recipes"
      className="Initcolor w-96 h-screen px-5 pt-9 pb-20 relative bg-white inline-flex flex-col justify-start items-start gap-5 overflow-hidden">

      {/* Search */}
      <button
        onClick={() => nav("/search")}
        type="search"
        className="ImputArea self-stretch h-12 p-2.5 rounded-[10px] border border-darkYellow text-darkRed font-['Franklin_Gothic_Book'] placeholder:text-lighterRed focus:outline-none focus:ring-0 inline-flex justify-start items-center gap-[5px] overflow-hidden">
        <img src="./src/assets/search20.svg" className="logo" alt="Search Icon" />
        Search
      </button>

      <section className="Preview self-stretch flex justify-center">
        <div className="relative h-48 w-auto rounded-[10px]">
          {/* radio inputs (hidden) */}
          <input id="card-01" type="radio" name="slider" className="sr-only peer/01" defaultChecked />
          <input id="card-02" type="radio" name="slider" className="sr-only peer/02" />
          <input id="card-03" type="radio" name="slider" className="sr-only peer/03" />

          {/* Card 1 */}
          <div
            className={`
              absolute inset-0 w-64 h-48 rounded-[10px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
              peer-checked/01:relative peer-checked/01:z-50 peer-checked/01:translate-x-0
              peer-checked/02:-translate-x-8 peer-checked/02:z-40
              peer-checked/03:-translate-x-10 peer-checked/03:z-30
            `}
          >
            <label className="absolute inset-0 cursor-pointer" htmlFor="card-01">
              <span className="sr-only">Card 1</span>
            </label>
            <article className="bg-gray-300 p-5 w-64 h-48 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(74,76,78,0.25)] flex flex-col justify-end">
              <h2 className="text-white font-['Franklin_Gothic_Medium'] text-xl mb-1">Title</h2>
              <p className="text-white font-['Franklin_Gothic_Book'] leading-snug">
                Caption
              </p>
            </article>
          </div>

          {/* Card 2 */}
          <div
            className={`
              absolute inset-0 w-64 h-48 rounded-[10px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
              peer-checked/01:translate-x-8 peer-checked/01:z-40
              peer-checked/02:relative peer-checked/02:z-50 peer-checked/02:translate-x-0 
              peer-checked/03:-translate-x-8 peer-checked/03:z-40
            `}
          >
            <label className="absolute inset-0 cursor-pointer" htmlFor="card-02">
              <span className="sr-only">Card 2</span>
            </label>
            <article className="bg-gray-300 p-5 w-64 h-48 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(74,76,78,0.25)] flex flex-col justify-end">
              <h2 className="text-white font-['Franklin_Gothic_Medium'] text-xl mb-1">Title</h2>
              <p className="text-white font-['Franklin_Gothic_Book'] leading-snug">
                Caption
              </p>
            </article>
          </div>

          {/* Card 3 */}
          <div
            className={`
              absolute inset-0 w-64 h-48 rounded-[10px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
              peer-checked/01:translate-x-10 peer-checked/01:z-30
              peer-checked/02:translate-x-8 peer-checked/02:z-40
              peer-checked/03:relative peer-checked/03:z-50 peer-checked/03:translate-x-0
            `}
          >
            <label className="absolute inset-0 cursor-pointer" htmlFor="card-03">
              <span className="sr-only">Card 3</span>
            </label>
            <article className="bg-gray-300 p-5 w-64 h-48 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(74,76,78,0.25)] flex flex-col justify-end">
              <h2 className="text-white font-['Franklin_Gothic_Medium'] text-xl mb-1">Title</h2>
              <p className="text-white font-['Franklin_Gothic_Book'] leading-snug">
                Caption
              </p>
            </article>
          </div>
        </div>
      </section>

      <div
        data-layer="recipes"
        className="Recipes flex flex-col justify-start items-start gap-2.5 overflow-y-auto">
        <div
          data-layer="Recipe"
          className="Recipe w-80 h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
        </div>
        <div
          data-layer="Recipe"
          className="Recipe w-80 h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
        </div>
        <div
          data-layer="Recipe"
          className="Recipe w-80 h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
        </div>
        <div
          data-layer="Recipe"
          className="Recipe w-80 h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
        </div>
        <div
          data-layer="Recipe"
          className="Recipe w-80 h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

