import { Hero } from '@/types';

export async function fetchHeroes(): Promise<Hero[]> {
  try {
    console.log('🔄 Fetching heroes from local JSON...');
    
    // Fetch from local JSON file
    const response = await fetch('/heroes.json', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load heroes.json: ${response.status}`);
    }
    
    const heroes = await response.json();
    
    console.log(`✅ Successfully loaded ${heroes.length} heroes from local file`);
    
    return heroes;
  } catch (error) {
    console.error('❌ Failed to fetch heroes:', error);
    throw error;
  }
}