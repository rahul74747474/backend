const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/incidents", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.SN_URL}/api/now/table/incident?sysparm_query=active=true`,
      {
        auth: {
          username: process.env.SN_USER,
          password: process.env.SN_PASS,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    // Only send required columns
    const filtered = response.data.result.map((i) => ({
      number: i.number,
      short_description: i.short_description,
    }));

    res.json(filtered);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "ServiceNow API failed",
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running at http://localhost:5000");
});

