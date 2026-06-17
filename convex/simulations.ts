import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { internalMutation, query, QueryCtx } from "./_generated/server";

const DEFAULT_LIMIT = 30;

function requiredAdminSecret(value: string) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) {
    return "A senha do admin ainda não foi configurada.";
  }
  if (value !== expected) {
    return "Senha do admin inválida.";
  }
  return null;
}

async function imageUrl(ctx: QueryCtx, storageId?: Id<"_storage">) {
  if (!storageId) return null;
  return await ctx.storage.getUrl(storageId);
}

async function serializeSimulation(ctx: QueryCtx, simulation: Doc<"simulations">) {
  return {
    ...simulation,
    originalImageUrl: await imageUrl(ctx, simulation.originalImageId),
    generatedImages: await Promise.all(
      simulation.generatedImages.map(async (image: any) => ({
        ...image,
        url: await imageUrl(ctx, image.storageId),
      })),
    ),
  };
}

export const createSimulation = internalMutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("simulations", {
      ...args,
      createdAt: Date.now(),
    });
    return { id };
  },
});

export const adminOverview = query({
  args: {
    adminSecret: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authError = requiredAdminSecret(args.adminSecret);
    if (authError) {
      return {
        ok: false,
        error: authError,
        leads: [],
        partners: [],
        simulations: [],
      };
    }

    const limit = Math.min(Math.max(args.limit ?? DEFAULT_LIMIT, 1), 80);

    const [leads, partners, simulations, deliveries] = await Promise.all([
      ctx.db.query("leadRequests").withIndex("by_createdAt").order("desc").take(limit),
      ctx.db.query("partnerRequests").withIndex("by_createdAt").order("desc").take(limit),
      ctx.db.query("simulations").withIndex("by_createdAt").order("desc").take(limit),
      ctx.db.query("leadDeliveries").withIndex("by_createdAt").order("desc").take(160),
    ]);

    const partnersWithStats = await Promise.all(partners.map(async (partner) => {
      const stats = await ctx.db
        .query("partnerLeadStats")
        .withIndex("by_partnerId", (q) => q.eq("partnerId", partner._id))
        .unique();

      return {
        ...partner,
        deliveryCount: stats?.deliveryCount || 0,
        lastDeliveredAt: stats?.lastDeliveredAt || null,
      };
    }));

    const simulationMap = new Map(
      (await Promise.all(simulations.map((simulation) => serializeSimulation(ctx, simulation))))
        .map((simulation) => [simulation._id, simulation]),
    );

    const leadsWithImages = await Promise.all(leads.map(async (lead) => {
      const existingSimulation = lead.simulationId ? simulationMap.get(lead.simulationId) : null;
      const simulation = existingSimulation || (lead.simulationId
        ? await ctx.db.get(lead.simulationId).then((item) => item ? serializeSimulation(ctx, item) : null)
        : null);

      return {
        ...lead,
        selectedGeneratedImageUrl: await imageUrl(ctx, lead.selectedGeneratedImageId),
        deliveries: deliveries.filter((delivery) => delivery.leadId === lead._id),
        simulation,
      };
    }));

    return {
      ok: true,
      error: null,
      leads: leadsWithImages,
      partners: partnersWithStats,
      deliveries,
      simulations: Array.from(simulationMap.values()),
    };
  },
});
