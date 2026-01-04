import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MicroNiche, SearchParams } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const nicheSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    keyword: { type: Type.STRING, description: "Le mot-clé spécifique longue traîne (en français ou anglais selon le marché)." },
    targetAudience: { type: Type.STRING, description: "Qui achète ça ? (En français)" },
    demandScore: { type: Type.INTEGER, description: "Score de 1 à 10 indiquant le volume de recherche/demande." },
    competitionScore: { type: Type.INTEGER, description: "Score de 1 à 10 indiquant la saturation (10 = très saturé)." },
    opportunityScore: { type: Type.INTEGER, description: "Score calculé de 1 à 100 indiquant le potentiel de réussite." },
    reasoning: { type: Type.STRING, description: "Justification business en 2 phrases (En français)." },
    suggestedChannel: { type: Type.STRING, enum: ["Amazon", "Google", "Mix"] },
    projectedGrowth: { type: Type.INTEGER, description: "Croissance estimée en pourcentage sur 6 mois." }
  },
  required: ["keyword", "targetAudience", "demandScore", "competitionScore", "opportunityScore", "reasoning", "suggestedChannel", "projectedGrowth"]
};

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: nicheSchema
};

// Stratégies aléatoires pour forcer la diversité des réponses
const STRATEGIES = [
  "FOCUS_LUXE_PREMIUM: Cherche uniquement des produits à forte marge, des matériaux nobles ou des solutions pour clients fortunés.",
  "FOCUS_DOULEUR_URGENCE: Cherche des solutions à des problèmes physiques, psychologiques ou techniques urgents (le client doit acheter maintenant).",
  "FOCUS_RECURRENCE: Cherche des produits consommables ou à abonnement (savons, recharges, carnets, nourriture spécifique).",
  "FOCUS_TECH_GADGET: Cherche des accessoires innovants pour accompagner les nouvelles technologies (VR, Drones, Télétravail).",
  "FOCUS_COMMUNAUTE_PASSION: Vise des micro-hobbies très spécifiques (ex: ne pas dire 'Pêche', dire 'Pêche à la mouche en rivière').",
  "FOCUS_CONTRE_INTUITIF: Cherche l'inverse de la tendance actuelle. Si tout le monde fait du 'Compliqué', cherche le 'Minimaliste'."
];

export const analyzeMarket = async (params: SearchParams): Promise<MicroNiche[]> => {
  const model = "gemini-3-flash-preview";

  // Sélectionner une stratégie aléatoire pour cette requête spécifique
  const randomStrategy = STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)];

  const prompt = `
    Rôle : Tu es un Système Multi-Agents (SMA) d'élite.
    
    ORDRE DE MISSION DU CHEF DE PROJET :
    Pour cette analyse du mot clé "${params.query}", tu DOIS adopter la stratégie suivante :
    👉 ${randomStrategy}

    Ne me donne PAS les résultats génériques habituels. Applique cette stratégie à l'extrême.

    Tâche : Analyse le marché (${params.platform}).
    Identifie 5 à 8 micro-niches qui correspondent STRICTEMENT à la stratégie imposée ci-dessus.

    Instructions de notation :
    - 'competitionScore' : Sois sévère. Si c'est plein de produits chinois génériques, mets 9 ou 10.
    - 'demandScore' : Cherche les signaux faibles (demande montante mais offre faible).
    
    IMPORTANT : Réponds EXCLUSIVEMENT en FRANÇAIS.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1.1, // Température élevée pour plus de créativité et de variété
        topP: 0.95,
        systemInstruction: "Tu es un expert radical et créatif. Tu détestes les idées reçues et les produits ennuyeux."
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MicroNiche[];
    }
    return [];
  } catch (error) {
    console.error("Market Analysis Failed:", error);
    throw error;
  }
};