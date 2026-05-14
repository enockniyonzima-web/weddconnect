import { FaEdit } from "react-icons/fa"
import { AdminForm } from "./AdminForm"
import { TAdminSelect } from "./UsersContainer"

export const AdminsTable = ({admins}: {admins:TAdminSelect[]}) => {
     return(
          <table className="min-w-full w-auto border-collapse">
               <thead>
                    <tr className="bg-gray-800 text-left text-gray-300">
                         <th className="p-3 text-blue-400">No</th>
                         <th className="p-3 text-blue-400">Name</th>
                         <th className="p-3 text-blue-400">Email</th>
                         <th className="p-3 text-blue-400">Role</th>
                         <th className="p-3 text-blue-400">Actions</th>
                    </tr>
               </thead>
               <tbody>
                    {
                         admins.map(a => 
                              <tr className="border-b border-gray-800 hover:bg-gray-800/50" key={`admin-${a.id}`}>
                                   <td className="p-3 text-gray-400">{a.id + 1}</td>
                                   <td className="p-3 text-gray-300">{a.name}</td>
                                   <td className="p-3 text-gray-400">{a.user.email}</td>
                                   <td className="p-3 text-gray-400">{a.type}</td>
                                   <td className="p-3 text-gray-400"><AdminForm icon={<FaEdit /> } className="text-[18px] cursor-pointer text-orange-500 hover:text-blue-400" id={a.id} /></td>
                              </tr>
                         )
                    }
               </tbody>
          </table>
     )
}