const { createStrapi } = require("@strapi/strapi");
const fs = require("fs");

let app;

async function setupStrapi() {
  if (!app) {
    app = createStrapi();
    await app.load();
    await app.server.mount();
  }
  return app;
}

async function cleanupStrapi() {
  const dbSettings = app.config.get("database.connection");
  await app.server.httpServer.close();
  await app.db.connection.destroy();
  if (dbSettings && dbSettings.connection && dbSettings.connection.filename) {
    const tmpDbFile = dbSettings.connection.filename;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
}

module.exports = { setupStrapi, cleanupStrapi };
