import type { UnitSystem } from './dropEngine';

const M_TO_FT = 3.280839895;
const M_TO_IN = 39.3700787;

/** Length for display: `2.24 m` / `7 ft 4 in`. */
export function formatLength(metres: number, unit: UnitSystem): string {
  if (!isFinite(metres)) {
    return '-';
  }
  if (unit === 'imperial') {
    const totalInches = metres * M_TO_IN;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches - feet * 12);
    if (feet <= 0) {
      return `${Math.round(totalInches)} in`;
    }
    return `${feet} ft ${inches} in`;
  }
  return `${metres.toFixed(2)} m`;
}

/** Short length used inside tight cells. */
export function formatShort(metres: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    return `${Math.round(metres * M_TO_IN)}"`;
  }
  return `${metres.toFixed(2)}`;
}

export function formatArea(squareMetres: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    return `${Math.round(squareMetres * M_TO_FT * M_TO_FT)} sq ft`;
  }
  return `${squareMetres.toFixed(1)} m2`;
}

export function unitSuffix(unit: UnitSystem): string {
  return unit === 'imperial' ? 'ft' : 'm';
}

/** Field value shown in a NumberField for the active unit system. */
export function toFieldValue(metres: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    return (metres * M_TO_FT).toFixed(2);
  }
  return metres.toFixed(2);
}

export function fromFieldValue(raw: string, unit: UnitSystem): number {
  const parsed = parseFloat(raw.replace(',', '.'));
  if (!isFinite(parsed)) {
    return 0;
  }
  return unit === 'imperial' ? parsed / M_TO_FT : parsed;
}
