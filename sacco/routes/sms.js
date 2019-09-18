const Router = require("express").Router();
require ('dotenv').config();
const {Sms, Rider, Sacco} = require('../models/user')
function mytime(){
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate()
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const seconds = date.getSeconds();
    return `${day}/${month}/${year}  ${hour}:${minute}:${seconds}`
}
// route api/sms --> VERB post
  Router.post("/", (req, res) => {
    let { from, text } = req.body;
    let phoneNumber = from;
    const time = mytime();
    const credentials = {
      apiKey: AT_KEY,
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
    Rider.findOne({ numberPlate: text })
      .exec()
      .then(result => {
        if (result) {
          let rider = result;
          let saccoId;
          try {
            saccoId = result.sacco;
            console.log(saccoId);
          } catch (error) {
            res.json({ message: `Invalid sacco id ${error}` });
          }
  
          sms_message = `
              Name: ${rider.riderFname} ${rider.riderSurName} ${rider.riderLname},
              Plate Number: ${rider.numberPlate},
              sacco: ,
              Sacco Leader:  ,
              Motorbike Make: ${rider.motorBikeMake},
              Sacco Code:,
              Motorbike Owner: ${rider.bikeOwnerFname} ${rider.bikeOwnerLname},
              Rider's Contact:${rider.riderTelNumber},
              Sacco Contact:`;
  
          sendMessage(client_phone_number, sms_message);
        } else {
          sms_message = `The rider is not registered.`;
          sendMessage(client_phone_number, sms_message);
        }
      })
      .catch(err => {
        res.status(500).send({ message: `internal server error:${err}` });
        sms_message = `Nothing to send`;
        console.log("unable to send SMS - exception");
      });
    res.status(200).send("OK");
      const saveText = new Sms({
          text,
          from,
          time
      })
      saveText.save()
      .then(logs => {
        res.status(200)
        console.log(logs)
      })
      .catch(err => console.log(err));
  });

  module.exports = Router;
  