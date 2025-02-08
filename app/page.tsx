"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import  { Toaster } from "react-hot-toast";
import animationUpload from "@/public/lottie/upload-pdf.json";

// Dynamically import components that require browser APIs
const FilePond = dynamic(() => import("react-filepond").then(mod => mod.FilePond), {
  ssr: false
});

const LottieAnimation = dynamic(() => import("lottie-react"), {
  ssr: false
});

export default function FileUpload() {
  const [fileResponse, setFileResponse] = useState(null);

  // const uploadOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationUpload,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  // const Notify = (status: string, message: string) => {
  //   toast.dismiss();
  //   if (status === "success") {
  //     toast.success(message);
  //   } else {
  //     toast.error(message);
  //   }
  // };

  return (
    <div>
      <Toaster />
      <div style={{ width: '300px', margin: '0 auto' }}>
        <LottieAnimation
          animationData={animationUpload}
          loop={true}
          autoplay={true}
        />
      </div>
      <FilePond
        server={{
          process: {
            url: "/api/upload",
            method: "POST",
            withCredentials: false,
            onload: (response) => {
              // parse the json response
              const fileResponse = JSON.parse(response);
              setFileResponse(fileResponse);
              return response; // Return the response to FilePond
            },
            onerror: (response) => {
              return response; // Return the error to FilePond
            },
          },
          fetch: null,
          revert: null,
        }}
      />

      <div>
        {fileResponse ? (
          <div className="p-5">
            <h1 className="font-black text-xl">Text from the Pdf :-</h1>
            {/* @ts-expect-error - This is needed because it giving parsedText is not found on type never */}
            <pre className="text-wrap p-5">{fileResponse.parsedText}</pre>
          </div>
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center">
            <h2 className="font-bold mt-10">Upload a file to chat</h2>
            <p>Supported file types: PDF</p>
          </div>
        )}
      </div>
    </div>
  );
}
