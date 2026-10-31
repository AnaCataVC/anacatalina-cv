import type { APIRoute } from 'astro';
import { cvData } from '../data/cv';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(cvData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
