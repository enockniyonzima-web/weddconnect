import { TCategory } from "@/common/Entities";
import { fetchCategories } from "@/server-actions/category.actions";
import { getSearchParams } from "@/util/stringFuncs";
import CategoryCard from "./CategoryCard";

const CustomCategories:{category: TCategory, link: string}[] = [
     {category:{id:1, name: "Top Luxury Wedding Venues in Kigali (RWF 3M - above)", status: true, icon: 'https://weddconnect-s3.s3.eu-north-1.amazonaws.com/production/1742752124359-cropped-image.jpg',description:'', features:[],_count:{posts:0}},link:'?category=1&minPrice=3000000&maxPrice=12500000'},
     {category:{id:1, name: "Best Affordable Wedding Venues in Kigali (RWF 1M - 2M)", status: true, icon: 'https://weddconnect-s3.s3.eu-north-1.amazonaws.com/production/1742751974739-cropped-image.jpg',description:'', features:[],_count:{posts:0}},link:'?category=1&minPrice=1000000&maxPrice=2000000'},
]

export default async function CategoryContainer ({search}:{search:Record<string, string | undefined>}){
     let categories:TCategory[] = [];
     const categoriesRes  = await fetchCategories(getSearchParams(search));
     if(categoriesRes) categories = categoriesRes.data;

     return (
          <>
               <div className="w-full flex flex-col items-center justify-center gap-[10px] px-[2%] pt-[80px] pb-[20px] bg-black ">
                    <h1 className="text-[1.8rem] font-bold text-white">Explore Our Vendors</h1>
                    <p className="text-[0.9rem] text-gray-400">Discover our carefully curated selection of the finest wedding vendors.</p>
               </div>
               <div className="w-full grid grid-cols-1 gap-[20px] bg-black px-[5%] lg:px-[10%] py-[20px]">
                    {
                         CustomCategories.map(item => <CategoryCard key={`prepage-category-${item.category.name}`} link={item.link} category={item.category} />)
                    }
                    {
                         categories.map(category => <CategoryCard key={`prepage-category-${category.id}`} link={`?category=${category.id}`} category={category} />)
                    }
               </div>
          </>
     )
}