import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// --- SERVICES ---
export const getServices = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("services").collect();
  },
});

export const addService = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    durationMins: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("services", {
      ...args,
      isActive: true,
    });
  },
});

// --- TIME SLOTS / CALENDAR ---
export const getSlotsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("timeSlots")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

export const addSlot = mutation({
  args: {
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    status: v.union(v.literal("AVAILABLE"), v.literal("TAKEN")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("timeSlots", args);
  },
});

export const toggleSlotStatus = mutation({
  args: { slotId: v.id("timeSlots"), newStatus: v.union(v.literal("AVAILABLE"), v.literal("TAKEN")) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.slotId, { status: args.newStatus });
  },
});

// --- CUSTOMERS ---
export const getCustomers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("customers").order("desc").collect();
  },
});

export const addCustomer = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    whatsapp: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("customers", args);
  },
});

// --- BOOKINGS ---
export const getBookings = query({
  args: {},
  handler: async (ctx) => {
    // Basic join simulator could be here, but we return raw for now
    return await ctx.db.query("bookings").order("desc").collect();
  },
});

export const createBookingLink = mutation({
  args: { timeSlotId: v.id("timeSlots") },
  handler: async (ctx, args) => {
    const token = crypto.randomUUID();
    // Pre-create an empty pending booking locked to a slot
    const bookingId = await ctx.db.insert("bookings", {
      customerId: "jh790m4kqh723q9xjh" as any, // Needs real logic in public flow
      timeSlotId: args.timeSlotId,
      serviceIds: [],
      totalPrice: 0,
      status: "PENDING",
      bookingLinkToken: token,
      receiptGenerated: false,
    });
    return token;
  },
});
