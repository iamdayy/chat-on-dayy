import { Device } from "@capacitor/device";
export let isMobile = false;
export const DeviceInfo = async () => {
  const info = await Device.getInfo();

  const platform = (await Device.getInfo()).platform;
  if (platform === "android") {
    isMobile = true;
  }
  console.log(info);
};
