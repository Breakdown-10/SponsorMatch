import { EventInput } from '../types.js';

export interface SampleEventDefinition {
  id: string;
  name: string;
  tagline: string;
  input: EventInput;
  genre: string;
  description: string;
}

export const SAMPLE_EVENTS: SampleEventDefinition[] = [
  {
    id: 'sonar-barcelona',
    name: 'Sónar Barcelona 2026',
    tagline: 'Advanced Music & Creative Technology',
    genre: 'Electronic, Modular Synth, Creative AI',
    description: 'Electronic music, digital art and innovation across multiple venues in Barcelona\'s Fira Gran Via.',
    input: {
      eventName: 'Sónar Barcelona 2026',
      entities: ['Bicep', 'Aphex Twin'],
      venue: 'Fira Gran Via',
      city: 'Barcelona, Spain',
      budgetTier: 'PREMIUM',
      excludedCategories: [],
      excludedBrands: []
    }
  },
  {
    id: 'desert-daze',
    name: 'Desert Daze Festival 2026',
    tagline: 'Psychedelic Rock & Avant-Garde Arts',
    genre: 'Neo-Psychedelia, Krautrock, Desert Art',
    description: 'Iconic independent music gathering at Moreno Beach featuring mind-bending visual arts, analog synthesizers, and lakeside camping.',
    input: {
      eventName: 'Desert Daze Festival 2026',
      entities: ['The Black Angels', 'King Gizzard & The Lizard Wizard'],
      venue: 'Lake Perris State Recreation Area',
      city: 'Lake Perris, CA',
      budgetTier: 'MID',
      excludedCategories: ['Energy Drink'],
      excludedBrands: []
    }
  },
  {
    id: 'chicago-marathon',
    name: 'Bank of America Chicago Marathon 2026',
    tagline: 'World Marathon Major & Endurance Culture',
    genre: 'Athletics, Distance Running, Community Wellness',
    description: 'Premier global road race uniting 50,000 international runners across 29 Chicago neighborhoods with high-intensity community support.',
    input: {
      eventName: 'Chicago Marathon 2026',
      entities: ['Eliud Kipchoge'],
      venue: 'Grant Park',
      city: 'Chicago, IL',
      budgetTier: 'PREMIUM',
      excludedCategories: ['Fast Food'],
      excludedBrands: []
    }
  }
];
