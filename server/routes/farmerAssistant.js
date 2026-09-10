/**
 * KisanQueue Farmer Assistant API Route
 *
 * POST /api/farmer-assistant
 *
 * Accepts: { query, language, farmerContext }
 * Returns: { response, intent, language }
 *
 * The OpenAI API key lives ONLY here — never in the frontend.
 *
 * Two-step AI processing:
 *   STEP 1 — Classify intent from natural language query.
 *   STEP 2 — Generate grounded response using ONLY the supplied farmerContext.
 *
 * The AI never receives the entire database.
 * The caller (frontend) is responsible for building the minimal farmerContext
 * from the authenticated farmer's data before calling this route.
 */

import '../loadEnv.js';
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// OpenAI client — key read from server environment variable only
// ─────────────────────────────────────────────────────────────────────────────

let openaiClient = null;

const getOpenAIClient = () => {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in the server environment.');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
};

// ─────────────────────────────────────────────────────────────────────────────
// Valid intents — frontend must only act on these
// ─────────────────────────────────────────────────────────────────────────────

const VALID_INTENTS = new Set([
  'GET_TOKEN',
  'GET_QUEUE',
  'GET_BOOKING',
  'GET_CENTRE',
  'GET_ARRIVAL_TIME',
  'GET_PROCUREMENT',
  'GET_PAYMENT',
  'CANCEL_BOOKING',
  'GET_NOTIFICATIONS',
  'GET_PROFILE',
  'HELP',
  'GREETING',
  'UNKNOWN',
]);

// ─────────────────────────────────────────────────────────────────────────────
// System prompt for the KisanQueue farmer assistant
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the KisanQueue farmer assistant — a helpful voice assistant for Indian farmers using a government crop procurement platform.

CRITICAL RULES you must ALWAYS follow:

1. You MUST use ONLY the data provided in the farmerContext JSON. Do NOT invent, assume, or hallucinate any values.
2. If a field is null or missing, clearly tell the farmer that information is currently unavailable. Do NOT make up a value.
3. Do NOT invent token numbers, queue positions, payment amounts, procurement stages, distances, or centre names.
4. You must NEVER reveal another farmer's information. Only respond about the context provided.
5. Never perform state-changing operations (cancellations, bookings, payments). Only the application controls those.
6. Keep responses SHORT and SIMPLE — farmers may have limited literacy. Use plain language.
7. Do NOT use markdown formatting (no bold, no bullet points) in spoken responses. Write in plain sentences.
8. Respond in the same language the farmer used (English, Telugu, or Hindi).
9. If asked about unrelated topics (weather, news, jokes, etc.), politely redirect: "I can help with your KisanQueue booking, token, queue, procurement and payment."

farmerContext fields you will receive:
- farmer: basic info (name, id)
- activeBooking: current booking details (null if no booking)
- queue: queue position details (null if no queue entry)
- procurement: procurement record (null if not yet)  
- payment: payment record (null if not yet)
- centre: booked centre details (null if unknown)

