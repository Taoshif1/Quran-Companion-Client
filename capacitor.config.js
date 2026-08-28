import branding from "./app.config.json" with { type: "json" };

export default {
  appId: branding.appId,
  appName: branding.name,
  webDir: "dist",
};

