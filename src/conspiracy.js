import { loadModel, completion } from '@qvac/sdk';
import http from 'http';

const PORT = process.env.PORT || 29317;

// Listahan ng 10 harmless/silly objects (Input Allow-list para sa safety)
const ALLOWED_OBJECTS = [
  "office stapler",
  "garden gnomes",
  "vending machines",
  "rubber duck",
  "lava lamp",
  "ceiling fan",
  "toaster",
  "traffic cone",
  "shopping cart",
  "fidget spinner"
];

let modelId = null;

async function initModel() {
  console.log("Loading QVAC local model...");
  // I-load ang local model gamit ang QVAC SDK
  modelId = await loadModel({
    model: "llama-3.2-1b"
  });
  console.log("Model loaded successfully!");
}

const server = http.createServer(async (req, res) => {
  // Simple UI HTML Page
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QVAC Conspiracy Generator</title>
        <style>
          body { font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; background: #121212; color: #fff; }
          select, button { padding: 10px; font-size: 16px; margin-top: 10px; width: 100%; }
          button { background: #22c55e; color: #000; font-weight: bold; border: none; cursor: pointer; }
          #output { margin-top: 20px; padding: 15px; background: #1e1e1e; border-radius: 8px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>QVAC Conspiracy Generator</h1>
        <p>Pick a mundane object to reveal an absurd, fictional conspiracy theory (100% Satire).</p>
        
        <label for="objectSelect">Choose an object:</label>
        <select id="objectSelect">
          ${ALLOWED_OBJECTS.map(obj => `<option value="${obj}">${obj}</option>`).join('')}
        </select>
        
        <button id="revealBtn" onclick="generateTheory()">Reveal the Truth</button>
        
        <div id="output">Select an item and click the button...</div>

        <script>
          async function generateTheory() {
            const objectVal = document.getElementById('objectSelect').value;
            const outputDiv = document.getElementById('output');
            outputDiv.innerText = "Generating absurd theory...";

            const response = await fetch('/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ object: objectVal })
            });

            const data = await response.json();
            outputDiv.innerText = data.result;
          }
        </script>
      </body>
      </html>
    `);
    return;
  }

  // API Endpoint para sa pag-generate ng AI output
  if (req.method === 'POST' && req.url === '/generate') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { object } = JSON.parse(body);

        // Server-side validation (Allow-list Check)
        if (!ALLOWED_OBJECTS.includes(object)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ result: "Invalid object selected." }));
          return;
        }

        // Tawag sa QVAC SDK Completion
        const response = await completion({
          modelId,
          history: [
            { 
              role: "system", 
              content: "You are a playful satirical AI. Generate an absurd, obviously fake conspiracy theory about the user's item. Keep it completely harmless and funny." 
            },
            { 
              role: "user", 
              content: `Tell me the conspiracy theory about: ${object}` 
            }
          ],
          completionOpts: { temperature: 0.7 }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result: response.text || response }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result: "Error generating theory: " + err.message }));
      }
    });
    return;
  }
});

initModel().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
