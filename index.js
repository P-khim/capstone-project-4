import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
// https://github.com/15Dkatz/official_joke_api
const app = express();
const port = 3000;
let setups;
let punchlines;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const activepage = "active-page";
const laughing = "/images/laugh.gif";

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://official-joke-api.appspot.com/jokes/random"
    );
    setups = response.data.setup;
    punchlines = response.data.punchline;
    res.render("index.ejs", {
      setup: response.data.setup,
      onhome: activepage,
    });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.get("/filter", async (req, res) => {
  const filterby = req.query.inputType;
  // console.log(filterby);
  try {
    const response = await axios.get(
      `https://official-joke-api.appspot.com/jokes/${filterby}/random`
    );
    // console.log(response);
    setups = response.data[0].setup;
    // console.log(setups);
    punchlines = response.data[0].punchline;
    // console.log(punchlines);

    res.render("index.ejs", {
      setup: setups,
      onhome: activepage,
    });
  } catch (error) {
    res.render("index.ejs", { content: `There is no ${filterby} type;` });
  }
});

app.post("/get-answer", async (req, res) => {
  try {
    res.render("index.ejs", {
      setup: setups,
      punchline: punchlines,
      onhome: activepage,
      laughgif: laughing,
    });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.get("/submit-joke", (req, res) => {
  res.render("submit.ejs", { onsubmit: activepage });
});

app.listen(port, () => {
  console.log(`Sever is running on port ${port}`);
});
