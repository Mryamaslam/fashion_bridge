/**
 * Functional test: order deducts stock; admin stock update reflects on web API.
 * Run: npx tsx scripts/test-stock-flow.mjs
 */
import { mockProducts } from "../src/lib/data/mock.ts";
import {
  createOrderFromCart,
  getProductById,
  updateProduct,
} from "../src/lib/services/data.ts";

function assert(condition, message) {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

async function run() {
  const product = mockProducts.find((p) => p.category_id === "6");
  assert(!!product, "Found a bag product for testing");
  const productId = product.id;
  const initialStock = product.stock_quantity;
  const orderQty = Math.min(100, initialStock);

  console.log(`\nTesting product: ${product.name} (${product.sku})`);
  console.log(`Initial stock: ${initialStock}`);

  const order = await createOrderFromCart({
    buyer_name: "Test Buyer",
    buyer_email: "test@example.com",
    buyer_country: "United States",
    items: [{ productId, quantity: orderQty }],
  });
  assert(!!order.order_number, `Order created: ${order.order_number}`);

  const afterOrder = await getProductById(productId);
  assert(
    afterOrder.stock_quantity === initialStock - orderQty,
    `Stock after order: ${afterOrder.stock_quantity} (expected ${initialStock - orderQty})`
  );

  const newStock = afterOrder.stock_quantity + 500;
  await updateProduct(productId, { stock_quantity: newStock });
  const afterAdmin = await getProductById(productId);
  assert(
    afterAdmin.stock_quantity === newStock,
    `Stock after admin add +500: ${afterAdmin.stock_quantity} (expected ${newStock})`
  );

  console.log("\nAll stock flow tests passed.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
