import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Server-side Pusher instance
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.PUSHER_CLUSTER || "",
  useTLS: true,
});

// Client-side Pusher instance factory
let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = (): PusherClient => {
  if (typeof window === "undefined") {
    throw new Error("getPusherClient can only be called on the client side.");
  }

  if (!pusherClientInstance) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY || "";
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "";

    pusherClientInstance = new PusherClient(key, {
      cluster,
      forceTLS: true,
      authEndpoint: "/api/pusher/auth",
    });
  }

  return pusherClientInstance;
};
