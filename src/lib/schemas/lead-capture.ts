import { z } from 'zod';

// Regex for Moroccan phone numbers (06, 07, or +212) or basic international validation
const phoneRegex = /^(?:(?:(?:\+|00)212[\s]?(?:[\s]?\()?0?(?:\))?[\s]?[5-7](?:[\s]?\d){8})|(?:0[5-7](?:[\s]?\d){8})|(?:\+\d{1,3}\s?\d{6,14}))$/;

export const leadCaptureSchema = z.object({
  quartier: z.enum([
    'Atlas', 
    'Champs de Course', 
    "Route d'Immouzzer", 
    'Médina - Bab Boujloud', 
    'Médina - Batha', 
    'Autre'
  ]),
  propertyType: z.enum(['appartement', 'riad', 'studio', 'villa']),
  bedrooms: z.number().min(1).max(10),
  phone: z.string().regex(phoneRegex, {
    message: "Numéro de téléphone invalide. Veuillez utiliser le format marocain (ex: 06... ou +2126...) ou international."
  }),
  ownerName: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom est trop long")
    // Basic XSS sanitization check (rejects <tag> structures)
    .refine((val) => !/<[^>]*>/g.test(val), {
      message: "Les caractères spéciaux de type balise HTML sont interdits."
    }),
});

export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;
