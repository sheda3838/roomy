"use client";

import { Toaster } from "sonner";

export default function RoomyToastProvider() {
  return (
    <Toaster 
      position="top-center" 
      duration={5000}
      toastOptions={{
        // Global styles applied to the wrapper of custom toasts as well
        // We set unstyled={true} on the Toaster if we want fully custom, but it's easier to just pass the raw components to toast.custom()
      }}
    />
  );
}
