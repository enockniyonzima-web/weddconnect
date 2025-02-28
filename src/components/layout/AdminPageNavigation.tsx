import Link from "next/link"

export const AdminPageNavigation = ({links}:{links: {name:string, dest:string}[]}) => {
     return (
          <nav className="w-full flex flex-nowrap items-center justify-start gap-[10px] overflow-auto hide-scroll">
               {
                    links.map((link, index) => <Link className="text-[0.8rem] text-gray-700 hover:text-blue-600 border border-gray-200 rounded-[50px] py-[5px] px-[10px] " key={index} href={link.dest}>{link.name}</Link>)
               }
          </nav>
     )   
}