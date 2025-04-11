import { FaEdit } from "react-icons/fa"
import { AdminForm } from "./AdminForm"
import { TAdminSelect } from "./UsersContainer"

export const AdminsTable = ({admins}: {admins:TAdminSelect[]}) => {
     return(
          <table className="min-w-full w-auto border-collapse">
               <thead>
                    <tr className="bg-gray-100 text-left text-gray-600">
                         <th className="p-3 text-blue-800">No</th>
                         <th className="p-3 text-blue-800">Name</th>
                         <th className="p-3 text-blue-800">Email</th>
                         <th className="p-3 text-blue-800">Role</th>
                         <th className="p-3 text-blue-800">Actions</th>
                    </tr>
               </thead>
               <tbody>
                    {
                         admins.map(a => 
                              <tr className="border-b hover:bg-gray-50" key={`admin-${a.id}`}>
                                   <td className="p-3 text-gray-600">{a.id + 1}</td>
                                   <td className="p-3 text-gray-600">{a.name}</td>
                                   <td className="p-3 text-gray-600">{a.user.email}</td>
                                   <td className="p-3 text-gray-600">{a.role.name}</td>
                                   <td className="p-3 text-gray-600"><AdminForm icon={<FaEdit /> } className="text-[18px] cursor-pointer text-orange-600 hover:text-blue-800" id={a.id} /></td>
                              </tr>
                         )
                    }
               </tbody>
          </table>
     )
}