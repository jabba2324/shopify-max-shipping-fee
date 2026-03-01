import assert from "node:assert/strict";
import { run } from "../src/run";

function makeInput(cost: string, configuredMax?: string) {
  return {
    discount: configuredMax
      ? { metafield: { value: JSON.stringify({ maxShippingRate: configuredMax }) } }
      : { metafield: null },
    cart: {
      deliveryGroups: [
        {
          id: "gid://shopify/CartDeliveryGroup/0",
          deliveryOptions: [{ cost: { amount: cost, currencyCode: "GBP" } }],
        },
      ],
    },
  };
}

function discountAmount(result: ReturnType<typeof run>): string | null {
  if (!result.operations?.length) return null;
  return result.operations[0].deliveryDiscountsAdd.candidates[0].value
    .fixedAmount?.amount ?? null;
}

let passed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ✗  ${name}\n     ${err.message}`);
    process.exitCode = 1;
  }
}

console.log("\nhighest-shipping-rate function\n");

test("cost below max → no discount", () => {
  assert.deepEqual(run(makeInput("6.00", "15.00")), { operations: [] });
});

test("cost equal to max → no discount", () => {
  assert.deepEqual(run(makeInput("15.00", "15.00")), { operations: [] });
});

test("cost above max → discounts the excess", () => {
  assert.equal(discountAmount(run(makeInput("21.00", "15.00"))), "6.00");
});

test("uses default max (15) when no config saved", () => {
  // £21 with no config → should still discount by £6 using DEFAULT_MAX_RATE=15
  assert.equal(discountAmount(run(makeInput("21.00"))), "6.00");
});

test("uses configured max over default", () => {
  // Max set to £10; £21 in → discount £11
  assert.equal(discountAmount(run(makeInput("21.00", "10.00"))), "11.00");
});

test("no delivery groups → no operations", () => {
  const result = run({
    discount: { metafield: null },
    cart: { deliveryGroups: [] },
  });
  assert.deepEqual(result, { operations: [] });
});

test("correct group targeted and message set", () => {
  const result = run(makeInput("21.00", "15.00"));
  const candidate = result.operations[0].deliveryDiscountsAdd.candidates[0];
  assert.equal(candidate.targets[0].deliveryGroup?.id, "gid://shopify/CartDeliveryGroup/0");
  assert.equal(candidate.message, "Only the highest shipping rate is charged");
});

console.log(`\n${passed} test(s) passed\n`);
