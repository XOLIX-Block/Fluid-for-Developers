// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.

export interface PreflightSimulationResult {
  isSafe: boolean;
  riskScore: number; // 0 to 1000
  estimatedXcu: bigint;
  estimatedGas: bigint;
  warnings: string[];
  stateDiffs: Array<{
    target: string;
    key: string;
    oldValue: string;
    newValue: string;
  }>;
}

export class PreflightSimulator {
  /**
   * Evaluates transaction simulation response and extracts safety metrics
   */
  static evaluate(simResult: any): PreflightSimulationResult {
    const riskScore = Number(simResult?.riskScore || 0);
    const estimatedGas = BigInt(simResult?.gasUsed || 21000);
    const estimatedXcu = BigInt(simResult?.xcuUsed || 100000);
    const warnings: string[] = [];

    if (riskScore > 500) {
      warnings.push("High risk transaction detected. Contract may execute reentrant calls or high-slippage swaps.");
    }
    if (estimatedGas > 5000000n) {
      warnings.push("High gas consumption. Ensure transaction is not executing infinite loops.");
    }

    return {
      isSafe: riskScore <= 500,
      riskScore,
      estimatedXcu,
      estimatedGas,
      warnings,
      stateDiffs: simResult?.stateDiffs || [],
    };
  }
}
