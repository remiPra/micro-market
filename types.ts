export interface MicroNiche {
  keyword: string;
  targetAudience: string;
  demandScore: number; // 1-10
  competitionScore: number; // 1-10 (Lower is better for the user, but API might return raw competition level)
  opportunityScore: number; // 1-100
  reasoning: string;
  suggestedChannel: 'Amazon' | 'Google' | 'Mix';
  projectedGrowth: number; // percentage
}

export interface SearchParams {
  query: string;
  platform: 'amazon' | 'google' | 'mix';
}

export interface UserQuota {
  used: number;
  limit: number;
  isPro: boolean;
}