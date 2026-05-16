"use client";

import Link from 'next/link'
import { IconType } from 'react-icons'
import { BsPeopleFill } from 'react-icons/bs'
import { FaCalendarCheck, FaFacebook, FaInstagram, FaSquareXTwitter } from 'react-icons/fa6'
import { MdCall, MdEmail, MdMonochromePhotos } from 'react-icons/md'
const Logo = "/logo/white-logo.png";
import { FaQuestionCircle, FaWhatsappSquare } from 'react-icons/fa'
import { BiSupport } from 'react-icons/bi'
import Image from '../ui/Image'
import { motion } from 'motion/react'

const Footer = () => {
     const quickLinks = [
          { name: 'Home', dest: '/' },
          { name: 'About Us', dest: '/about' },
          { name: 'Services', dest: '/services' },
          { name: 'Get Started', dest: '/auth/sign-up' }
     ]
     const supportLinks = [
          { name: "Help Center", dest: '/help-center', icon: BiSupport },
          { name: "FAQS", dest: '/faqs', icon: FaQuestionCircle },
          { name: 'Message Us', dest: 'https://wa.me/+250788399021', icon: FaWhatsappSquare },
          { name: 'Call Us', dest: 'tel:+250788399021', icon: MdCall },
          { name: 'Email Us', dest: 'mailto:enockniyonzima0@gmail.com', icon: MdEmail },
     ]
     const servicesLinks = [
          { name: "Wedding Consulting", dest: '/services#wedding-consulting', icon: FaCalendarCheck },
          { name: "Vendor Connection", dest: '/services#vendor-connection', icon: MdMonochromePhotos },
          { name: "Marketing", dest: '/services#marketing', icon: BsPeopleFill }
     ]

     return (
          <footer className="w-full bg-black border-t border-gray-900">
               <div className="w-full max-w-[1512px] mx-auto px-[5%] py-14 flex flex-col gap-12">
                    {/* Top row */}
                    <motion.div
                         className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                         initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true, amount: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                         {/* Logo + tagline */}
                         <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-3">
                                   <Image src={Logo} placeholder="blur" width={100} height={100} alt="WeddConnect" className="w-[44px] aspect-auto" />
                                   <span className="text-xl font-bold text-white">WeddConnect</span>
                              </div>
                              <p className="text-sm text-gray-500 max-w-xs">Rwanda&apos;s premier platform for wedding venues and trusted vendors.</p>
                         </div>
                         {/* Socials */}
                         <div className="flex items-center gap-4">
                              {[
                                   { href: 'https://www.instagram.com/weddconnect_rw', Icon: FaInstagram },
                                   { href: '/', Icon: FaFacebook },
                                   { href: '/', Icon: FaSquareXTwitter },
                              ].map(({ href, Icon }, i) => (
                                   <motion.div key={i} whileHover={{ scale: 1.15 }} transition={{ duration: 0.2 }}>
                                        <Link href={href} target="_blank" className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-800 bg-gray-900 text-gray-400 hover:text-blue-400 hover:border-blue-600/40 transition-colors duration-200">
                                             <Icon size={16} />
                                        </Link>
                                   </motion.div>
                              ))}
                         </div>
                    </motion.div>

                    <div className="w-full h-px bg-gray-900" />

                    {/* Links grid */}
                    <motion.div
                         className="w-full grid grid-cols-2 md:grid-cols-3 gap-10"
                         initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true, amount: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    >
                         <FooterLinks links={quickLinks} title="Quick Links" />
                         <FooterLinks links={servicesLinks} title="Our Services" />
                         <FooterLinks links={supportLinks} title="Support" />
                    </motion.div>

                    <div className="w-full h-px bg-gray-900" />

                    {/* Bottom bar */}
                    <motion.div
                         className="w-full flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600"
                         initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                         viewport={{ once: true, amount: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                    >
                         <p>Powered by <span className="text-gray-400">Desc Softlab Ltd</span></p>
                         <p>&copy; 2025 WeddConnect. All rights reserved.</p>
                         <div className="flex items-center gap-4">
                              <FooterLink link={{ name: "Terms", dest: "/legal/terms" }} />
                              <FooterLink link={{ name: "Privacy Policy", dest: "/legal/privacy-policy" }} />
                         </div>
                    </motion.div>
               </div>
          </footer>
     )
}

const FooterLink = ({ link }: { link: { name: string; dest: string; icon?: IconType } }) => {
     const Icon = link.icon;
     return (
          <Link
               href={link.dest}
               className="text-gray-500 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
          >
               {Icon && <i className="text-[16px] text-gray-600 group-hover:text-blue-500 transition-colors duration-200"><Icon /></i>}
               {link.name}
          </Link>
     );
}

const FooterLinks = ({ title, links }: { title: string; links: { name: string; dest: string; icon?: IconType }[] }) => (
     <div className="flex flex-col gap-4 w-full">
          <h3 className="text-sm font-semibold text-white uppercase tracking-widest">{title}</h3>
          <div className="flex flex-col gap-3">
               {links.map((link, index) => <FooterLink key={`${title}-${index}`} link={link} />)}
          </div>
     </div>
)

export default Footer