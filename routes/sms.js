const dotenv = require("dotenv");
dotenv.config();
const { Sms, Rider, Sacco } = require("../models/user");
function mytime() {
  const date = new Date();
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const seconds = date.getSeconds();
  return `${day}/${month}/${year}  ${hour}:${minute}:${seconds}`;
}
module.exports = router => {
  // route api/sms --> VERB post
  router.post("/sms", (req, res) => {
    let { from, text } = req.body;
    let phoneNumber = from;
    const time = mytime();
    const credentials = {
      apiKey: process.env.AT_KEY,
      username: "loopedin",
      shortcode: "22384"
    };
    console.log(credentials);

    // Initialize the SDK
    const AfricasTalking = require("africastalking")(credentials);

    // Get the SMS service
    const sms = AfricasTalking.SMS;

    function sendMessage(client_phone_number, sms_message) {
      const options = {
        // Set the numbers you want to send to in international format
        to: client_phone_number,
        // Set your message
        message: sms_message,
        // Set your shortCode or senderId
        from: "LakeHub"
      };

      sms
        .send(options)
        .then(console.log)
        .catch(console.log);
    }

    let client_phone_number = phoneNumber;
    let sms_message;

    console.log(`sms received`);
    Rider.findOne({ numberPlate: text.substring(8).trim() })
      .exec()
      .then(result => {
        const saccoId = result.sacco;
        Sacco.findOne(saccoId)
          .then(sacco => {
            if (result && result.status === "Active") {
              let rider = result;
              try {
                console.log(saccoId);
              } catch (error) {
                res.json({ message: `Invalid sacco id ${error}` });
              }
              if (result.numberPlate.includes("KM")) {
                sms_message =
                  `Name: ${rider.riderFname} ${rider.riderSurName} ${rider.riderLname}\n` +
                  `Plate Number: ${rider.numberPlate}\n` +
                  `sacco: ${rider.mysacco}\n` +
                  `Sacco Leader: ${sacco.saccoLeaderFname} ${sacco.saccoLeaderLname}\n` +
                  `Motorbike Make: ${rider.motorBikeMake}\n` +
                  `Sacco Code: ${sacco.uniqueSaccoCode}\n` +
                  `Motorbike Owner: ${rider.bikeOwnerFname} ${rider.bikeOwnerLname}\n` +
                  `Rider's Contact:${rider.riderTelNumber}\n` +
                  `Sacco Contact: ${sacco.telephone_number}`;

                sendMessage(client_phone_number, sms_message);
              } else {
                sms_message =
                  `Name: ${rider.riderFname} ${rider.riderSurName} ${rider.riderLname}\n` +
                  `Plate Number: ${rider.numberPlate}\n` +
                  `sacco: ${rider.mysacco}\n` +
                  `Sacco Leader: ${sacco.saccoLeaderFname} ${sacco.saccoLeaderLname}\n` +
                  `TukTuk Make: ${rider.motorBikeMake}\n` +
                  `Sacco Code: ${sacco.uniqueSaccoCode}\n` +
                  `TukTuk Owner: ${rider.bikeOwnerFname} ${rider.bikeOwnerLname}\n` +
                  `Driver's Contact:${rider.riderTelNumber}\n` +
                  `Sacco Contact: ${sacco.telephone_number}`;

                sendMessage(client_phone_number, sms_message);
              }
            } else {
              sms_message = `This rider cannot be verified.`;
              sendMessage(client_phone_number, sms_message);
            }
          })
          .catch(err => {
            res.status(500).send({ message: `internal server error:${err}` });
            sms_message = `Nothing to send`;
            console.log("unable to send SMS - exception");
          });
      });

    res.status(200).send("OK");
    const txt = text.substring(8).trim();
    const rider = result._id;
    const sacco = saccoId;
    const saveText = new Sms({
      txt,
      from,
      time,
      sacco,
      rider
    });
    saveText
      .save()
      .then(logs => {
        res.status(200);
        console.log(logs);
      })
      .catch(err => console.log(err));
  });
};
