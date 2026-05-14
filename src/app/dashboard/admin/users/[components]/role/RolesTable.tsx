import { FaEdit } from "react-icons/fa"
import { TRoleSelect } from "./RolesContainer"
import { RoleForm } from "./RoleForm"


export const RolesTable = ({roles}: {roles:TRoleSelect[]}) => {
     return(
          <table className="min-w-full w-auto border-collapse">
               <thead>
                    <tr className="bg-gray-800 text-left text-gray-300">
                         <th className="p-3 text-blue-400">No</th>
                         <th className="p-3 text-blue-400">Name</th>
                         <th className="p-3 text-blue-400">Permissions</th>
                         <th className="p-3 text-blue-400">Actions</th>
                    </tr>
               </thead>
               <tbody>
                    {
                         roles.map(r => 
                              <tr className="border-b border-gray-800 hover:bg-gray-800/50" key={`Role-${r.id}`}>
                                   <td className="p-3 text-gray-400">{r.id + 1}</td>
                                   <td className="p-3 text-gray-300">{r.name}</td>
                                   <td className="p-3 text-gray-400">{r.permissions.map(p => <span key={`role-${r.id}-${p.id}-${p.name}`}>{p.name}</span>)}</td>
                                   <td className="p-3 text-gray-400"><RoleForm icon={<FaEdit /> } className="text-[18px] cursor-pointer text-orange-500 hover:text-blue-400" id={r.id} /></td>
                              </tr>
                         )
                    }
               </tbody>
          </table>
     )
}