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

export const getAvailableSlotsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const slots = await ctx.db
      .query("timeSlots")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
    return slots.filter(s => s.status === "AVAILABLE");
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
    return await ctx.db.query("bookings").order("desc").collect();
  },
});

// Public booking: create customer + booking + mark slot TAKEN
export const createPublicBooking = mutation({
  args: {
    slotId: v.id("timeSlots"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    whatsapp: v.optional(v.string()),
    notes: v.optional(v.string()),
    serviceId: v.optional(v.id("services")),
  },
  handler: async (ctx, args) => {
    const slot = await ctx.db.get(args.slotId);
    if (!slot || slot.status !== "AVAILABLE") {
      throw new Error("This slot is no longer available.");
    }

    const customerId = await ctx.db.insert("customers", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      whatsapp: args.whatsapp,
      notes: args.notes,
    });

    const bookingId = await ctx.db.insert("bookings", {
      customerId,
      timeSlotId: args.slotId,
      serviceIds: args.serviceId ? [args.serviceId] : [],
      totalPrice: 60,
      status: "CONFIRMED",
      receiptGenerated: false,
    });

    await ctx.db.patch(args.slotId, { status: "TAKEN", bookingId });

    return bookingId;
  },
});
