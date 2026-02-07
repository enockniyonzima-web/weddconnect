import { ReactNode } from "react"
import { Users, TrendingUp, Calendar, UserX } from "lucide-react"


export const HeroSection = () => {

     return (
          <div className="w-full flex flex-col items-center justify-start gap-[10px]">
               <h1 className="text-[1.6rem] text-black font-bold w-full text-start leading-3">Clients</h1>
               <div className="w-full flex items-end justify-between">
                    <p className="text-[0.9rem] text-gray-600">Manage your platform viewers and subscriptions</p>
                </div>
          </div>
     )
}

export const ClientPageHeroSection = ({
     title, 
     description, 
     actionBtn,
     stats
}:{
     title: string, 
     description?: string, 
     actionBtn?: ReactNode,
     stats?: {
          total: number;
          label: string;
     }
}) =>  {
     // Determine icon and color based on title
     const getIconAndColor = () => {
          const titleLower = title.toLowerCase();
          
          if (titleLower.includes('active')) {
               return {
                    icon: Users,
                    gradient: 'from-green-500 to-green-600',
                    bgGradient: 'from-green-50 to-emerald-50',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600',
                    accentColor: 'border-green-200'
               };
          } else if (titleLower.includes('expired')) {
               return {
                    icon: Calendar,
                    gradient: 'from-red-500 to-red-600',
                    bgGradient: 'from-red-50 to-rose-50',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    accentColor: 'border-red-200'
               };
          } else if (titleLower.includes('pending')) {
               return {
                    icon: TrendingUp,
                    gradient: 'from-amber-500 to-orange-600',
                    bgGradient: 'from-amber-50 to-orange-50',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    accentColor: 'border-amber-200'
               };
          } else if (titleLower.includes('no subscription')) {
               return {
                    icon: UserX,
                    gradient: 'from-gray-500 to-gray-600',
                    bgGradient: 'from-gray-50 to-slate-50',
                    iconBg: 'bg-gray-100',
                    iconColor: 'text-gray-600',
                    accentColor: 'border-gray-200'
               };
          } else {
               // Default blue theme
               return {
                    icon: Users,
                    gradient: 'from-blue-500 to-blue-600',
                    bgGradient: 'from-blue-50 to-indigo-50',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    accentColor: 'border-blue-200'
               };
          }
     };

     const { icon: Icon, gradient, bgGradient, iconBg, iconColor, accentColor } = getIconAndColor();

     return (
          <div className={`w-full bg-gradient-to-r ${bgGradient} rounded-xl border ${accentColor} p-6 md:p-8 shadow-sm`}>
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* Left Section - Title & Description */}
                    <div className="flex items-start gap-4 flex-1">
                         {/* Icon */}
                         <div className={`${iconBg} p-3 rounded-xl shadow-sm flex-shrink-0`}>
                              <Icon className={`w-8 h-8 ${iconColor}`} />
                         </div>

                         {/* Text Content */}
                         <div className="flex-1 min-w-0">
                              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                   {title}
                              </h1>
                              {description && (
                                   <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                        {description}
                                   </p>
                              )}
                         </div>
                    </div>

                    {/* Right Section - Stats & Action */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                         {/* Stats Card */}
                         {stats && (
                              <div className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-200 text-center min-w-[140px]">
                                   <p className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                                        {stats.total}
                                   </p>
                                   <p className="text-xs md:text-sm text-gray-600 mt-1 font-medium">
                                        {stats.label}
                                   </p>
                              </div>
                         )}

                         {/* Action Button */}
                         {actionBtn && (
                              <div className="flex items-center">
                                   {actionBtn}
                              </div>
                         )}
                    </div>
               </div>
          </div>
     )
}
