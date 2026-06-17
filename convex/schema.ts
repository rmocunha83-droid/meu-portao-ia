import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  simulations: defineTable({
    originalImageId: v.id("_storage"),
    originalFileName: v.string(),
    originalContentType: v.string(),
    selectedStyles: v.array(v.string()),
    description: v.optional(v.string()),
    generatedImages: v.array(v.object({
      storageId: v.id("_storage"),
      name: v.string(),
      description: v.string(),
      revisedPrompt: v.optional(v.string()),
    })),
    source: v.string(),
    pagePath: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"]),
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
    simulationId: v.optional(v.id("simulations")),
    selectedGeneratedImageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_city_and_createdAt", ["city", "createdAt"]),
  leadDeliveries: defineTable({
    leadId: v.id("leadRequests"),
    partnerId: v.id("partnerRequests"),
    partnerCompany: v.string(),
    partnerWhatsapp: v.string(),
    channel: v.string(),
    message: v.string(),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_lead_and_createdAt", ["leadId", "createdAt"])
    .index("by_partner_and_createdAt", ["partnerId", "createdAt"]),
  partnerLeadStats: defineTable({
    partnerId: v.id("partnerRequests"),
    deliveryCount: v.number(),
    lastDeliveredAt: v.optional(v.number()),
  })
    .index("by_partnerId", ["partnerId"]),
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
