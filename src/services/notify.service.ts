import { LocalNotifications } from "@capacitor/local-notifications";
import { notifications } from "@/types";

const notify = async (payload: notifications) => {
  const canSend = await LocalNotifications.requestPermissions();
  //   await LocalNotifications.registerActionTypes({
  //     types: [
  //       {
  //         id: "msgRes",
  //         actions: [
  //           {
  //             id: "dismiss",
  //             title: "Dismiss",
  //             destructive: true,
  //           },
  //           {
  //             id: "open",
  //             title: "Open app",
  //           },
  //           {
  //             id: "respond",
  //             title: "Respond",
  //             input: true,
  //           },
  //         ],
  //       },
  //     ],
  //   });
  if (canSend) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: payload.title,
          body: payload.body,
          id: payload.id,
        },
      ],
    });
  }
};
const notifyMobile = async (payload: notifications) => {
  const canSend = await LocalNotifications.requestPermissions();
  await LocalNotifications.registerActionTypes({
    types: [
      {
        id: "msgRes",
        actions: [
          {
            id: "dismiss",
            title: "Dismiss",
            destructive: true,
          },
          {
            id: "open",
            title: "Open app",
          },
          {
            id: "respond",
            title: "Respond",
            input: true,
          },
        ],
      },
    ],
  });
  if (canSend) {
    await LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (notification) => {
        console.log(notification);
      }
    );
    await LocalNotifications.schedule({
      notifications: [
        {
          title: payload.title,
          body: payload.body,
          id: payload.id,
          actionTypeId: "msgRes",
        },
      ],
    });
  }
};

export { notify, notifyMobile };
