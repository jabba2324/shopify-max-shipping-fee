import { useState } from "react";
import {
  reactExtension,
  FunctionSettings,
  BlockStack,
  TextField,
  Text,
  useApi,
} from "@shopify/ui-extensions-react/admin";

const TARGET = "admin.discount-details.function-settings.render";

export default reactExtension(TARGET, () => <App />);

function App() {
  const api = useApi(TARGET);

  const existing = api.data?.metafields?.find(
    (m) => m.namespace === "$app" && m.key === "config"
  );
  const existingConfig = existing ? JSON.parse(existing.value) : {};

  const [maxRate, setMaxRate] = useState(
    String(existingConfig.maxShippingRate ?? "15.00")
  );

  function handleSubmit(event) {
    event.waitUntil(
      api.applyMetafieldChange({
        type: "updateMetafield",
        namespace: "$app",
        key: "config",
        valueType: "json",
        value: JSON.stringify({ maxShippingRate: maxRate }),
      })
    );
  }

  return (
    <FunctionSettings onSubmit={handleSubmit}>
      <BlockStack gap="base">
        <Text>
          Set the maximum shipping amount to charge. If the calculated shipping
          exceeds this, the excess is discounted away.
        </Text>
        <TextField
          label="Maximum shipping rate (£)"
          value={maxRate}
          onChange={setMaxRate}
        />
      </BlockStack>
    </FunctionSettings>
  );
}