When a field is null: clearly say the information is not available yet.
When activeBooking is null: token, queue, arrival, procurement questions should all be answered as "no active booking."`;

// ─────────────────────────────────────────────────────────────────────────────
// Input validation
// ─────────────────────────────────────────────────────────────────────────────

const validateRequest = (body) => {
  const { query, language, farmerContext } = body;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return 'query is required and must be a non-empty string.';
  }
  if (query.trim().length > 500) {
    return 'query is too long (max 500 characters).';
  }
  if (language && !['en', 'te', 'hi'].includes(language)) {
    return 'language must be en, te, or hi.';
  }
  if (!farmerContext || typeof farmerContext !== 'object') {
    return 'farmerContext is required and must be an object.';
  }
  // Validate farmerContext does NOT contain sensitive fields
  if (farmerContext.aadhaar || farmerContext.password || farmerContext.otp) {
    return 'farmerContext must not contain sensitive authentication data.';
  }

  return null; // valid
};

// ─────────────────────────────────────────────────────────────────────────────
// Sanitize farmerContext — strip sensitive fields even if accidentally included
// ─────────────────────────────────────────────────────────────────────────────

const sanitizeContext = (ctx) => {
  if (!ctx || typeof ctx !== 'object') return {};

  const safe = {};

  // farmer — only id and name
  if (ctx.farmer) {
    safe.farmer = {
      id: ctx.farmer.id || null,
      name: ctx.farmer.name || null,
    };
  }

  // activeBooking — safe fields only
  if (ctx.activeBooking) {
    safe.activeBooking = {
      bookingId: ctx.activeBooking.bookingId || null,
      token: ctx.activeBooking.token || null,
      crop: ctx.activeBooking.crop || null,
      quantity: ctx.activeBooking.quantity ?? null,
      date: ctx.activeBooking.date || null,
      slot: ctx.activeBooking.slot || null,
      status: ctx.activeBooking.status || null,
    };
  } else {
    safe.activeBooking = null;
  }

  // queue
  if (ctx.queue) {
    safe.queue = {
      position: ctx.queue.position ?? null,
      farmersAhead: ctx.queue.farmersAhead ?? null,
      estimatedWait: ctx.queue.estimatedWait ?? null,
      servingToken: ctx.queue.servingToken || null,
      status: ctx.queue.status || null,
    };
  } else {
    safe.queue = null;
  }

  // centre
  if (ctx.centre) {
    safe.centre = {
      name: ctx.centre.name || null,
      district: ctx.centre.district || null,
      distance: ctx.centre.distance ?? null,
      operatingHours: ctx.centre.operatingHours || null,
    };
  } else {
    safe.centre = null;
  }

  // procurement
  if (ctx.procurement) {
    safe.procurement = {
      stage: ctx.procurement.stage || null,
      status: ctx.procurement.status || null,
      crop: ctx.procurement.crop || null,
      netWeightKg: ctx.procurement.netWeightKg ?? null,
      quality: ctx.procurement.quality || null,
      moisture: ctx.procurement.moisture || null,
      rate: ctx.procurement.rate ?? null,
      totalAmount: ctx.procurement.totalAmount ?? null,
    };
  } else {
    safe.procurement = null;
  }

  // payment — mask bank account, keep only what's needed
  if (ctx.payment) {
    safe.payment = {
      status: ctx.payment.status || null,
      amount: ctx.payment.amount ?? null,
      transactionId: ctx.payment.transactionId || null,
      date: ctx.payment.date || null,
    };
  } else {
    safe.payment = null;
  }

  return safe;
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: Classify intent
// ─────────────────────────────────────────────────────────────────────────────

const classifyIntent = async (openai, query, language) => {
  const intentPrompt = `Classify the following farmer query into exactly ONE intent from this list:
GET_TOKEN, GET_QUEUE, GET_BOOKING, GET_CENTRE, GET_ARRIVAL_TIME, GET_PROCUREMENT, GET_PAYMENT, CANCEL_BOOKING, GET_NOTIFICATIONS, GET_PROFILE, HELP, GREETING, UNKNOWN

Query: "${query}"
Language hint: ${language || 'en'}

Rules:
- GET_TOKEN: asking about their token number or digital token
- GET_QUEUE: asking about queue position, wait time, farmers ahead, when will token be called
- GET_BOOKING: asking about booking details, slot, date, crop quantity booked
- GET_CENTRE: asking about procurement centre location, address, distance
- GET_ARRIVAL_TIME: asking when to leave, when to arrive, what time to reach
- GET_PROCUREMENT: asking about procurement status, quality, weight, grade, crop value/amount
- GET_PAYMENT: asking about payment, money credited, transaction, payment status
- CANCEL_BOOKING: asking to cancel their booking or slot
- GREETING: hello, hi, who are you, what can you do
- HELP: asking for help or what the assistant can do
- UNKNOWN: anything unrelated to the above (weather, news, jokes, etc.)

