"use client";

import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { IconType } from "react-icons";

const UPLOAD_PRESET = "weddconnect-preset";

interface FileUploadButtonProps {
    btnName: { name: string; icon?: IconType };
    action: (res: string[]) => void; // Callback to handle uploaded files
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({ btnName, action }) => {
    return (
        <CldUploadWidget
               uploadPreset={UPLOAD_PRESET}
               options={{
                    multiple: true,
                    sources: ["local", "camera", "url"],
                    maxFiles: 10,
                    folder: "uploads",
               }}
               onUpload={(result: CloudinaryUploadWidgetResults) => {
                if (result.event === "success") {
                    const uploadedUrls = result.info ? [String(result.info)] : [];
                    action(uploadedUrls);
                }
            }}
        >
            {({ open }) => (
                <button
                    type="button"
                    onClick={() => open()}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-800"
                >
                    {btnName.icon && <btnName.icon className="text-lg" />}
                    {btnName.name}
                </button>
            )}
        </CldUploadWidget>
    );
};

