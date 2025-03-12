import { TVendorContact } from "@/common/Entities"
import { getContactIcon } from "@/components/icons/icons-list"
import Link from "next/link";

export const VendorContactCard  = ({contact}:{contact: TVendorContact}) => {
     const name = contact.contactType.name.toLowerCase();
     const type = contact.contactType.type;
     const Icon  = getContactIcon(name);
     const title = name === 'phone' ? 'Call us' : name === 'email' ? 'Email us': name === 'whatsapp' ? 'Message Us' : contact.contactType.name 
     return (
          <Link href={ type === 'phone' ? `tel:${contact.value}`: type === 'email' ? `mailto:${contact.value}` :contact.value  } target="_blank" className="text-[0.9rem] text-gray-800 w-full flex items-center justify-center gap-[5px] rounded-[5px] py-[5px] border border-gray-400 hover:bg-gray-100 transition-all duration-200">
               {Icon ? <i className="text-gray-600 text-[20px]"><Icon /></i> : null}
               <span>{title}</span>
          </Link>
     )
}

export const PostCardVendorContacts = ({contacts}:{contacts: TVendorContact[]}) => {
     return (
          <div className="w-auto absolute left-[2.5px] bottom-[2.5px]  flex items-center gap-[3px]">
               {
                    contacts.map(c => {
                         const Icon = getContactIcon(c.contactType.name);
                         const type = c.contactType.type;

                         if(Icon === null) return null;
                         return <Link href={ type === 'phone' ? `tel:${c.value}`: type === 'email' ? `mailto:${c.value}` : c.value  } target="_blank" key={`post-card-vendor-contact-icon-${c.id}`} className="text-[18px] text-white rounded-[5px] p-[3px] bg-black/80 hover:scale-110 transition-all duration-200"><Icon /></Link>})
               }
          </div>
     )
}