// In-memory seed data so the whole dashboard is explorable with no backend
// running yet. Every mock function mirrors the shape of the real API
// modules in src/api/, so swapping VITE_USE_MOCK=false later is a
// one-line change per call site, not a rewrite.

let uid = 1000;
export const nextId = () => String(uid++);

export const state = {
  business: {
    id: "biz_1",
    name: "Bloom & Co. Salon",
    phone: "+971 4 555 0142",
    address: "Al Wasl Road, Dubai",
    timezone: "Asia/Dubai",
    whatsappConnected: true,
    aiEnabled: true,
    tone: "FRIENDLY",
    language: "EN",
  },
  offerings: [
    { id: "off_1", name: "Signature Haircut", description: "Wash, cut and blow-dry with our senior stylists.", price: 180, durationMinutes: 45, isActive: true },
    { id: "off_2", name: "Balayage", description: "Hand-painted colour with gloss finish.", price: 650, durationMinutes: 180, isActive: true },
    { id: "off_3", name: "Classic Manicure", description: "Shape, cuticle care and polish.", price: 90, durationMinutes: 30, isActive: true },
    { id: "off_4", name: "Deep Conditioning Treatment", description: "Add-on treatment for dry or damaged hair.", price: 120, durationMinutes: 25, isActive: false },
  ],
  faqs: [
    { id: "faq_1", question: "What are your opening hours?", answer: "We're open Saturday–Thursday, 10am–9pm. Closed Fridays." },
    { id: "faq_2", question: "Do you accept walk-ins?", answer: "We accept walk-ins when a stylist is free, but booking ahead guarantees your slot." },
    { id: "faq_3", question: "Where are you located?", answer: "Al Wasl Road, Dubai — two minutes from the Jumeirah roundabout, free parking at the rear." },
  ],
  customers: [
    { id: "cust_1", whatsappNumber: "+971 50 111 2233", name: "Aisha Al Marri", leadStatus: "BOOKED", lastContactAt: "2026-09-02T14:20:00Z" },
    { id: "cust_2", whatsappNumber: "+971 55 222 3344", name: "Fatima Noor", leadStatus: "CONTACTED", lastContactAt: "2026-09-02T09:05:00Z" },
    { id: "cust_3", whatsappNumber: "+971 52 333 4455", name: null, leadStatus: "NEW", lastContactAt: "2026-09-01T18:40:00Z" },
    { id: "cust_4", whatsappNumber: "+971 56 444 5566", name: "Mariam Yousef", leadStatus: "LOST", lastContactAt: "2026-08-29T11:15:00Z" },
  ],
  conversations: [
    {
      id: "conv_1",
      customerId: "cust_1",
      status: "AI_ACTIVE",
      updatedAt: "2026-09-02T14:20:00Z",
      messages: [
        { id: "m1", sender: "CUSTOMER", content: "Hi, how much is balayage?", createdAt: "2026-09-02T14:10:00Z" },
        { id: "m2", sender: "AI", content: "Hi! Balayage is AED 650 and takes about 3 hours. Would you like to book a slot?", createdAt: "2026-09-02T14:10:30Z" },
        { id: "m3", sender: "CUSTOMER", content: "Yes please, Thursday afternoon", createdAt: "2026-09-02T14:19:00Z" },
        { id: "m4", sender: "AI", content: "Got it — I've noted a request for balayage this Thursday afternoon. Our team will confirm the exact time shortly.", createdAt: "2026-09-02T14:20:00Z" },
      ],
    },
    {
      id: "conv_2",
      customerId: "cust_2",
      status: "NEEDS_HUMAN",
      updatedAt: "2026-09-02T09:05:00Z",
      messages: [
        { id: "m5", sender: "CUSTOMER", content: "I had an allergic reaction to a colour treatment last time, can I speak to the manager?", createdAt: "2026-09-02T09:04:00Z" },
        { id: "m6", sender: "AI", content: "I'm sorry to hear that. I'm connecting you with our team now — someone will reply here shortly.", createdAt: "2026-09-02T09:05:00Z" },
      ],
    },
    {
      id: "conv_3",
      customerId: "cust_3",
      status: "AI_ACTIVE",
      updatedAt: "2026-09-01T18:40:00Z",
      messages: [
        { id: "m7", sender: "CUSTOMER", content: "Are you open on Friday?", createdAt: "2026-09-01T18:40:00Z" },
        { id: "m8", sender: "AI", content: "We're closed on Fridays — open Saturday to Thursday, 10am–9pm. Happy to help you book another day!", createdAt: "2026-09-01T18:40:20Z" },
      ],
    },
  ],
  requests: [
    { id: "req_1", customerId: "cust_1", offeringId: "off_2", type: "BOOKING", requestedDate: "2026-09-04", requestedTime: "14:00", notes: "Prefers senior stylist", status: "PENDING" },
    { id: "req_2", customerId: "cust_2", offeringId: "off_1", type: "BOOKING", requestedDate: "2026-09-03", requestedTime: "11:30", notes: "", status: "CONFIRMED" },
    { id: "req_3", customerId: "cust_4", offeringId: "off_3", type: "BOOKING", requestedDate: "2026-08-30", requestedTime: "16:00", notes: "Cancelled by customer", status: "REJECTED" },
  ],
};

export const withDelay = (value, ms = 380) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));
