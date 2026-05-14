import { FaEdit } from "react-icons/fa"
import { PermissionForm } from "./PermissionForm"
import { TPermissionSelect } from "./PermissionsContainer"


export const PermissionsTable = ({Permissions}: {Permissions:TPermissionSelect[]}) => {
     return(
          <table className="min-w-full w-auto border-collapse">
               <thead>
                    <tr className="bg-gray-800 text-left text-gray-300">
                         <th className="p-3 text-blue-400">No</th>
                         <th className="p-3 text-blue-400">Name</th>
                         <th className="p-3 text-blue-400">Description</th>
                         <th className="p-3 text-blue-400">Actions</th>
                    </tr>
               </thead>
               <tbody>
                    {
                         Permissions.map(p => 
                              <tr className="border-b border-gray-800 hover:bg-gray-800/50 group" key={`Permission-${p.id}`}>
                                   <td className="p-3 text-gray-400">{p.id + 1}</td>
                                   <td className="p-3 text-gray-300">{p.name}</td>
                                   <td className="p-3 text-gray-400 "><p className="text-sm line-clamp-2 group-hover:line-clamp-none">{p.description}</p></td>
                                   <td className="p-3 text-gray-400"><PermissionForm icon={<FaEdit /> } className="text-[18px] cursor-pointer text-orange-500 hover:text-blue-400" id={p.id} /></td>
                              </tr>
                         )
                    }
               </tbody>
          </table>
     )
}