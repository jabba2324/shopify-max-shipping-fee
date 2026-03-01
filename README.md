# Maximum Shipping Rate — Shopify Function App

A Shopify extension-only app that caps the shipping cost charged at checkout. When Shopify combines multiple shipping profiles into a single delivery cost, this function discounts any amount above a configurable maximum — so customers are never overcharged.

## How it works

1. The merchant creates an automatic shipping discount using the **Maximum Shipping Rate** function.
2. In the discount settings UI, they set the maximum shipping rate (e.g. £15.00).
3. At checkout, if the calculated shipping exceeds that cap, the excess is automatically discounted away.
4. The discount appears at checkout as **"Optimal shipping fee"**.

## Project structure

```
extensions/
  highest-shipping-rate/   # Shopify Function (TypeScript → WASM)
    src/run.ts             # Core discount logic
    src/run.graphql        # Input query (reads cart + discount config)
    locales/               # Extension display name / description
  discount-settings/       # Admin UI Extension (React)
    src/DiscountFunctionSettings.jsx  # Settings form shown in Shopify admin
shopify.app.toml           # App config, metafield definition
```

## Requirements

- [Node.js](https://nodejs.org/en/download/)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- A [Shopify Partner account](https://partners.shopify.com/signup)
- A development store or Shopify Plus sandbox

## Getting started

Install dependencies:

```shell
npm install
```

Start local development:

```shell
shopify app dev
```

Deploy to production:

```shell
shopify app deploy
```

## Configuration

When creating a discount in the Shopify admin, the settings panel lets you enter a **Maximum shipping rate (£)**. This value is stored as a JSON metafield on the discount and read by the function at checkout.

If no value has been saved, the function falls back to a default of **£15.00**.

## Developer resources

- [Shopify Functions](https://shopify.dev/docs/apps/build/functions)
- [Delivery discount functions](https://shopify.dev/docs/api/functions/reference/shipping-discounts)
- [Admin UI extensions](https://shopify.dev/docs/apps/build/app-extensions/build-extension-only-app)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
