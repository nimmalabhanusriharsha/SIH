import React from 'react';

// Generates a deterministic, valid-looking matrix pattern for QR visual representation
export const QRCodeSVG = ({ value, size = 200, className = '' }) => {
  // Deterministic 25x25 matrix generator based on input string hash
  const gridSize = 25;
  
  // Calculate simple hash from string
  const getHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const strValue = typeof value === 'string' ? value : JSON.stringify(value);
  const baseHash = getHash(strValue);

  // 25x25 matrix
  const matrix = Array(gridSize).fill(0).map(() => Array(gridSize).fill(false));

  // 1. Add standard QR finder patterns in 3 corners (7x7 squares)
  const drawFinderPattern = (startR, startC) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // Outer square
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)      // Inner square
        ) {
          matrix[startR + r][startC + c] = true;
        }
      }
    }
  };

  drawFinderPattern(0, 0);                 // Top-Left
  drawFinderPattern(0, gridSize - 7);       // Top-Right
  drawFinderPattern(gridSize - 7, 0);       // Bottom-Left

  // 2. Add alignment pattern at (16, 16)
  const drawAlignment = (startR, startC) => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
          matrix[startR + r][startC + c] = true;
        }
      }
    }
  };
  drawAlignment(16, 16);

  // 3. Add timing lines (row 6 and col 6)
  for (let i = 8; i < gridSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 4. Fill remaining cells deterministically with data bits
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Skip finder patterns, separators, and alignment pattern
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= gridSize - 8;
      const inBottomLeft = r >= gridSize - 8 && c < 8;
      const inAlignment = r >= 15 && r <= 21 && c >= 15 && c <= 21;
      const inTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inAlignment && !inTiming) {
        const cellHash = getHash(`${strValue}-${r}-${c}-${baseHash}`);
        matrix[r][c] = (cellHash % 3 === 0) || (cellHash % 7 === 0);
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`} 
      className={`rounded-xl bg-white p-2 shadow-inner ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={size} height={size} fill="#ffffff" rx={8} />
      {matrix.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.2}
              height={cellSize + 0.2}
              fill="#263746"
              rx={cellSize > 8 ? 1 : 0.5}
            />
          ) : null
        )
      )}
    </svg>
  );
};

export default QRCodeSVG;
