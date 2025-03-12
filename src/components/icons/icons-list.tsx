import { IconType } from "react-icons";
import { FaCar, FaHouseUser, FaInstagram, FaLanguage, FaPhone, FaWhatsapp } from "react-icons/fa6";
import { GiLargeDress } from "react-icons/gi";
import { MdOutlineMailOutline, MdPeople, MdPhotoCameraFront } from "react-icons/md";
import { RiSettingsLine } from "react-icons/ri";

export const IconsList:Array<{key:string, icon:IconType, label:string}> = [
     {key: 'MdPeople', icon:MdPeople, label: "People"},
     {key: 'FaCar', icon: FaCar, label: 'Parking'},
     {key: 'FaHouseUser', icon:FaHouseUser, label:'House'},
     {key: 'MdPhotoCameraFront', icon:MdPhotoCameraFront, label:'Camera'},
     {key: 'FaLanguage', icon:FaLanguage, label: 'Language'},
     {key: "GiLargeDress", icon: GiLargeDress, label:'Dress'}
]    

export const findIconByKey = (key:string): IconType | null => {
     const icon = IconsList.find(icon => icon.key === key);
     return icon ? icon.icon : RiSettingsLine;
}

export const getContactIcon = (name:string): IconType | null => {
     switch(name.toLowerCase()) {
          case 'instagram':
               return FaInstagram;
          case 'phone':
               return FaPhone;
          case 'whatsapp': 
               return FaWhatsapp;
          case 'email':
               return MdOutlineMailOutline;
          default: return null;
     }
}