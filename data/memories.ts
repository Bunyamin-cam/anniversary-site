import photos from './photos.json';
import { stableShuffle } from '@/lib/stable-shuffle';
export type Memory = {
  id: string; title: string; date: string; description: string;
  photo: string; thumbnail: string; width: number; height: number; sourceFile: string;
  tone: 'blue';
};
// Shuffled once at module initialization, with the same seed on server and client.
export const memories: Memory[] = stableShuffle(photos).map((photo) => ({
  ...photo, tone: 'blue',
}));
