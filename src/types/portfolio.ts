export interface PortfolioData {
  id: string;
  title: string;
  description: string;
  theme: Theme;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background?: string;
    text?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  id?: string;
  name?: string;
}

export interface ExternalPortfolioItem {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  tags: string[];
  url: string;
  published: boolean;
  featured: boolean;
} 