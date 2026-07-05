// Ported verbatim from project/Your Letter.dc.html (`scenes` array).
export const scenes = [
  { names: { id: 'Siang Cerah', en: 'Sunny Day', kr: '맑은 낮' }, emoji: '☀️', skyTop: '#8FD3FF', skyMid: '#BEE7FF', skyBottom: '#E9F8EE', hasSun: true, sunColor: '#FFD84D', sunTop: '14%', sunLeft: '72%', sunSize: 88, hasClouds: true, cloudColor: '#FFFFFF', hasHills: true, hillColor: '#66B86E', hillColor2: '#8ED08A', hasFlowers: true, flowerColor: '#FF8FB1', hasSea: false, hasMoon: false, moonColor: '#FBE9B0', hasStars: false },
  { names: { id: 'Senja', en: 'Sunset', kr: '노을' }, emoji: '🌅', skyTop: '#6A5B9A', skyMid: '#FF9E7A', skyBottom: '#FFD59E', hasSun: true, sunColor: '#FF7E5F', sunTop: '46%', sunLeft: '40%', sunSize: 120, hasClouds: true, cloudColor: '#FFC9A6', hasSea: true, seaColor: '#C97FA0', hasHills: false, hillColor: '#66B86E', hillColor2: '#8ED08A', hasFlowers: false, flowerColor: '#FF8FB1', hasMoon: false, moonColor: '#FBE9B0', hasStars: false },
  { names: { id: 'Tepi Laut', en: 'Seaside', kr: '바닷가' }, emoji: '🌊', skyTop: '#7FC5E8', skyMid: '#B7E4F0', skyBottom: '#DFF6F7', hasSun: true, sunColor: '#FFE08A', sunTop: '16%', sunLeft: '20%', sunSize: 70, hasClouds: true, cloudColor: '#FFFFFF', hasSea: true, seaColor: '#3EA7C4', hasHills: false, hillColor: '#66B86E', hillColor2: '#8ED08A', hasFlowers: false, flowerColor: '#FF8FB1', hasMoon: false, moonColor: '#FBE9B0', hasStars: false },
  { names: { id: 'Taman', en: 'Garden', kr: '정원' }, emoji: '🌷', skyTop: '#BDE7FF', skyMid: '#E4F6E9', skyBottom: '#F4FBEF', hasSun: true, sunColor: '#FFD84D', sunTop: '13%', sunLeft: '74%', sunSize: 78, hasClouds: true, cloudColor: '#FFFFFF', hasHills: true, hillColor: '#5FB56B', hillColor2: '#88CE86', hasFlowers: true, flowerColor: '#FF7EA8', hasSea: false, hasMoon: false, moonColor: '#FBE9B0', hasStars: false },
  { names: { id: 'Malam Berbintang', en: 'Starry Night', kr: '별이 빛나는 밤' }, emoji: '🌙', skyTop: '#241D46', skyMid: '#3A2E63', skyBottom: '#5B4A86', hasMoon: true, moonColor: '#FBE9B0', hasStars: true, hasHills: true, hillColor: '#2A2350', hillColor2: '#3B3168', hasSun: false, sunColor: '#FFD84D', sunTop: '14%', sunLeft: '72%', sunSize: 80, hasClouds: false, cloudColor: '#FFFFFF', hasFlowers: false, flowerColor: '#FF8FB1', hasSea: false },
  { names: { id: 'Fajar', en: 'Dawn', kr: '새벽' }, emoji: '🌸', skyTop: '#FFC1D6', skyMid: '#FFE0D0', skyBottom: '#FFF4D6', hasSun: true, sunColor: '#FFB27A', sunTop: '30%', sunLeft: '64%', sunSize: 96, hasClouds: true, cloudColor: '#FFF3EC', hasHills: true, hillColor: '#E79BB4', hillColor2: '#F3B7CB', hasFlowers: false, flowerColor: '#FF8FB1', hasSea: false, hasMoon: false, moonColor: '#FBE9B0', hasStars: false },
];

export function makeScene(index, lang) {
  const s = scenes[index] ?? scenes[0];
  return {
    ...s,
    name: s.names[lang],
    skyGrad: `linear-gradient(180deg, ${s.skyTop} 0%, ${s.skyMid} 55%, ${s.skyBottom} 100%)`,
  };
}
