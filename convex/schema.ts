import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  services: defineTable({
    name: v.string(),
    price: v.number(),
    durationMins: v.number(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
  }),

  timeSlots: defineTable({
    date: v.string(), // YYYY-MM-DD
    startTime: v.string(), // HH:mm
    endTime: v.string(), // HH:mm
    status: v.union(v.literal("AVAILABLE"), v.literal("TAKEN")),
    bookingId: v.optional(v.id("bookings")),
  }).index("by_date", ["date"]),

  customers: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    whatsapp: v.optional(v.string()),
    notes: v.optional(v.string()),
  }),

  bookings: defineTable({
    customerId: v.id("customers"),
    timeSlotId: v.id("timeSlots"),
    serviceIds: v.array(v.id("services")),
    totalPrice: v.number(),
    status: v.union(v.literal("PENDING"), v.literal("CONFIRMED"), v.literal("COMPLETED"), v.literal("CANCELLED")),
    bookingLinkToken: v.optional(v.string()),
    receiptGenerated: v.boolean(),
  }),

  payments: defineTable({
    bookingId: v.id("bookings"),
    amount: v.number(),
    method: v.string(), // "Bank Transfer", "Cash", etc.
    receiptUrl: v.optional(v.string()),
    verifiedAt: v.optional(v.number()),
  }),

  admin_settings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),
});
