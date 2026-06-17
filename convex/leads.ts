import { mutation } from "./_generated/server";
import { v } from "convex/values";

function requiredText(value: string, fieldName: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${fieldName} é obrigatório.`);
  }
  return trimmed;
}

function optionalText(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const createLead = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    if (!args.consent) {
      throw new Error("Autorize o contato para solicitar orçamento.");
    }

    const id = await ctx.db.insert("leadRequests", {
      name: requiredText(args.name, "Nome"),
      whatsapp: requiredText(args.whatsapp, "WhatsApp"),
      city: requiredText(args.city, "Cidade"),
      neighborhood: requiredText(args.neighborhood, "Bairro"),
      timing: requiredText(args.timing, "Prazo"),
      property: requiredText(args.property, "Tipo de imóvel"),
      consent: args.consent,
      selectedModel: requiredText(args.selectedModel, "Modelo escolhido"),
      selectedStyles: args.selectedStyles.map((style) => style.trim()).filter(Boolean),
      description: optionalText(args.description),
      source: requiredText(args.source, "Origem"),
      pagePath: optionalText(args.pagePath),
      photoAttached: args.photoAttached,
      simulationId: args.simulationId,
      selectedGeneratedImageId: args.selectedGeneratedImageId,
      createdAt: Date.now(),
    });

    return { id };
  },
});

export const createPartnerLead = mutation({
  args: {
    company: v.string(),
    owner: v.string(),
    whatsapp: v.string(),
    city: v.string(),
    serviceType: v.string(),
    serviceRegion: v.string(),
    volume: v.optional(v.string()),
    source: v.string(),
    pagePath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const partnerRequest = {
      company: requiredText(args.company, "Nome da empresa"),
      owner: requiredText(args.owner, "Responsável"),
      whatsapp: requiredText(args.whatsapp, "WhatsApp"),
      city: requiredText(args.city, "Cidade/Estado"),
      serviceType: requiredText(args.serviceType, "Tipo de serviço"),
      serviceRegion: requiredText(args.serviceRegion, "Região atendida"),
      source: requiredText(args.source, "Origem"),
      pagePath: optionalText(args.pagePath),
      createdAt: Date.now(),
    };
    const volume = optionalText(args.volume);
    const id = await ctx.db.insert(
      "partnerRequests",
      volume ? { ...partnerRequest, volume } : partnerRequest,
    );

    return { id };
  },
});
