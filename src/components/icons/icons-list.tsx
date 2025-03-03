import { IconType } from "react-icons";
import { MdPeople } from "react-icons/md";
import { RiSettingsLine } from "react-icons/ri";

export const IconsList:Array<{key:string, icon:IconType, label:string}> = [
     {key: 'MdPeople', icon:MdPeople, label: "People"},
]    

export const findIconByKey = (key:string): IconType | null => {
     const icon = IconsList.find(icon => icon.key === key);
     return icon ? icon.icon : RiSettingsLine;
}