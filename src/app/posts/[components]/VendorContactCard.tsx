import { TVendorContact } from "@/common/Entities"
import { getContactIcon } from "@/components/icons/icons-list"
import Link from "next/link";

export const VendorContactCard  = ({contact}:{contact: TVendorContact}) => {
     const name = contact.contactType.name.toLowerCase();
     const type = contact.contactType.type.toLowerCase();
     const Icon  = getContactIcon(name);
     const title = name === 'phone' ? 'Call us' : name === 'email' ? 'Email us': name === 'whatsapp' ? 'Message Us' : contact.contactType.name 
     return (
          <Link href={ type === 'phone' ? `tel:${contact.value}`: type === 'email' ? `mailto:${contact.value}` :contact.value  } target="_blank" className="text-[0.9rem] text-gray-200 w-full flex items-center justify-center gap-[5px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[10px] py-[10px] transition-all duration-200">
               {Icon ? <i className="text-gray-400 text-[18px]"><Icon /></i> : null}
               <span>{title}</span>
          </Link>
     )
}

export const PostCardVendorContacts = ({contacts}:{contacts: TVendorContact[]}) => {
     return (
          <div className="w-auto absolute left-[5px] bottom-[5px]  flex items-center gap-[3px]">
               {
                    contacts.map(c => {
                         const Icon = getContactIcon(c.contactType.name);
                         const type = c.contactType.type.toLowerCase();

                         if(Icon === null) return null;
                         return <Link href={ type === 'phone' ? `tel:${c.value}`: type === 'email' ? `mailto:${c.value}` : c.value  } target="_blank" key={`post-card-vendor-contact-icon-${c.id}`} className="text-[16px] text-gray-200 rounded-[5px] p-[3px] bg-gradient-to-br from-blue-800 to-black hover:scale-110 transition-all duration-200"><Icon /></Link>})
               }
          </div>
     )
}