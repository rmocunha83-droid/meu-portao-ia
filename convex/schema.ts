import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leadRequests: defineTable({
    name: v.string(),
    whatsapp: v.string(),
    city: v.string(),
    neighborhood: v.string(),
    timing: v.string(),
    property: v.string(),
    consent: v.boolean(),
    selectedModel: v.string(),
    selectedStyles: v.array(v.string()),
    description: v.optional(v.string()),
    source: v.string(),
    pagePath: v.optional(v.string()),
    photoAttached: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_city_and_createdAt", ["city", "createdAt"]),
  partnerRequests: defineTable({
    company: v.string(),
    owner: v.string(),
    whatsapp: v.string(),
    city: v.string(),
    serviceType: v.optional(v.string()),
    serviceRegion: v.optional(v.string()),
    volume: v.optional(v.string()),
    source: v.string(),
    pagePath: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_city_and_createdAt", ["city", "createdAt"]),
});
