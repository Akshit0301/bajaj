const axios = require('axios');

const URL = 'http://localhost:3000/bfhl';

async function test(name, data) {
    try {
        console.log(`\n--- Testing ${name} ---`);
        console.log('Input:', JSON.stringify(data));
        const res = await axios.post(URL, data);
        console.log('Output:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) console.error('Response:', err.response.data);
    }
}

async function run() {
    await test('Fibonacci', { fibonacci: 8 });
    await test('Prime', { prime: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] });
    await test('HCF', { hcf: [10, 20, 30] });
    await test('LCM', { lcm: [10, 20, 30] });
    await test('AI (Gemini 2.5 Flash)', { AI: "What is the capital of India? One word answer." });
}

run();
