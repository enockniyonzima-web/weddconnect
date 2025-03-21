import Image from 'next/image';
// import Logo from '../../../../public/logo/logo.png';
import WhiteLogo from '../../../../public/logo/white-logo.png';
import Link from 'next/link';




export const HeaderLink = ({link, }:{link:{name:string, dest: string}}) => (
     <Link className={`text-[0.85rem] font-medium text-white hover:text-gray-200 transition-all duration-200 group flex items-start flex-col whitespace-nowrap`} href={link.dest}>{link.name} <span className='w-0 border-b-[1.5px] border-blue-600 group-hover:w-full transition-all duration-300'></span></Link>
)

export const HeaderLogo = () => (
     <Link href={'/'} prefetch={true} className='w-auto gap-[10px] flex items-center justify-start py-[5px] h-full'>
          <Image src={WhiteLogo} alt='wedd connect' width={150} height={150} className='w-[70px] aspect-auto' />
          <h1 className={`hidden lg:inline-block text-[1.4rem] font-bold text-white leading-5`}>WeddConnect</h1>
     </Link>
)