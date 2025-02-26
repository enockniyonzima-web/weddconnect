import Link from "next/link"

export const AdminPageNavigation = ({links}:{links: {name:string, dest:string}[]}) => {
     return (
          <nav className="w-full flex flex-nowrap items-center justify-start gap-[10px] overflow-auto hide-scroll">
               {
                    links.map((link, index) => <Link className="text-[0.9rem] text-gray-700 hover:text-blue-600" key={index} href={link.dest}>{link.name}</Link>)
               }
          </nav>
     )   
}