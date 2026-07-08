export interface ReviewLog {
  id: string;
  reviewText: string;
  rating: number;
  sentimentLabel: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  fakeScore: number;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  catalogImage: string;
  creatorId: string;
  launchStatus: 'Launched' | 'Upcoming';
  price?: number;
  category?: string;
  analytics?: {
    totalReviews: number;
    sentimentScore: number;
    integrityScore: number;
    positiveTakeaways: string[];
    negativeTakeaways: string[];
    aspectBreakdown: {
      quality: number;
      performance: number;
      durability: number;
      price: number;
      "customer service": number;
      [key: string]: number;
    };
    sentimentDistribution: {
      positive: number;
      neutral: number;
      negative: number;
    };
    recentReviews: ReviewLog[];
  };
}

export type UserRole = 'reviewer' | 'creator';

export type CurrentPage = 
  | 'landing' 
  | 'login' 
  | 'reviewer-dashboard' 
  | 'review-form' 
  | 'creator-dashboard' 
  | 'creator-analytics';