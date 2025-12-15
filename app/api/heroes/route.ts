import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try the external API first
    const response = await fetch('https://mlbb-stats.ridwaanhall.com/api/hero-list/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('External API failed, using fallback data:', error);
    
    // Return mock data if external API fails
    return NextResponse.json({
      code: 0,
      message: "OK",
      data: {
        records: [
          { data: { hero_id: 1, hero: { data: { name: "Miya", head: "https://via.placeholder.com/100?text=Miya" } } } },
          { data: { hero_id: 2, hero: { data: { name: "Balmond", head: "https://via.placeholder.com/100?text=Balmond" } } } },
          { data: { hero_id: 3, hero: { data: { name: "Saber", head: "https://via.placeholder.com/100?text=Saber" } } } },
          { data: { hero_id: 4, hero: { data: { name: "Alice", head: "https://via.placeholder.com/100?text=Alice" } } } },
          { data: { hero_id: 5, hero: { data: { name: "Nana", head: "https://via.placeholder.com/100?text=Nana" } } } },
          { data: { hero_id: 6, hero: { data: { name: "Tigreal", head: "https://via.placeholder.com/100?text=Tigreal" } } } },
          { data: { hero_id: 7, hero: { data: { name: "Alucard", head: "https://via.placeholder.com/100?text=Alucard" } } } },
          { data: { hero_id: 8, hero: { data: { name: "Karina", head: "https://via.placeholder.com/100?text=Karina" } } } },
          { data: { hero_id: 9, hero: { data: { name: "Akai", head: "https://via.placeholder.com/100?text=Akai" } } } },
          { data: { hero_id: 10, hero: { data: { name: "Franco", head: "https://via.placeholder.com/100?text=Franco" } } } },
          { data: { hero_id: 11, hero: { data: { name: "Bane", head: "https://via.placeholder.com/100?text=Bane" } } } },
          { data: { hero_id: 12, hero: { data: { name: "Bruno", head: "https://via.placeholder.com/100?text=Bruno" } } } },
          { data: { hero_id: 13, hero: { data: { name: "Clint", head: "https://via.placeholder.com/100?text=Clint" } } } },
          { data: { hero_id: 14, hero: { data: { name: "Rafaela", head: "https://via.placeholder.com/100?text=Rafaela" } } } },
          { data: { hero_id: 15, hero: { data: { name: "Eudora", head: "https://via.placeholder.com/100?text=Eudora" } } } },
          { data: { hero_id: 16, hero: { data: { name: "Zilong", head: "https://via.placeholder.com/100?text=Zilong" } } } },
          { data: { hero_id: 17, hero: { data: { name: "Fanny", head: "https://via.placeholder.com/100?text=Fanny" } } } },
          { data: { hero_id: 18, hero: { data: { name: "Layla", head: "https://via.placeholder.com/100?text=Layla" } } } },
          { data: { hero_id: 19, hero: { data: { name: "Minotaur", head: "https://via.placeholder.com/100?text=Minotaur" } } } },
          { data: { hero_id: 20, hero: { data: { name: "Lolita", head: "https://via.placeholder.com/100?text=Lolita" } } } },
          { data: { hero_id: 21, hero: { data: { name: "Hayabusa", head: "https://via.placeholder.com/100?text=Hayabusa" } } } },
          { data: { hero_id: 22, hero: { data: { name: "Freya", head: "https://via.placeholder.com/100?text=Freya" } } } },
          { data: { hero_id: 23, hero: { data: { name: "Gord", head: "https://via.placeholder.com/100?text=Gord" } } } },
          { data: { hero_id: 24, hero: { data: { name: "Natalia", head: "https://via.placeholder.com/100?text=Natalia" } } } },
          { data: { hero_id: 25, hero: { data: { name: "Kagura", head: "https://via.placeholder.com/100?text=Kagura" } } } },
          { data: { hero_id: 26, hero: { data: { name: "Chou", head: "https://via.placeholder.com/100?text=Chou" } } } },
          { data: { hero_id: 27, hero: { data: { name: "Sun", head: "https://via.placeholder.com/100?text=Sun" } } } },
          { data: { hero_id: 28, hero: { data: { name: "Alpha", head: "https://via.placeholder.com/100?text=Alpha" } } } },
          { data: { hero_id: 29, hero: { data: { name: "Ruby", head: "https://via.placeholder.com/100?text=Ruby" } } } },
          { data: { hero_id: 30, hero: { data: { name: "Yi Sun-shin", head: "https://via.placeholder.com/100?text=YSS" } } } },
        ],
        total: 30
      }
    });
  }
}