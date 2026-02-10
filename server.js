const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const email = process.env.OFFICIAL_EMAIL;

const isPrime = (number) => {
  if (number <= 1) return false;
  for (let i = 2; i <= Math.sqrt(number); i++) if (number % i === 0) return false;
  return true;
};

const getGCD = (num1, num2) => num2 === 0 ? num1 : getGCD(num2, num1 % num2);
const getLCM = (num1, num2) => (num1 * num2) / getGCD(num1, num2);

app.get('/health', (req, res) => {
  res.status(200).json({ is_success: true, official_email: email });
});

app.post('/bfhl', async (req, res) => {
  try {
    const key = Object.keys(req.body)[0];
    const input = req.body[key];
    let resultingData;

    switch (key) {
      case 'fibonacci':
        const n = parseInt(input);
        let f = [0, 1];
        for (let i = 2; i < n; i++) f.push(f[i - 1] + f[i - 2]);
        resultingData = n <= 0 ? [] : n === 1 ? [0] : f;
        break;
      case 'prime':
        resultingData = input.filter(isPrime);
        break;
      case 'lcm':
        resultingData = input.reduce((a, b) => getLCM(a, b));
        break;
      case 'hcf':
        resultingData = input.reduce((a, b) => getGCD(a, b));
        break;
      case 'AI':
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
          const prompt = `Answer the following question in exactly one word only: ${input}`;
          const result = await model.generateContent(prompt);
          const responseText = result.response.text().trim();

          resultingData = responseText.split(' ')[0].replace(/[^\w]/g, '');
        } catch (aiErr) {
          resultingData = "Error";
        }
        break;
      default:
        return res.status(400).json({ is_success: false, message: "Invalid key" });
    }

    res.status(200).json({ is_success: true, official_email: email, data: resultingData });
  } catch (error) {
    res.status(500).json({ is_success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));