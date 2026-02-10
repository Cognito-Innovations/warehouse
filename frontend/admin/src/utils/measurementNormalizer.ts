import { formatDimensions } from './formatDimenssion';

export interface NormalizedMeasurement {
  pieceNumber: number;
  weight: string;
  volumetricWeight: string | null;
  dimensions: string | null;
  hasMeasurements: boolean;
}

export function normalizeMeasurements(shipments: any): NormalizedMeasurement[] {
  if (!shipments) return [];

  const pieces = shipments.pieces || [];

  if (pieces.length === 0 && shipments.total_weight) {
    const hasMeasurements = Boolean(shipments.total_volumetric_weight);

    let dimensions: string | null = null;
    if (shipments.length && shipments.width && shipments.height) {
      dimensions = `(${formatDimensions(shipments.length)}cm x ${formatDimensions(
        shipments.width
      )}cm x ${formatDimensions(shipments.height)}cm)`;
    }

    return [
      {
        pieceNumber: 1,
        weight: `${shipments.total_weight} Kg`,
        volumetricWeight: shipments.total_volumetric_weight
          ? parseFloat(shipments.total_volumetric_weight).toFixed(2)
          : null,
        dimensions,
        hasMeasurements,
      },
    ];
  }

  return pieces.map((piece: any) => ({
    pieceNumber: piece.piece_number,
    weight: `${piece.weight} Kg`,
    volumetricWeight: parseFloat(piece.volumetric_weight).toFixed(2),
    dimensions: `(${formatDimensions(piece.length)}cm x ${formatDimensions(
      piece.width
    )}cm x ${formatDimensions(piece.height)}cm)`,
    hasMeasurements: true,
  }));
}