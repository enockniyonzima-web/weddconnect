import { FaEdit } from "react-icons/fa"
import { PermissionForm } from "./PermissionForm"
import { TPermissionSelect } from "./PermissionsContainer"


export const PermissionsTable = ({Permissions}: {Permissions:TPermissionSelect[]}) => {
     return(
          <table className="min-w-full w-auto border-collapse">
               <thead>
                    <tr className="bg-gray-100 text-left text-gray-600">
                         <th className="p-3 text-blue-800">No</th>
                         <th className="p-3 text-blue-800">Name</th>
                         <th className="p-3 text-blue-800">Description</th>
                         <th className="p-3 text-blue-800">Actions</th>
                    </tr>
               </thead>
               <tbody>
                    {
                         Permissions.map(p => 
                              <tr className="border-b hover:bg-gray-50 group" key={`Permission-${p.id}`}>
                                   <td className="p-3 text-gray-600">{p.id + 1}</td>
                                   <td className="p-3 text-gray-600">{p.name}</td>
                                   <td className="p-3 text-gray-600 "><p className="text-[0.9rem] line-clamp-2 group-hover:line-clamp-none">{p.description}</p></td>
                                   <td className="p-3 text-gray-600"><PermissionForm icon={<FaEdit /> } className="text-[18px] cursor-pointer text-orange-600 hover:text-blue-800" id={p.id} /></td>
                              </tr>
                         )
                    }
               </tbody>
          </table>
     )
}