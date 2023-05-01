import {
  LocalNotifications,
  LocalNotificationSchema,
} from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";
import { isMobile } from "./device.service";
class Notification {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
    this.requestPermission();
  }

  private async requestPermission() {
    if (Capacitor.getPlatform() !== "web") {
      await LocalNotifications.requestPermissions();
    }
  }

  notifTrigger(payload: LocalNotificationSchema) {
    isMobile ? this.notifyMobile(payload) : this.notify(payload);
  }

  private notifyMobile(payload: LocalNotificationSchema) {
    LocalNotifications.schedule({
      notifications: [
        {
          title: payload.title,
          body: payload.body,
          id: 1,
        },
      ],
    });
  }
  private notify(payload: LocalNotificationSchema) {
    LocalNotifications.schedule({
      notifications: [
        {
          title: payload.title,
          body: payload.body,
          id: payload.id,
        },
      ],
    });
  }
}

export { Notification };
