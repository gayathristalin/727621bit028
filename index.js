const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 9876;
const WINDOW_SIZE = 10;

const TEST_SERVER_URLS = {
  p: "http://20.244.56.144/test/primes",

  f: "http://20.244.56.144/test/fibo",
  e: "http://20.244.56.144/test/even",
  r: "http://20.244.56.144/test/rand",
};
let numWin = [];
const CalcAvg = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};
const fetchNumbers = async (id) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4OTQ3MTA5LCJpYXQiOjE3MTg5NDY4MDksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijg4NmNlNjJmLWFiYzYtNDk5Ni1iMWFiLWU5NmFlNjM1N2E4MSIsInN1YiI6ImdheWF0aHJpMTYxMDNAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiI4ODZjZTYyZi1hYmM2LTQ5OTYtYjFhYi1lOTZhZTYzNTdhODEiLCJjbGllbnRTZWNyZXQiOiJmR1B4cENvTGNmS3ZwVkJrIiwib3duZXJOYW1lIjoiR2F5YXRocmkiLCJvd25lckVtYWlsIjoiZ2F5YXRocmkxNjEwM0BnbWFpbC5jb20iLCJyb2xsTm8iOiI3Mjc2MjFiaXQwMjgifQ.wDfFCDRvU-QWB6Dw6eouySv4FQB2j0IMM0WlEnuhRsk";
  const axiosConfig = {
    headers: {
      Authorization: ` Bearer ${token}`,
    },
    timeout: 5000,
  };

  try {
    const response = await axios.get(TEST_SERVER_URLS[id], axiosConfig);
    return response.data.numbers || [];
  } catch (error) {
    console.error("error", error.message);
    return [];
  }
};

app.get("/numbers/:id", async (req, res) => {
  const { id } = req.params;
  const validIds = ["p", "f", "e", "r"];

  if (!validIds.includes(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const numbers = await fetchNumbers(id);
  if (numbers.length === 0) {
    return res.status(500).json({ error: "failed to fetch" });
  }
  const uniqueNumbers = Array.from(new Set(numbers));
  const winPrevState = [...numWin];
  uniqueNumbers.forEach((num) => {
    if (!numWin.includes(num)) {
      numWin.push(num);
    }
    if (numWin.length > WINDOW_SIZE) {
      numWin.shift();
    }
  });
  const windCurrState = [...numWin];
  const avg = CalcAvg(windCurrState);

  res.json({
    numbers: uniqueNumbers,
    winPrevState,
    windCurrState,
    avg: avg.toFixed(2),
  });
});

app.listen(PORT, () => {
  console.log("AVG IS RUNNING");
});
