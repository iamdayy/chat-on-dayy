import { Device } from "@capacitor/device";
export let isMobile = false;
export const DeviceInfo = async () => {
  const platform = (await Device.getInfo()).platform;
  if (platform === "android") {
    isMobile = true;
  }
};
