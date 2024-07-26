const { contactUsEmail } = require("../mail/templates/contactFormRes")             //contactUsEmail is the format/style of email which is send to the user;
const mailSender = require("../utils/mailSender")
const dotenv = require("dotenv");
dotenv.config();

exports.contactUsController = async (req, res) => {

  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body

  try {
    await mailSender( email, "Your Data send successfully", contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode))
    await mailSender( process.env.MAIL_USER , "Someone Send this data to you", contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode))

    return res.json({
      success: true,
      message: "Email send successfully",
    })
  }
   catch (error) {
      return res.json({
        success: false,
        message: "Something went wrong...",
      })
  }
}