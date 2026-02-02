// import { PermissionsContainer } from "./[components]/permission/PermissionsContainer";
// import { RolesContainer } from "./[components]/role/RolesContainer";
import { UsersContainer } from "./[components]/UsersContainer";
import { HeroSection } from "./sections";

export default async  function AdminUsersPage () {
     return (
          <div className="w-full h-full flex flex-col items-center gap-4 justify-start bg-gray-50 rounded-xl p-2 lg:p-4">
               <HeroSection />
               <UsersContainer />
          </div>
     )
}