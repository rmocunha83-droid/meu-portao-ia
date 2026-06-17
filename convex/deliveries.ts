import { v } from "convex/values";
import { mutation } from "./_generated/server";

function adminAuthError(value: string) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) {
    return "A senha do admin ainda não foi configurada.";
  }
  if (value !== expected) {
    return "Senha do admin inválida.";
  }
  return null;
}

export const createLeadDelivery = mutation({
  args: {
    adminSecret: v.string(),
    leadId: v.id("leadRequests"),
    partnerId: v.id("partnerRequests"),
    channel: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const authError = adminAuthError(args.adminSecret);
    if (authError) {
      throw new Error(authError);
    }

    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      throw new Error("Lead não encontrado.");
    }

    const partner = await ctx.db.get(args.partnerId);
    if (!partner) {
      throw new Error("Parceiro não encontrado.");
    }

    const createdAt = Date.now();
    const id = await ctx.db.insert("leadDeliveries", {
      leadId: args.leadId,
      partnerId: args.partnerId,
      partnerCompany: partner.company,
      partnerWhatsapp: partner.whatsapp,
      channel: args.channel.trim() || "whatsapp",
      message: args.message.trim(),
      createdAt,
    });

    const existingStats = await ctx.db
      .query("partnerLeadStats")
      .withIndex("by_partnerId", (q) => q.eq("partnerId", args.partnerId))
      .unique();

    if (existingStats) {
      await ctx.db.patch(existingStats._id, {
        deliveryCount: existingStats.deliveryCount + 1,
        lastDeliveredAt: createdAt,
      });
    } else {
      await ctx.db.insert("partnerLeadStats", {
        partnerId: args.partnerId,
        deliveryCount: 1,
        lastDeliveredAt: createdAt,
      });
    }

    return { id };
  },
});
