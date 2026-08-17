self.addEventListener("install", () => {
  console.log("[notification-sw] installed");
});

self.addEventListener("activate", (event) => {
  console.log("[notification-sw] activated");

  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url ?? "/",
    self.location.origin,
  ).href;

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        const existingClient = windowClients.find((client) => {
          return client.url === targetUrl;
        });

        if (existingClient) {
          return existingClient.focus();
        }

        return self.clients.openWindow(targetUrl);
      }),
  );
});