Respond with ONLY valid JSON, no explanation:
{"intent": "INTENT_NAME", "language": "en|te|hi", "confidence": 0.0}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an intent classifier. Respond ONLY with valid JSON.' },
      { role: 'user', content: intentPrompt },
    ],
    temperature: 0,
    max_tokens: 100,
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw);

  // Validate intent is in allowed set
  const intent = VALID_INTENTS.has(parsed.intent) ? parsed.intent : 'UNKNOWN';
  const detectedLang = ['en', 'te', 'hi'].includes(parsed.language) ? parsed.language : (language || 'en');
  const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0;

  return { intent, language: detectedLang, confidence };
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2: Generate grounded response
// ─────────────────────────────────────────────────────────────────────────────

const generateGroundedResponse = async (openai, query, intent, safeContext, language) => {
  const langInstruction = language === 'te'
    ? 'Respond in Telugu (తెలుగు). Use simple Telugu that rural farmers can understand.'
    : language === 'hi'
    ? 'Respond in Hindi (हिंदी). Use simple Hindi that rural farmers can understand.'
    : 'Respond in English. Use simple language that farmers can easily understand.';

  const contextJson = JSON.stringify(safeContext, null, 2);

  const userMessage = `Farmer's query: "${query}"
Detected intent: ${intent}
${langInstruction}

Farmer's data (use ONLY this data, nothing else):
${contextJson}

Generate a helpful, accurate, short response based ONLY on the data above.
If any relevant data is null or missing, clearly say it is not available.
Do not invent any numbers, names, or statuses.
Do not use markdown formatting.
Keep the response under 3 sentences.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.3,
    max_tokens: 200,
  });

  return response.choices[0]?.message?.content?.trim() || null;
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/farmer-assistant
// ─────────────────────────────────────────────────────────────────────────────

router.post('/', async (req, res) => {
  // Validate input
  const validationError = validateRequest(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { query, language = 'en', farmerContext } = req.body;
  const cleanQuery = query.trim();

  // Sanitize context — remove any accidentally included sensitive data
  const safeContext = sanitizeContext(farmerContext);

  // Server-side log (development only) — NEVER log API key
  if (process.env.NODE_ENV !== 'production') {
    console.log('[API] farmer-assistant query:', cleanQuery);
    console.log('[API] farmer ID:', safeContext.farmer?.id);
    console.log('[API] language:', language);
    console.log('[API] has active booking:', !!safeContext.activeBooking);
  }

  try {
    const openai = getOpenAIClient();

    // STEP 1: Classify intent
    let intentResult;
    try {
      intentResult = await classifyIntent(openai, cleanQuery, language);
    } catch (intentErr) {
      console.error('[API] Intent classification failed:', intentErr.message);
      // Fallback: unknown intent, still try to generate a response
      intentResult = { intent: 'UNKNOWN', language, confidence: 0 };
    }

    const { intent, language: detectedLang } = intentResult;

    // STEP 2: Generate grounded response
    const aiResponse = await generateGroundedResponse(
      openai,
      cleanQuery,
      intent,
      safeContext,
      detectedLang
    );

    if (!aiResponse) {
      return res.status(500).json({ error: 'AI returned an empty response.' });
    }

    return res.json({
      response: aiResponse,
      intent,
      language: detectedLang,
    });

  } catch (err) {
    // Log technical details server-side only
    console.error('[API] farmer-assistant error:', err.message);

    // Never expose API key, stack traces, or internal details to the client
    if (err.message?.includes('OPENAI_API_KEY')) {
      return res.status(503).json({
        error: 'AI service is not configured. Please contact support.',
        code: 'API_NOT_CONFIGURED',
      });
    }
    if (err.status === 429) {
      return res.status(429).json({
        error: 'AI service is temporarily busy. Please try again in a moment.',
        code: 'RATE_LIMITED',
      });
    }
    if (err.status === 401) {
      return res.status(503).json({
        error: 'AI service authentication failed. Please contact support.',
        code: 'AUTH_FAILED',
      });
    }

    return res.status(503).json({
      error: 'Voice assistant is temporarily unavailable. Please try again.',
      code: 'SERVICE_UNAVAILABLE',
    });
  }
});

export default router;
