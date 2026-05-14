import { ReactNode } from "react"
import { Users, TrendingUp, Calendar, UserX } from "lucide-react"


export const HeroSection = () => {

     return (
          <div className="w-full flex flex-col items-center justify-start gap-[10px]">
               <h1 className="text-2xl text-white font-bold w-full text-start">Clients</h1>
               <div className="w-full flex items-end justify-between">
                    <p className="text-sm text-gray-400">Manage your platform viewers and subscriptions</p>
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
                    bgGradient: 'from-green-950/50 to-emerald-950/50',
                    iconBg: 'bg-green-900/50',
                    iconColor: 'text-green-400',
                    accentColor: 'border-green-800'
               };
          } else if (titleLower.includes('expired')) {
               return {
                    icon: Calendar,
                    gradient: 'from-red-500 to-red-600',
                    bgGradient: 'from-red-950/50 to-rose-950/50',
                    iconBg: 'bg-red-900/50',
                    iconColor: 'text-red-400',
                    accentColor: 'border-red-800'
               };
          } else if (titleLower.includes('pending')) {
               return {
                    icon: TrendingUp,
                    gradient: 'from-amber-500 to-orange-600',
                    bgGradient: 'from-amber-950/50 to-orange-950/50',
                    iconBg: 'bg-amber-900/50',
                    iconColor: 'text-amber-400',
                    accentColor: 'border-amber-800'
               };
          } else if (titleLower.includes('no subscription')) {
               return {
                    icon: UserX,
                    gradient: 'from-gray-500 to-gray-600',
                    bgGradient: 'from-gray-900/50 to-slate-900/50',
                    iconBg: 'bg-gray-800',
                    iconColor: 'text-gray-400',
                    accentColor: 'border-gray-700'
               };
          } else {
               // Default blue theme
               return {
                    icon: Users,
                    gradient: 'from-blue-500 to-blue-600',
                    bgGradient: 'from-blue-950/50 to-indigo-950/50',
                    iconBg: 'bg-blue-900/50',
                    iconColor: 'text-blue-400',
                    accentColor: 'border-blue-800'
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
                              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                   {title}
                              </h1>
                              {description && (
                                   <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                        {description}
                                   </p>
                              )}
                         </div>
                    </div>

                    {/* Right Section - Stats & Action */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                         {/* Stats Card */}
                         {stats && (
                              <div className="bg-gray-900 rounded-xl px-6 py-4 shadow-sm border border-gray-800 text-center min-w-[140px]">
                                   <p className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                                        {stats.total}
                                   </p>
                                   <p className="text-xs md:text-sm text-gray-400 mt-1 font-medium">
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
