import { io } from "socket.io-client";

// export const socket = io("http://localhost:3000", {
//   autoConnect: false,
// });

// export const socket = io("/", {
//   autoConnect: false,
// });
export const socket = io("https://chat-on-dayy.fly.dev", {
  autoConnect: false,
});

export default socket;
