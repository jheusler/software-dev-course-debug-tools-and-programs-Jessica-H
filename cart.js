const cart = [
  { name: "Laptop", price: 1000 },
  { name: "Phone", price: 500 },
  { name: "Headphones", price: 200 }
];

// BUG FOUND: the loop condition was `i <= cartItems.length`, so on the final
// iteration `i` equaled cartItems.length (one past the last valid index),
// and cartItems[i] was undefined. Accessing .price on it threw
// "TypeError: Cannot read properties of undefined (reading 'price')".
// DEBUGGING TOOLS: the Console showed the TypeError with a stack trace
// pointing at this function. Setting a breakpoint in the Sources tab inside
// the loop and stepping through confirmed `i` reached cartItems.length while
// cartItems[i] was undefined, pinpointing the off-by-one.
// FIX: changed `i <= cartItems.length` to `i < cartItems.length`.
function calculateTotal(cartItems) {
  let total = 0;
  for (let i = 0; i < cartItems.length; i++) {
      total += cartItems[i].price;
  }
  return total;
}

// BUG FOUND: discountRate was applied with no validation, so a value outside
// 0-1 (e.g. 1.5 or -0.2) silently produced a negative or inflated total
// instead of an error - a logic bug, not a thrown exception.
// DEBUGGING TOOLS: no error appeared in the Console, so this one wasn't
// caught by a stack trace. It only surfaced by testing edge cases directly
// (calling applyDiscount with out-of-range values) and pausing with a
// debugger statement inside the function to inspect discountRate before use.
// FIX: added a guard - if discountRate < 0 or > 1, log a warning with
// console.warn() and return total unchanged; otherwise apply the discount.
function applyDiscount(total, discountRate) {
  if (discountRate < 0 || discountRate > 1) {
      console.warn("Invalid discountRate; returning total unchanged.");
      return total;
  }
  return total - total * discountRate;
}

// BUG FOUND: total.toFixed(2) assumed total was always a number. If an
// upstream bug (like the calculateTotal off-by-one) ever produced undefined
// or NaN, calling .toFixed() on it would throw
// "TypeError: Cannot read properties of undefined (reading 'toFixed')".
// DEBUGGING TOOLS: the call stack in the Console traced the TypeError back
// through generateReceipt to the upstream calculateTotal bug, showing how
// one bug cascades into another and why this function needed its own guard
// rather than trusting its caller.
// FIX: added a typeof total !== "number" check before formatting; if total
// isn't a number, the receipt shows "Total: $Error calculating total"
// instead of calling .toFixed(2).
function generateReceipt(cartItems, total) {
  let receipt = "Items:\n";
  cartItems.forEach(item => {
      receipt += `${item.name}: $${item.price}\n`;
  });
  if (typeof total !== "number") {
      receipt += "Total: $Error calculating total";
  } else {
      receipt += `Total: $${total.toFixed(2)}`;
  }
  return receipt;
}

// Debugging entry point
console.log("Starting shopping cart calculation...");
const total = calculateTotal(cart);
const discountedTotal = applyDiscount(total, 0.2); // 20% discount
const receipt = generateReceipt(cart, discountedTotal);

document.getElementById("total").textContent = `Total: $${discountedTotal}`;
document.getElementById("receipt").textContent = receipt;
