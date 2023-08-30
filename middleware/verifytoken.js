const jwt = require("jsonwebtoken");
const response = require('../utils/resonses');
require("dotenv").config();

const tokenVerification = (req, res, next) => {
  let tok;
  const auth = req.headers['x-access-token'];
  if (!auth) {
    response.onError.message = "Access Token Required";
    res.status(400);
    res.send(response.onError);
  } else {
    //tok = auth.split(" ")[1];
    jwt.verify(auth, process.env.TOKEN_SECRET_CODE, (error, payload) => {
      if (error) {
        response.onError.message = "Access Token Expired Or Invalid";
        res.status(401)
        res.send(response.onError);
      } else {
        req.loggedInUser = payload;
        next();
      }
    });
  }
};

module.exports = tokenVerification;