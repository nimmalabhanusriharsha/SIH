/**
 * KisanQueue Farmer Assistant Service
 *
 * Sends queries to the secure backend AI API.
 * Builds minimal farmerContext from authenticated farmer's data.
 * Falls back to local keyword matching if AI API is unavailable.
 *
 * ARCHITECTURE:
 *   query + farmerContext  →  POST /api/farmer-assistant  →  AI response
 *
 * STRICT RULES:
 *  - NEVER send entire application state to AI.
 *  - ONLY use currentUser.id as farmer identity.
 *  - Never put API key in this file (it belongs in server/.env).
 *  - If data is missing → null. Never invent values.
 *  - Accuracy > Completeness.
 */

import { calculateSmartArrivalTime } from './aiRecommendation.js';
import {
  isSlotBookable,
  getSlotBookingCount,
  getSlotStatus,
  isFarmerBookingBlocked,
  isHoliday,
  getHolidayInfo,
  formatLocalDate,
  MAX_SLOT_CAPACITY
} from '../portals/farmer/utils/slotBookingRules.js';

// ─────────────────────────────────────────────────────────────────────────────
// Build Farmer Context
// Creates a minimal safe data object from the authenticated farmer's state.
// This is what gets sent to the backend (not the entire state).
// ─────────────────────────────────────────────────────────────────────────────

export const buildFarmerContext = ({ state, currentUser }) => {
  // ── Authenticated farmer identity ──────────────────────────────────────────
  const farmer = currentUser
    ? { id: currentUser.id, name: currentUser.name || null }
    : null;

  // ── Active booking — scoped to currentUser.id only ─────────────────────────
  const myBookings = (state?.bookings || []).filter(
    (b) => b.farmerId === currentUser?.id
  );
  const rawActiveBooking = myBookings.find(
    (b) => ['Confirmed', 'Processing', 'active'].includes(b.status)
  ) || null;

  const activeBooking = rawActiveBooking
    ? {
        bookingId: rawActiveBooking.id || null,
        centreId: rawActiveBooking.centreId || null,
        token: rawActiveBooking.token || null,
        crop: rawActiveBooking.crop || null,
        quantity: rawActiveBooking.quantity ?? rawActiveBooking.expectedQuantity ?? null,
        date: rawActiveBooking.date || null,
        slot: rawActiveBooking.slot || null,
        status: rawActiveBooking.status || null,
      }
    : null;

  // ── Centre — ONLY from active booking, never fallback to centres[0] ────────
  const centres = state?.centres || [];
  const rawCentre = activeBooking?.centreId
    ? (centres.find((c) => c.id === activeBooking.centreId) || null)
    : null;

  const centre = rawCentre
    ? {
        name: rawCentre.name || null,
        district: rawCentre.district || null,
        distance: rawCentre.distance ?? null,
        operatingHours: rawCentre.operatingHours || null,
      }
    : null;

  // ── Queue — scoped to farmer's booking centre ──────────────────────────────
  const queue = state?.queue || [];
  const queueForCentre = activeBooking?.centreId
    ? queue.filter((e) => e.centreId === activeBooking.centreId)
    : [];

  const userToken = activeBooking?.token || null;
  const myQueueEntry = (activeBooking && userToken)
    ? queueForCentre.find(
        (e) => e.token === userToken || e.farmerId === currentUser?.id
      )
    : null;

  // farmersAhead: only from actual position — NEVER use queue.length
  let farmersAhead = null;
  if (myQueueEntry?.position !== undefined && myQueueEntry.position !== null) {
    farmersAhead = Math.max(0, Number(myQueueEntry.position) - 1);
  }

  const servingEntry = queueForCentre.find(
    (e) => e.status === 'serving' || e.status === 'Serving'
  ) || null;

  const queueContext = myQueueEntry
    ? {
        position: myQueueEntry.position ?? null,
        farmersAhead,
        estimatedWait: myQueueEntry.waitTime ?? null,
        servingToken: servingEntry?.token || null,
        status: myQueueEntry.status || null,
      }
    : null;

  // ── Procurement — scoped to currentUser.id ─────────────────────────────────
  const myProcurements = (state?.procurements || []).filter(
    (p) => p.farmerId === currentUser?.id
  );
  const rawProcurement = myProcurements.length > 0 ? myProcurements[0] : null;

  const procurement = rawProcurement
    ? {
        stage: rawProcurement.stage || rawProcurement.status || null,
        status: rawProcurement.status || null,
        crop: rawProcurement.crop || null,
        netWeightKg: rawProcurement.netWeightKg ?? null,
        quality: rawProcurement.quality || null,
        moisture: rawProcurement.moisture || null,
        rate: rawProcurement.rate ?? null,
        totalAmount: rawProcurement.totalAmount ?? rawProcurement.amount ?? null,
      }
    : null;

  // ── Payment — scoped to currentUser.id ────────────────────────────────────
  const myPayments = (state?.payments || []).filter(
    (p) => p.farmerId === currentUser?.id
  );
  const rawPayment = myPayments.length > 0 ? myPayments[0] : null;

  const payment = rawPayment
    ? {
        status: rawPayment.status || null,
        amount: rawPayment.amount ?? null,
        transactionId: rawPayment.transactionId || null,
        date: rawPayment.date || null,
        // bank account masked — do not send full account number
      }
    : null;

  return { farmer, activeBooking, centre, queue: queueContext, procurement, payment };
};

