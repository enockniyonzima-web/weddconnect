import CategoryContainer from "./[components]/CategoryContainer";
import CategoryPostContainer from "./[components]/CategoryPostContainer";



export default async function PostsPage ({searchParams}:{searchParams: Promise<Record<string, string | undefined>>}) {
     const search = await searchParams;
     
     const category = search.category;
     if(category) {
          return <CategoryPostContainer search={search} />
     }
     return (
          <CategoryContainer search={search} />
     )

     
     
     
     
}