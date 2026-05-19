import { LatLngBoundsExpression } from 'leaflet';

// Tago Municipality center, Surigao del Sur
export const TAGO_CENTER: [number, number] = [8.975, 126.165];

// Bounds covering all 24 barangays of Tago — extended south to include
// Caras-an (8.8875) and Layog (8.8801), the southernmost barangays
export const TAGO_BOUNDS: LatLngBoundsExpression = [
[8.85, 126.05], // Southwest corner — covers Layog/Caras-an
[9.06, 126.27] // Northeast corner — covers Victoria/Purisima/Jubang
];

export const TAGO_MIN_ZOOM = 11;
export const TAGO_MAX_ZOOM = 19;

// Standard OpenStreetMap tiles
export const MAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MAP_TILE_ATTRIBUTION =
'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Official Barangays of Tago, Surigao del Sur with real PhilAtlas coordinates
export const TAGO_BARANGAYS: {name: string;lat: number;lng: number;}[] = [
{ name: 'Alba', lat: 8.9676, lng: 126.1338 },
{ name: 'Anahao Bag-o', lat: 8.9630, lng: 126.1608 },
{ name: 'Anahao Daan', lat: 8.9625, lng: 126.1723 },
{ name: 'Badong', lat: 8.9534, lng: 126.1027 },
{ name: 'Bajao', lat: 8.9852, lng: 126.1536 },
{ name: 'Bangsud', lat: 8.9591, lng: 126.1459 },
{ name: 'Cabangahan', lat: 8.9601, lng: 126.0946 },
{ name: 'Cagdapao', lat: 8.9950, lng: 126.1558 },
{ name: 'Camagong', lat: 9.0103, lng: 126.1952 },
{ name: 'Caras-an', lat: 8.8875, lng: 126.0834 },
{ name: 'Cayale', lat: 8.9837, lng: 126.1190 },
{ name: 'Dayo-an', lat: 9.0171, lng: 126.1792 },
{ name: 'Gamut', lat: 9.0072, lng: 126.1681 },
{ name: 'Jubang', lat: 8.9830, lng: 126.2268 },
{ name: 'Kinabigtasan', lat: 8.9783, lng: 126.1776 },
{ name: 'Layog', lat: 8.8801, lng: 126.1232 },
{ name: 'Lindoy', lat: 8.9451, lng: 126.1346 },
{ name: 'Mercedes', lat: 9.0230, lng: 126.2180 },
{ name: 'Purisima', lat: 9.0198, lng: 126.2321 },
{ name: 'Sumo-sumo', lat: 8.9771, lng: 126.2384 },
{ name: 'Umbay', lat: 8.9873, lng: 126.2362 },
{ name: 'Unaban', lat: 8.9938, lng: 126.1892 },
{ name: 'Unidos', lat: 8.9839, lng: 126.2013 },
{ name: 'Victoria', lat: 9.0336, lng: 126.2094 }];


// Approximate polygon tracing the Tago municipality boundary (clockwise).
// This replaces the simple bounding-box check so that neighbouring-municipality
// barangays (e.g. Cantilan's Maitom, Maticdom, San Isidro, San Jose to the
// north) are correctly excluded even though they fall inside the rectangular
// bounding box.
const TAGO_POLYGON: [number, number][] = [
  [9.020, 126.047], // NW — west of Cabangahan
  [9.038, 126.075], // N-NW
  [9.038, 126.145], // N (flat edge — Tago / Cantilan boundary)
  [9.038, 126.215], // N (just above Victoria at 9.0336)
  [9.028, 126.250], // NE — between Victoria and Purisima
  [9.018, 126.270], // NE coast near Purisima
  [9.000, 126.280], // E coast
  [8.980, 126.275], // E coast
  [8.958, 126.265], // SE coast
  [8.933, 126.248], // SE near Jubang / Sumo-sumo
  [8.910, 126.218], // S-SE
  [8.890, 126.190], // S — Tago / Madrid boundary area
  [8.876, 126.158], // S
  [8.874, 126.118], // SW
  [8.869, 126.098], // SW — Layog area (southernmost barangay 8.8801)
  [8.874, 126.067], // W-SW — Caras-an area
  [8.900, 126.041], // W
  [8.950, 126.039], // W
  [9.000, 126.042], // W
];

// Ray-casting point-in-polygon — accurate for the small scale of a municipality
function pointInPolygon(lat: number, lng: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [lati, lngi] = poly[i];
    const [latj, lngj] = poly[j];
    if ((lati > lat) !== (latj > lat) &&
        lng < ((lngj - lngi) * (lat - lati)) / (latj - lati) + lngi) {
      inside = !inside;
    }
  }
  return inside;
}

// Check if a coordinate is within Tago Municipality bounds
export function isWithinTago(lat: number, lng: number): boolean {
  return pointInPolygon(lat, lng, TAGO_POLYGON);
}

// Find the closest barangay to a given coordinate (Euclidean — fine for a small area)
export function findNearestBarangay(lat: number, lng: number): string | null {
  if (TAGO_BARANGAYS.length === 0) return null;
  let nearest = TAGO_BARANGAYS[0];
  let minDist = Number.POSITIVE_INFINITY;
  for (const b of TAGO_BARANGAYS) {
    const d = (b.lat - lat) ** 2 + (b.lng - lng) ** 2;
    if (d < minDist) {
      minDist = d;
      nearest = b;
    }
  }
  return nearest.name;
}