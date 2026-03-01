// Entry point — re-exports all function targets.
// The Shopify build system (via @shopify/shopify_function) uses this file
// as the bundle entry and compiles it to dist/function.wasm.
export * from './run';
