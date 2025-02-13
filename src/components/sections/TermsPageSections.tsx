export const TextSection = ({content} :{content: {title:string, pos: number,paragraphs:string[], type:string}}) => {
     return (
          <section className="w-full flex flex-col items-start justify-start gap-[20px]">
               <h2 className="text-[1.2rem] font-bold text-black">{content.pos}. {content.title}</h2>
               <div className="w-full flex flex-col gap-[10px]">
                    {
                         content.paragraphs.length > 0 && 
                         content.paragraphs.map((text, index) => <p key={`${content.title}-para-${index}`} className="text-[0.9rem] text-gray-700">{text}</p>)
                    }
               </div>
          </section>
     )
}

export const ListSection = ({content} :{content: {title:string, pos: number,paragraphs:string[], type:string}}) => {
     return (
          <section className="w-full flex flex-col items-start justify-start gap-[20px]">
               <h2 className="text-[1.2rem] font-bold text-black">{content.pos}. {content.title}</h2>
               <ul className="w-[90%] mx-auto flex flex-col gap-[10px] list-disc">

                    {
                         content.paragraphs.length > 0 && 
                         content.paragraphs.map((text, index) => <li key={`${content.title}-para-${index}`} className="text-[0.9rem] text-gray-700">{text}</li>)
                    }
               </ul>
          </section>
     )
}