// ─────────────────────────────────────────────────────────────────────────────
// AI API Call
// POSTs to /api/farmer-assistant (proxied to Express server by Vite in dev).
// ─────────────────────────────────────────────────────────────────────────────

const callAIAssistant = async ({ query, language, farmerContext }) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const res = await fetch('/api/farmer-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language, farmerContext }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const code = errBody.code || 'UNKNOWN';
      throw Object.assign(
        new Error(errBody.error || `API error ${res.status}`),
        { httpStatus: res.status, code }
      );
    }

    const data = await res.json();
    if (!data.response || typeof data.response !== 'string') {
      throw new Error('AI returned an invalid response format.');
    }

    return { response: data.response, intent: data.intent || 'UNKNOWN' };
  } finally {
    clearTimeout(timeoutId);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Local Keyword Fallback (used when AI API is unavailable)
// ─────────────────────────────────────────────────────────────────────────────

const INTENT_GROUPS = {
  CHECK_SLOT_AVAILABILITY: {
    en: [
      'can i book', 'book slot', 'slot available', 'slots available', 'is 10 am',
      '10 am slot', '10:00 am', 'available slot', 'book the 10', 'available today',
      'can i book today', 'is slot available', 'slots open', 'is 10:00', '10 am'
    ],
    te: ['స్లాట్ అందుబాటులో', 'స్లాట్ బుక్ చేయవచ్చా', '10 am స్లాట్', 'అందుబాటులో ఉన్నాయా', 'బుక్ చేసుకోవచ్చా'],
    hi: ['स्लॉट उपलब्ध', 'स्लॉट बुक कर सकते हैं', '10 am स्लॉट', 'क्या स्लॉट उपलब्ध है', 'स्लॉट मिल सकता']
  },
  CANCEL_BOOKING: {
    en: ['cancel booking', 'cancel my booking', 'cancel my slot', 'withdraw booking', 'cancel slot'],
    te: ['రద్దు', 'బుకింగ్ రద్దు'],
    hi: ['रद्द', 'बुकिंग रद्द', 'स्लॉट रद्द'],
  },
  GET_ARRIVAL_TIME: {
    en: ['when should i arrive', 'when should i leave', 'when should i reach', 'what time should i leave',
         'when do i need to reach', 'arrival time', 'departure time', 'when to arrive', 'when to leave',
         'when to reach', 'what time to leave', 'what time to arrive'],
    te: ['చేరుకోవాలి', 'బయలుదేరాలి', 'రావలసిన సమయం', 'రాక సమయం', 'ఎప్పుడు వెళ్ళాలి'],
    hi: ['पहुंच', 'निकलन', 'कब निकलूं', 'कब पहुंचूं', 'पहुंचने का समय', 'आगमन', 'कब जाना चाहिए'],
  },
  GET_QUEUE: {
    en: ['queue', 'farmers ahead', 'people ahead', 'queue position', 'waiting time', 'wait time',
         'how long to wait', 'how long', 'how many ahead', 'ahead of me', 'wait', 'waiting', 'my turn'],
    te: ['క్యూ', 'ముందు', 'ఎంతమంది', 'స్థానం', 'నిరీక్షణ', 'ఎంత సేపు', 'వేచి ఉండాలి'],
    hi: ['कतार', 'आगे', 'कितने किसान', 'प्रतीक्षा', 'इंतजार', 'कितना समय', 'मेरी बारी', 'मेरा नंबर'],
  },
  GET_PROCUREMENT: {
    en: ['procurement', 'procured', 'crop worth', 'crop value', 'grain worth', 'weighing', 'weight',
         'quality', 'moisture', 'procurement status', 'procurement stage', 'my crop', 'stage',
         'net weight', 'gross weight', 'total amount', 'crop amount', 'has my crop'],
    te: ['సేకరణ', 'పంట విలువ', 'నాణ్యత', 'తూకం', 'దశ', 'నికర బరువు', 'మొత్తం'],
    hi: ['खरीद', 'फसल', 'मूल्य', 'गुणवत्ता', 'वजन', 'चरण', 'खरीदी', 'क्रय'],
  },
  GET_PAYMENT: {
    en: ['payment', 'paid', 'payment status', 'money', 'amount credited', 'credited', 'credit',
         'payment received', 'payment pending', 'transaction', 'bank', 'dbt', 'payout',
         'has my payment', 'payment arrived', 'payment done', 'payment completed',
         'payment not arrived', 'not received payment', 'where is my payment'],
    te: ['చెల్లింపు', 'డబ్బు', 'బ్యాంక్', 'ఖాతా', 'లావాదేవీ'],
    hi: ['भुगतान', 'पैसे', 'रुपये', 'राशि', 'बैंक', 'लेनदेन'],
  },
  GET_CENTRE: {
    en: ['centre', 'center', 'procurement centre', 'procurement center', 'my centre', 'my center',
         'where is my centre', 'show my centre', 'tell me my centre', 'which centre', 'where do i go',
         'where should i go', 'centre details', 'centre address', 'location', 'address'],
    te: ['కేంద్రం', 'ఎక్కడ', 'సేకరణ కేంద్రం', 'కేంద్రం వివరాలు'],
    hi: ['केंद्र', 'कहाँ', 'कहां', 'खरीद केंद्र', 'केंद्र का पता'],
  },
  GET_BOOKING: {
    en: ['booking', 'my booking', 'appointment', 'show my booking', 'check my booking',
         'booking details', 'slot details', 'my slot', 'when is my booking', 'when is my slot'],
    te: ['బుకింగ్', 'స్లాట్', 'అపాయింట్‌మెంట్', 'నా బుకింగ్', 'బుకింగ్ వివరాలు'],
    hi: ['बुकिंग', 'स्लॉट', 'अपॉइंटमेंट', 'मेरी बुकिंग', 'बुकिंग विवरण'],
  },
  GET_TOKEN: {
    en: ['token', 'my token', 'token number', 'token status', 'what is my token', 'where is my token',
         'tell me my token', 'show my token', 'my token please', 'token no', 'token id', 'digital token'],
    te: ['టోకెన్', 'నా టోకెన్', 'టోకెన్ నంబర్'],
    hi: ['टोकन', 'मेरा टोकन', 'टोकन नंबर', 'टोकन क्या है'],
  },
  GREETING: {
    en: ['hello', 'hi', 'hey', 'who are you', 'what are you', 'what can you do', 'help',
         'weather', 'joke', 'capital', 'cricket', 'news'],
    te: ['నమస్కారం', 'నమస్తే', 'మీరు ఎవరు', 'వాతావరణం', 'సహాయం'],
    hi: ['नमस्ते', 'नमस्कार', 'हेलो', 'आप कौन हैं', 'मौसम', 'मदद'],
  },
};

const LOCAL_INTENT_PRIORITY = [
  'CHECK_SLOT_AVAILABILITY',
  'CANCEL_BOOKING',
  'GET_PAYMENT',
  'GET_PROCUREMENT',
  'GET_QUEUE',
  'GET_ARRIVAL_TIME',
  'GET_CENTRE',
  'GET_BOOKING',
  'GET_TOKEN',
  'GREETING',
];

const resolveLocalIntent = (query) => {
  const q = query.toLowerCase().trim();
  for (const intentName of LOCAL_INTENT_PRIORITY) {
    const group = INTENT_GROUPS[intentName];
    if (!group) continue;
    for (const lang of ['en', 'te', 'hi']) {
      for (const kw of (group[lang] || [])) {
        if (q.includes(kw.toLowerCase())) return intentName;
      }
    }
  }
  return 'UNKNOWN';
};

const mapPaymentStatus = (status) => {
  if (!status) return 'Processing';
  const s = status.toLowerCase();
  if (s === 'paid' || s === 'completed' || s === 'complete') return 'Completed';
  if (s === 'processing' || s === 'pending') return 'Processing';
  if (s === 'failed' || s === 'failure') return 'Failed';
  if (s === 'rejected') return 'Rejected';
  if (s === 'cancelled') return 'Cancelled';
  return status;
};

/**
 * Local fallback response — used when AI API is unavailable.
 * Uses the same farmerContext that would have been sent to AI.
 */
const localFallbackResponse = (query, farmerContext, t, state, currentUser) => {
  const intent = resolveLocalIntent(query);
  const { activeBooking, centre, queue, procurement, payment } = farmerContext;

  switch (intent) {
    case 'CHECK_SLOT_AVAILABILITY': {
      // 1. Check if farmer is blocked due to > 5 missed slots
      if (currentUser?.id && isFarmerBookingBlocked({ farmerId: currentUser.id, bookings: state?.bookings || [] })) {
        return t('voice.blockedVoiceResp', 'Your booking access is temporarily blocked because you have missed more than 5 procurement slots.');
      }

      // 2. Check holiday rule for today
      const today = formatLocalDate(new Date());
      const holidayInfo = getHolidayInfo(today);
      if (holidayInfo.isHoliday) {
        if (holidayInfo.holidayType === 'sunday') {
          return t('voice.sundayVoiceResp', 'Today is Sunday, so booking is unavailable.');
        }
        return t('voice.secondSatVoiceResp', 'Today is the second Saturday, so booking is unavailable.');
      }

      const q = query.toLowerCase();
      const centres = state?.centres || [];
      const targetCentreId = activeBooking?.centreId || centres[0]?.id || 'C001';

      // 3. Check 10 AM slot specifically if query mentions '10'
      if (q.includes('10')) {
        const slot10 = '10:00 AM – 11:00 AM';
        const statusObj = getSlotStatus({
          date: today,
          slot: slot10,
          centreId: targetCentreId,
          bookings: state?.bookings || [],
          now: new Date(),
          farmerId: currentUser?.id,
        });

        if (statusObj.status === 'started') {
          return t('voice.slotStartedResp', 'The 10 AM slot has already started, so booking is closed.');
        }
        if (statusObj.status === 'full') {
          return t('voice.slotFullResp', 'The 10 AM slot is full. Please choose another available slot.');
        }
        if (statusObj.status === 'already_booked') {
          return t('booking.alreadyBookedSlot', 'You already have a booking for this slot.');
        }
        return t('voice.slotAvailableResp', {
          count: statusObj.currentCount,
          max: MAX_SLOT_CAPACITY,
          fallback: `The 10 AM slot is available. ${statusObj.currentCount} out of 5 places are booked.`
        });
      }

      // 4. General slots query for today
      const standardSlots = [
        '08:00 AM – 09:00 AM',
        '09:00 AM – 10:00 AM',
        '10:00 AM – 11:00 AM',
        '11:00 AM – 12:00 PM',
        '02:00 PM – 03:00 PM',
        '03:00 PM – 04:00 PM'
      ];

      const availableCount = standardSlots.filter((slot) =>
        isSlotBookable({
          date: today,
          slot,
          centreId: targetCentreId,
          bookings: state?.bookings || [],
          now: new Date(),
          farmerId: currentUser?.id
        })
      ).length;

      if (availableCount === 0) {
        return t('voice.noSlotsTodayResp', 'No booking slots are currently available for today.');
      }

      return `There are ${availableCount} procurement slots currently available today.`;
    }
    case 'GET_TOKEN': {
      if (!activeBooking) return t('voice.noActiveBookingVoice', 'You do not have an active procurement booking yet. Please book a procurement slot to receive your token.');
      if (!activeBooking.token) return t('voice.tokenMissing', 'Your booking exists, but your token information is currently unavailable.');
      return t('voice.tokenResp', {
        token: activeBooking.token,
        centre: centre?.name || '',
        date: activeBooking.date || '',
        slot: activeBooking.slot || '',
        fallback: `Your token is ${activeBooking.token}${centre?.name ? ' for ' + centre.name : ''}${activeBooking.date ? ' on ' + activeBooking.date : ''}.`,
      });
    }
    case 'GET_QUEUE': {
      if (!activeBooking) return t('voice.noActiveQueueVoice', 'You do not have an active booking in the queue yet.');
      if (!queue) return t('voice.queuePositionUnknown', 'Your queue position is not available right now. Please check the live queue section.');
      const parts = [];
      if (queue.servingToken) parts.push(`Currently serving: ${queue.servingToken}.`);
      if (activeBooking.token) parts.push(`Your token: ${activeBooking.token}.`);
      if (queue.farmersAhead !== null) parts.push(`${queue.farmersAhead} farmer${queue.farmersAhead !== 1 ? 's' : ''} ahead.`);
      if (queue.estimatedWait !== null) parts.push(`Estimated wait: ${queue.estimatedWait} minutes.`);
      return parts.join(' ') || t('voice.queuePositionUnknown', 'Queue information is not available right now.');
    }
    case 'GET_CENTRE': {
      if (!activeBooking) return t('voice.noCentreSelected', 'You have not selected a procurement centre yet.');
      if (!centre) return t('voice.centreNotFound', 'Centre details are not available right now.');
      const dist = centre.distance != null ? ` (${centre.distance} km)` : '';
      const dist2 = centre.district ? `, ${centre.district}` : '';
      return t('voice.centreResp', {
        centre: centre.name,
        district: centre.district || '',
        distance: centre.distance ?? '',
        fallback: `Your centre is ${centre.name}${dist2}${dist}.`,
      });
    }
    case 'GET_BOOKING': {
      if (!activeBooking) return t('voice.noActiveBookingVoice', 'You do not have an active booking yet.');
      const parts = [];
      if (activeBooking.crop) parts.push(activeBooking.crop);
      if (activeBooking.quantity != null) parts.push(`${activeBooking.quantity} kg`);
      if (centre?.name) parts.push(`at ${centre.name}`);
      if (activeBooking.date) parts.push(`on ${activeBooking.date}`);
      if (activeBooking.slot) parts.push(`slot ${activeBooking.slot}`);
      if (activeBooking.token) parts.push(`Token: ${activeBooking.token}`);
      return parts.length > 0 ? `Your booking: ${parts.join(', ')}.` : t('voice.infoUnavailable', 'Booking details are not fully available right now.');
    }
    case 'GET_ARRIVAL_TIME': {
      if (!activeBooking) return t('voice.noActiveBookingVoice', 'You do not have an active booking.');
      if (!centre?.distance) return t('voice.infoUnavailable', 'Travel information is not available.');
      const ahead = queue?.farmersAhead ?? 0;
      const calc = calculateSmartArrivalTime(Number(centre.distance), ahead, 5);
      return t('voice.arrivalResp', {
        leaveTime: calc.recommendedDepartureTime,
        arriveTime: calc.recommendedArrivalTime,
        travelTime: `${calc.travelTimeMin} min`,
        fallback: `Leave by ${calc.recommendedDepartureTime} to arrive by ${calc.recommendedArrivalTime}.`,
      });
    }
    case 'GET_PROCUREMENT': {
      if (!procurement) {
        return activeBooking
          ? t('voice.procurementNotStarted', 'Your procurement has not started yet. Please arrive at the centre with your crop.')
          : t('voice.procurementNoData', 'No procurement details available yet.');
      }
      const parts = [];
      if (procurement.crop) parts.push(`Crop: ${procurement.crop}`);
      if (procurement.netWeightKg != null) parts.push(`Net weight: ${procurement.netWeightKg} kg`);
      if (procurement.quality) parts.push(`Quality: ${procurement.quality}`);
      if (procurement.stage) parts.push(`Stage: ${procurement.stage}`);
      if (procurement.totalAmount != null) parts.push(`Total: ₹${Number(procurement.totalAmount).toLocaleString('en-IN')}`);
      return parts.length > 0 ? `Your procurement — ${parts.join(', ')}.` : t('voice.infoUnavailable', 'Procurement information not fully available.');
    }
    case 'GET_PAYMENT': {
      if (!payment) {
        return procurement
          ? t('voice.paymentPendingResp', 'Payment begins after grain weighing and quality clearance.')
          : t('dashboard.noPaymentYetDesc', 'Your payment will appear here once your grain is procured.');
      }
      const status = mapPaymentStatus(payment.status);
      const amt = payment.amount != null ? `₹${Number(payment.amount).toLocaleString('en-IN')}` : null;
      return t('voice.paymentResp', {
        amount: amt || 'N/A',
        status,
        txnId: payment.transactionId || 'N/A',
        fallback: [
          amt ? `Your payment of ${amt} is ${status}.` : `Payment status: ${status}.`,
          payment.transactionId ? `Transaction ID: ${payment.transactionId}.` : '',
        ].filter(Boolean).join(' '),
      });
    }
    case 'CANCEL_BOOKING': {
      if (!activeBooking) return t('voice.noActiveCancelVoice', 'You do not have an active booking to cancel.');
      return t('voice.cancelConfirmResp', {
        date: activeBooking.date || 'the booked date',
        centre: centre?.name || 'your centre',
        fallback: `Do you want to cancel your booking for ${activeBooking.date || 'the booked date'}? Please go to My Bookings to confirm.`,
      });
    }
    case 'GREETING': {
      return t('voice.greetingResp', 'I am your KisanQueue Assistant. I can help with your token, booking, queue, arrival time, procurement and payment.');
    }
    default: {
      return t('voice.fallbackResp', 'I can help with your booking, token, queue, arrival time, procurement and payment. Please ask about any of these.');
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Service Export — ASYNC
// ─────────────────────────────────────────────────────────────────────────────

export const processFarmerAssistantQuery = async (
  rawQuery,
  { state, currentUser, currentLang = 'en', t }
) => {
  const query = (rawQuery || '').trim();

  console.log('[VOICE] recognized transcript:', query);
  console.log('[VOICE] farmer ID:', currentUser?.id);

  if (!query) {
    return {
      intent: 'EMPTY',
      transcript: '',
      response: t('voice.noSpeechDetected', 'I could not hear you. Please tap the microphone and speak again.'),
    };
  }

  // Build minimal safe farmer context (never sends entire state)
  const farmerContext = buildFarmerContext({ state, currentUser });

  console.log('[VOICE] active booking:', farmerContext.activeBooking?.bookingId, farmerContext.activeBooking?.token);
  console.log('[VOICE] queue entry:', farmerContext.queue);
  console.log('[VOICE] procurement:', farmerContext.procurement?.stage);
  console.log('[VOICE] payment:', farmerContext.payment?.status);

  // For slot availability queries, return verified local data directly to ensure zero hallucination
  const detectedIntent = resolveLocalIntent(query);
  if (detectedIntent === 'CHECK_SLOT_AVAILABILITY') {
    const response = localFallbackResponse(query, farmerContext, t, state, currentUser);
    return {
      intent: 'CHECK_SLOT_AVAILABILITY',
      transcript: query,
      response,
      source: 'local-rules',
    };
  }

  // Try AI API first
  try {
    const aiResult = await callAIAssistant({
      query,
      language: currentLang,
      farmerContext,
    });

    console.log('[VOICE] AI intent:', aiResult.intent);
    console.log('[VOICE] AI response:', aiResult.response);

    return {
      intent: aiResult.intent,
      transcript: query,
      response: aiResult.response,
      source: 'ai',
    };
  } catch (err) {
    // Log error server-side; show farmer-friendly fallback
    console.warn('[VOICE] AI API unavailable, using local fallback. Error:', err.message);

    const fallbackResponse = localFallbackResponse(query, farmerContext, t, state, currentUser);

    console.log('[VOICE] fallback response:', fallbackResponse);

    return {
      intent: resolveLocalIntent(query),
      transcript: query,
      response: fallbackResponse,
      source: 'local-fallback',
    };
  }
};
