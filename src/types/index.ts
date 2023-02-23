export interface user {
  requestFreind: user[];
  email: string;
  avatar: string;
  hasNewMessages: boolean;
  userID: string;
  _id: string;
  username: string;
  self: boolean;
  connected: boolean;
  freinds: user[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-undef
  messages: Array<message>;
}
export interface message {
  content: string;
  from: string;
  to: string;
}

export interface toast {
  visible: boolean;
  color: string;
  title: string;
}
export interface notifications {
  title: string;
  body: string;
  id: number;
}
