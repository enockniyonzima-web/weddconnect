import { FaEdit } from "react-icons/fa"
import { TRoleSelect } from "./RolesContainer"
import { RoleForm } from "./RoleForm"


export const RolesTable = ({roles}: {roles:TRoleSelect[]}) => {
     return(
          <table className="min-w-full w-auto border-collapse">
               <thead>
                    <tr className="bg-gray-100 text-left text-gray-600">
                         <th className="p-3 text-blue-800">No</th>
                         <th className="p-3 text-blue-800">Name</th>
                         <th className="p-3 text-blue-800">Permissions</th>
                         <th className="p-3 text-blue-800">Actions</th>
                    </tr>
               </thead>
               <tbody>
                    {
                         roles.map(r => 
                              <tr className="border-b hover:bg-gray-50" key={`Role-${r.id}`}>
                                   <td className="p-3 text-gray-600">{r.id + 1}</td>
                                   <td className="p-3 text-gray-600">{r.name}</td>
                                   <td className="p-3 text-gray-600">{r.permissions.map(p => <span key={`role-${r.id}-${p.id}-${p.name}`}>{p.name}</span>)}</td>
                                   <td className="p-3 text-gray-600"><RoleForm icon={<FaEdit /> } className="text-[18px] cursor-pointer text-orange-600 hover:text-blue-800" id={r.id} /></td>
                              </tr>
                         )
                    }
               </tbody>
          </table>
     )
}