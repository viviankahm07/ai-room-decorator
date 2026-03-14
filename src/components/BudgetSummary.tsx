"use client";

import type { Product } from "@/types";

interface BudgetSummaryProps {
  products: Product[];
  maxBudget?: number;
}

export default function BudgetSummary({ products, maxBudget }: BudgetSummaryProps) {
  const total = products.reduce((sum, p) => sum + p.price, 0);
  const overBudget = maxBudget != null && total > maxBudget;

  return (
    <div className="px-4 py-3 border-t border-warm-sand/60 bg-warm-cream/50">
      <div className="flex items-center justify-between">
        <span className="font-sans text-sm text-warm-charcoal/80">
          Total ({products.length} items)
        </span>
        <span
          className={`font-display font-semibold ${
            overBudget ? "text-red-600" : "text-warm-terracotta"
          }`}
        >
          ${total.toLocaleString()}
          {maxBudget != null && (
            <span className="text-warm-charcoal/60 font-sans font-normal text-xs ml-1">
              / ${maxBudget}
            </span>
          )}
        </span>
      </div>
      {overBudget && (
        <p className="text-xs text-red-600 mt-1">Over budget by ${(total - maxBudget).toLocaleString()}</p>
      )}
    </div>
  );
}
