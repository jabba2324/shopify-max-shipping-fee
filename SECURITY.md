# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in this project, please open a [GitHub issue](https://github.com/jabba2324/shopify-max-shipping-fee/issues) or contact the maintainer directly via GitHub.

Please do not disclose security issues publicly until they have been reviewed and addressed.

## Scope

This app is an extension-only Shopify app. It does not have a backend server, store any user data, or handle payment information. The attack surface is limited to:

- The Shopify Function logic in `extensions/highest-shipping-rate/src/run.ts`
- The Admin UI Extension in `extensions/discount-settings/src/DiscountFunctionSettings.jsx`
- Metafield configuration stored on Shopify discounts

## Supported versions

Only the latest version on the `main` branch is actively maintained.
