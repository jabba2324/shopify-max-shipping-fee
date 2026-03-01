import type { RunInput, FunctionRunResult } from "../generated/api";
import { DeliveryDiscountSelectionStrategy } from "../generated/api";

const NO_DISCOUNT: FunctionRunResult = { operations: [] };

// Fallback used only if no value has been saved via the admin UI yet.
const DEFAULT_MAX_RATE = 15.0;

export function run(input: RunInput): FunctionRunResult {
  // ── Read configured max rate ────────────────────────────────────────────
  // The merchant sets this in the discount creation form. It is stored as a
  // JSON metafield: { "maxShippingRate": "15.00" }
  let maxRate = DEFAULT_MAX_RATE;
  const raw = input.discount?.metafield?.value;
  if (raw) {
    try {
      const parsed = parseFloat(JSON.parse(raw).maxShippingRate);
      if (!isNaN(parsed) && parsed > 0) maxRate = parsed;
    } catch {
      // malformed config — use default
    }
  }

  // ── Get the delivery cost ───────────────────────────────────────────────
  const { deliveryGroups } = input.cart;
  if (deliveryGroups.length === 0) return NO_DISCOUNT;

  const group = deliveryGroups[0];
  if (group.deliveryOptions.length === 0) return NO_DISCOUNT;

  const option = group.deliveryOptions[0];
  const cost = parseFloat(option.cost.amount);

  // ── Nothing to do if already at or below the cap ───────────────────────
  const discountAmount = cost - maxRate;
  if (discountAmount <= 0) return NO_DISCOUNT;

  return {
    operations: [
      {
        deliveryDiscountsAdd: {
          candidates: [
            {
              message: "Optimal shipping fee",
              targets: [{ deliveryGroup: { id: group.id } }],
              value: {
                fixedAmount: {
                  amount: discountAmount.toFixed(2),
                },
              },
            },
          ],
          selectionStrategy: DeliveryDiscountSelectionStrategy.All,
        },
      },
    ],
  };
}
