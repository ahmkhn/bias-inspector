"use client";

import { useUploadThing } from "~/utils/uploadthing";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
// inferred input off useUploadThing

interface SimpleUploadButtonProps {

  setFileName: (fileName: string) => void;

  setURL: (url: string) => void;

}

type Input = Parameters<typeof useUploadThing>;


async function deleteFile(url: string){
  try{
    const response = await fetch("/api/uploadthing", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete file");
    }
  }catch(error){
    console.error("Error deleting file", error);
  }
}


const useUploadThingInputProps = (...args: Input) => {
  const $ut = useUploadThing(...args);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const result = await $ut.startUpload(selectedFiles);

    // TODO: persist result in state maybe?

    // delete the file:
    if (result?.[0]?.appUrl) {
      deleteFile(result[0].appUrl);
    }


  };

  return {
    inputProps: {
      onChange,
      multiple: ($ut.routeConfig?.image?.maxFileCount ?? 1) > 1,
      accept: "application/pdf",
    },
    isUploading: $ut.isUploading,
  };
};

function UploadSVG() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
        />
      </svg>
    );
  }
  
  function LoadingSpinnerSVG() {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="black"
      >
        <path
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
          opacity=".25"
        />
        <path
          d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
          className="spinner_ajPY"
        />
      </svg>
    );
  }
  
  export const SimpleUploadButton: React.FC<SimpleUploadButtonProps> = ({ setFileName, setURL }: SimpleUploadButtonProps) => {
    const router = useRouter();
  
    const posthog = usePostHog();
    
    const { inputProps } = useUploadThingInputProps("imageUploader", {
      onUploadBegin() {
        posthog.capture("upload_begin");
        toast(
          <div className="flex items-center gap-2 text-black">
            <LoadingSpinnerSVG /> <span className="text-lg">Uploading...</span>
          </div>,
          {
            duration: 100000,
            id: "upload-begin",
          },
        );
      },
      onUploadError(error) {
        posthog.capture("upload_error", { error });
        toast.dismiss("upload-begin");
        toast.error("Upload failed");
      },
      onClientUploadComplete(result) {
        const uploadedFileName = result?.[0]?.name;
        const fileURL = result?.[0]?.url;
        setFileName(uploadedFileName!);
        setURL(fileURL!);
        toast("Upload complete!");
        toast.dismiss("upload-begin");
        router.refresh();
      },
    });
  
    return (
      <div>
        <label htmlFor="pdf-upload" className="cursor-pointer bg-black">
          <UploadSVG />
        </label>
        <input
          id="pdf-upload"
          type="file"
          className="sr-only bg-black"
          {...inputProps}
        />
      </div>
    );
  }