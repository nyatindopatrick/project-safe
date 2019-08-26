require ('dotenv').config();

dbPassword = process.env.API_KEY;

module.exports = {
    mongoURI: dbPassword
};
