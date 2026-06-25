const bodyParser = require("body-parser");

const { saveContactSubmission } = require("./main");

app.use(bodyParser.json());

app.use((request, response, next) => {
  const allowedOrigins = [
    "https://seniorequityalliance.github.io",
    "http://localhost:8080",
    "http://localhost:8765"
  ];
  const origin = request.headers.origin;

  if (allowedOrigins.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
  }

  response.setHeader("Vary", "Origin");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  next();
});

app.post("/contact-submission", async (request, response) => {
  try {
    const result = await saveContactSubmission(request.body || {});

    response.status(201).json({
      ok: true,
      objectId: result.objectId
    });
  } catch (error) {
    response.status(400).json({
      ok: false,
      message: error.message || "Unable to save contact submission."
    });
  }
});
