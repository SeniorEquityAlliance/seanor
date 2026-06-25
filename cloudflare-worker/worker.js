const ALLOWED_ORIGINS = new Set([
  "https://seniorequityalliance.github.io",
  "http://localhost:8080",
  "http://localhost:8765"
]);

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "requesterType",
  "subject",
  "message"
];

function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };

  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin)
    }
  });
}

function validatePayload(payload) {
  for (const field of REQUIRED_FIELDS) {
    if (!payload[field] || String(payload[field]).trim().length === 0) {
      return `${field} is required.`;
    }
  }

  if (payload.consent !== true) {
    return "Consent is required.";
  }

  return "";
}

function normalizePayload(payload) {
  return {
    firstName: String(payload.firstName).trim(),
    lastName: String(payload.lastName).trim(),
    email: String(payload.email).trim().toLowerCase(),
    phone: String(payload.phone).trim(),
    requesterType: String(payload.requesterType).trim(),
    subject: String(payload.subject).trim(),
    message: String(payload.message).trim(),
    consent: true,
    sourcePage: String(payload.sourcePage || "/").trim()
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin)
      });
    }

    const url = new URL(request.url);

    if (url.pathname !== "/contact-submission" || request.method !== "POST") {
      return jsonResponse({ ok: false, message: "Not found." }, 404, origin);
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return jsonResponse({ ok: false, message: "Origin is not allowed." }, 403, origin);
    }

    let payload;

    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ ok: false, message: "Invalid JSON body." }, 400, origin);
    }

    const validationError = validatePayload(payload);

    if (validationError) {
      return jsonResponse({ ok: false, message: validationError }, 400, origin);
    }

    const parseServerUrl = (env.BACK4APP_PARSE_SERVER_URL || "https://parseapi.back4app.com").replace(/\/$/, "");
    const parseClass = payload.parseClass || "ContactSubmission";
    const parseHeaders = {
      "Content-Type": "application/json",
      "X-Parse-Application-Id": env.BACK4APP_PARSE_APPLICATION_ID
    };

    if (env.BACK4APP_PARSE_MASTER_KEY) {
      parseHeaders["X-Parse-Master-Key"] = env.BACK4APP_PARSE_MASTER_KEY;
    } else if (env.BACK4APP_PARSE_REST_API_KEY) {
      parseHeaders["X-Parse-REST-API-Key"] = env.BACK4APP_PARSE_REST_API_KEY;
    } else {
      return jsonResponse({ ok: false, message: "Parse credentials are not configured." }, 500, origin);
    }

    const parseResponse = await fetch(`${parseServerUrl}/classes/${encodeURIComponent(parseClass)}`, {
      method: "POST",
      headers: parseHeaders,
      body: JSON.stringify(normalizePayload(payload))
    });

    if (!parseResponse.ok) {
      return jsonResponse({ ok: false, message: "Parse submission failed." }, 502, origin);
    }

    const result = await parseResponse.json();

    return jsonResponse({ ok: true, objectId: result.objectId }, 201, origin);
  }
};
