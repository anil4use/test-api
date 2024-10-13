var admin = require("firebase-admin");
var serviceAccount = require("../helpers/serviceAccountKey.json");

const serverKey = process.env.SERVERKEY;

const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class firebase {
  async firebaseMessage(title, body, userId, token) {
    const data = {
      to: token,
      notification: {
        body: body,
        title: title,
      },
      data: {
        customData: "custom data",
      },
    };
    const result = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${serverKey}`,
        },
      }
    );
  }
}
module.exports = new firebase();
