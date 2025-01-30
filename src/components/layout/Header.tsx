import Image from 'next/image';
import Logo from '../../../public/logo/logo.png';
import Link from 'next/link';
import { LuAlignRight } from 'react-icons/lu';
const Header = () => {
     return (
          <>
               <MobileView />
               <DesktopView />
          </>
     )
}

const MobileView =() => {
     return (
          <header className="w-full md:hidden flex items-center justify-between px-[2%] py-[5px] sticky top-0 bg-white z-50 ">
               <HeaderLogo/>
               <div className='w-auto relative items-center justify-end'>
                    <i className='text-[32px] text-black cursor-pointer'><LuAlignRight /></i>
               </div>
          </header>
     )
}

const DesktopView =() => {
     return (
          <header className="w-full sticky top-0 z-50 bg-white hidden md:flex items-center justify-between px-[2%] py-[5px] ">
               <HeaderLogo />
               <div className='w-auto flex items-center justify-between gap-[40px]'>
                    <HeaderLink link={{name: "Home", dest: '/'}} />
                    <HeaderLink link={{name: "Services", dest: '/services'}} />
                    <HeaderLink link={{name: "About Us", dest: '/about'}} />
               </div>
               <div className='w-auto flex items-center justify-center gap-[20px]'>
                    <Link className='text-[0.8rem] px-[15px] rounded-[5px] py-[7.5px] border-[1.3px] bg-white text-gray-600 border-gray-400 hover:bg-gray-100 transition-all duration-200' href={'/'}>Sigin</Link>
                    <Link className='text-[0.8rem] px-[15px] rounded-[5px] py-[7.5px] border-[1.3px] bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300' href={'/get-started'}>Get Started</Link>
               </div>
          </header>
     )
}

const HeaderLink = ({link}:{link:{name:string, dest: string}}) => (
     <Link className='text-[0.85rem] font-medium text-gray-600 hover:text-gray-700 transition-all duration-200 group flex items-start flex-col whitespace-nowrap' href={link.dest}>{link.name} <span className='w-0 border-b-[1.5px] border-blue-600 group-hover:w-full transition-all duration-300'></span></Link>
)

const HeaderLogo = () => (
     <div className='w-auto gap-[10px] flex items-end justify-start py-[5px] h-full'>
          <Image src={Logo} alt='wedd connect' width={150} height={150} className='w-[70px] aspect-auto' />
          <h1 className='hidden lg:inline-block text-[1.6rem] font-bold text-black leading-5'>WeddConnect</h1>
     </div>
)
export default Header