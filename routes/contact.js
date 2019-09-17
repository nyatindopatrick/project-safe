const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

router.post('/', (req,res)=>{
    sgMail.setApiKey(process.env.SG_KEY);
    const msg = {
        to: ['nyatindopatrick@gmail.com', req.body.email],
        from: 'support@fikasafe.com',
        subject: req.body.subject,
        html: `<strong>Name: ${req.body.name} <br>Email: ${req.body.email}<br>
        <br><br>${req.body.message}</strong>`,
    };
    sgMail.send(msg);
    res.status(200);
    req.flash('success_msg', 'Message sent sucessfully!');
    res.redirect('/')
    console.log("success");
});

module.exports = router;