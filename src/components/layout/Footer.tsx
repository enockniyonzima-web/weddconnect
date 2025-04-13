import Link from 'next/link'
import { IconType } from 'react-icons'
import { BsPeopleFill } from 'react-icons/bs'
import { FaCalendarCheck, FaFacebook, FaInstagram, FaSquareXTwitter } from 'react-icons/fa6'
import { MdCall, MdEmail, MdMonochromePhotos } from 'react-icons/md'
import Logo from "../../../public/logo/white-logo.png";
import Image from 'next/image'
import { FaQuestionCircle, FaWhatsappSquare } from 'react-icons/fa'
import { BiSupport } from 'react-icons/bi'

const Footer = () => {
     const quickLinks = [
          {name: 'Home', dest: '/'},
          {name: 'About Us',dest: '/about'},
          {name: 'Services', dest: '/services'},
          {name: 'Get Started', dest: '/auth/sign-up'}
     ]
     const supportLinks = [
          {name: "Help Center", dest:'/help-center', icon: BiSupport},
          {name: "FAQS", dest: '/faqs', icon: FaQuestionCircle},
          {name: 'Message Us', dest: 'https://wa.me/+250784786392', icon: FaWhatsappSquare},
          {name: 'Call Us', dest: 'tel:+250788399021', icon: MdCall},
          {name: 'Email Us', dest: 'mailto:enockniyonzima0@gmail.com', icon: MdEmail},

     ]
     const servicesLinks = [
          {name: "Wedding Consulting", dest:'/services#wedding-consulting', icon: FaCalendarCheck},
          {name: "Vendor Connection", dest:'/services#vendor-connection', icon: MdMonochromePhotos},
          {name: "Marketing", dest:'/services#marketing', icon: BsPeopleFill}
     ]
     return (
          <footer className='w-full px-[2%] py-[20px] flex flex-col gap-[20px] bg-black max-w-[1512px] mx-auto z-10 relative'>
               <div className='w-full flex items-center justify-between'>
                    <FooterLogo />
                    <div className='flex items-center justify-end gap-[20px]'>
                         <Link className='text-[22px] text-gray-400 hover:text-blue-600 cursor-pointer' target='_blank' href={'https://www.instagram.com/weddconnect_rw?igsh=d3ZncHo2MTB0aG41'}><FaInstagram /></Link>
                         <Link className='text-[22px] text-gray-400 hover:text-blue-600 cursor-pointer' target='_blank' href={'/'}><FaFacebook /></Link>
                         <Link className='text-[22px] text-gray-400 hover:text-blue-600 cursor-pointer' target='_blank' href={'/'}><FaSquareXTwitter /></Link>
                    </div>
               </div>
               <div className='w-full border-t-[1.5px] border-gray-900'></div>
               <div className='w-full grid grid-cols-2 md:grid-cols-3 gap-[20px]'>
                    <FooterLinks links={quickLinks} title='Quick Links' />
                    <FooterLinks links={servicesLinks} title='Our Services' />
                    <FooterLinks links={supportLinks} title='Support Links' />
               </div>
               <div className='w-full border-t-[1.5px] border-gray-900'></div>
               <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]'>
                    <p className='w-full text-gray-400 text-[0.95rem] font-medium text-center md:text-start'>Powered by Desc Softlab Ltd</p>
                    <p className='w-full text-gray-400 text-[0.95rem] font-medium text-center md:text-start lg:text-center'>&copy; 2025 WeddConnect. All rights reserved.</p>
                    <div className='w-full flex gap-[10px] items-center justify-center lg:justify-end'>
                         <FooterLink link={{name:"Terms", dest:"/terms"}} />
                         <FooterLink link={{name:"Privacy Policy", dest:"/privacy-policy"}} />
                    </div>
               </div>
          </footer>
     )
}

const FooterLink = ({link}:{link:{name:string, dest:string, icon?: IconType}})=> {
     const Icon = link.icon;
     return (
     <Link 
          href={link.dest}
          className='text-gray-400 text-[0.95rem] font-medium hover:text-gray-200 transition-all duration-200 flex items-center justify-start gap-[5px] group '
     >{Icon && <i className='text-[18px] text-gray-500 group-hover:text-blue-600 duration-200 transition-all'><Icon /></i>} {link.name}</Link>
     );
}

const FooterLinks = ({title,links}:{title:string, links: {name:string, dest:string}[]}) => (
     <div className='flex flex-col gap-[15px] w-full'>
          <h3 className='text-[1.4rem] font-bold text-gray-100'>{title}</h3>
          <div className='flex flex-col items-start gap-[10px] px-[10px]'>
               {links.map((link, index) => <FooterLink key={`${title}-links-${link}-${index}`} link={link} />)}
          </div>
     </div>
)

const FooterLogo = () => (
     <div className='w-auto flex  items-end justify-start gap-[10px]'>
          <Image src={Logo} placeholder='blur' width={100} height={100} alt='wedd connect' className='w-[50px] aspect-auto ' />
          <h2 className='hidden md:inline-block text-[1.6rem] font-bold text-gray-100 leading-5' >WeddConnect</h2>
     </div>
)

export default Footer