require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors());

const { AuthRoute, ProfileRoute, HomeRoute, DietRoute, FavouriteRoute } = require("./routes/index");

app.use(AuthRoute);
app.use(ProfileRoute);
app.use(HomeRoute);
app.use(DietRoute);
app.use(FavouriteRoute);

app.get("/", (req, res) => {
  res.send("hello node");
});

app.listen(process.env.APP_PORT, () => {
  console.log(
    `Server Running at http://localhost:${process.env.APP_PORT} 🚀 🚀`
  );
});
