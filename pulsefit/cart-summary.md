---
---

# Cart summary

An order summary shown as a thermal paper receipt, based on the Payment Receipt Printer component (https://www.easyui.site/components/payment-receipt-printer): status card, itemised lines, subtotal, discount, tax, total, payment method, barcode and a jagged paper edge that prints out. Rebuilt for PulseFit with its own tokens. Demo data is fictitious.

## Receipt: light paper

<div class="bsx-pf"><div class="csx"><div class="col"><div class="stat"><i>&#10003;</i><div><b>Payment complete</b><small>Receipt has been issued</small></div></div><div class="act"><span class="btn">Replay</span><span class="btn pri">Copy receipt</span></div><div class="slot"></div></div><div class="paper-wrap"><div class="paper "><h4>EasyShop Store</h4><div class="sub">Official component registry</div><div class="meta"><span>ORDER NO: #4821</span><span>DATE: Aug 20, 2026 10:42 AM</span><span>PAYMENT: Visa &bull;&bull;&bull;&bull; 4242</span></div><hr><div class="r"><span>1x Wireless headphones</span><span>$89.00</span></div><div class="r"><span>2x USB-C cable</span><span>$18.00</span></div><div class="r"><span>1x Travel case</span><span>$18.00</span></div><hr><div class="r"><span>Subtotal</span><span>$125.00</span></div><div class="r disc"><span>Discount (WELCOME10)</span><span>-$12.50</span></div><div class="r"><span>Tax (8%)</span><span>$9.00</span></div><hr><div class="r t"><span>TOTAL</span><span>$121.50</span></div><div class="bar"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="thx">Thank you for your order!</div></div></div></div></div>

## Receipt: cream and dark paper

<div class="bsx-pf"><div class="csx"><div class="paper-wrap"><div class="paper cream"><h4>EasyShop Store</h4><div class="sub">Official component registry</div><div class="meta"><span>ORDER NO: #4821</span><span>DATE: Aug 20, 2026 10:42 AM</span><span>PAYMENT: Visa &bull;&bull;&bull;&bull; 4242</span></div><hr><div class="r"><span>1x Wireless headphones</span><span>$89.00</span></div><div class="r"><span>2x USB-C cable</span><span>$18.00</span></div><hr><div class="r"><span>Subtotal</span><span>$125.00</span></div><div class="r"><span>Tax (8%)</span><span>$9.00</span></div><hr><div class="r t"><span>TOTAL</span><span>$121.50</span></div><div class="bar"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="thx">Thank you for your order!</div></div></div><div class="paper-wrap"><div class="paper dark"><h4>EasyShop Store</h4><div class="sub">Official component registry</div><div class="meta"><span>ORDER NO: #4821</span><span>DATE: Aug 20, 2026 10:42 AM</span><span>PAYMENT: Visa &bull;&bull;&bull;&bull; 4242</span></div><hr><div class="r"><span>1x Wireless headphones</span><span>$89.00</span></div><hr><div class="r"><span>Subtotal</span><span>$125.00</span></div><div class="r"><span>Tax (8%)</span><span>$9.00</span></div><hr><div class="r t"><span>TOTAL</span><span>$121.50</span></div><div class="bar"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="thx">Thank you for your order!</div></div></div></div></div>

## Cart summary: before paying

<div class="bsx-pf"><div class="csx"><div class="lst"><div class="li"><span><b>Wireless headphones</b><small>Qty 1</small></span><span>$89.00</span></div><div class="li"><span><b>USB-C cable</b><small>Qty 2</small></span><span>$18.00</span></div><div class="li"><span><b>Travel case</b><small>Qty 1</small></span><span>$18.00</span></div></div><div class="col"><div class="cp"><span>Promo code</span><span class="btn pri" style="flex:0 0 auto">Apply</span></div><div class="tot"><div class="r"><span>Subtotal</span><span>$125.00</span></div><div class="r g"><span>Discount</span><span>-$12.50</span></div><div class="r"><span>Tax</span><span>$9.00</span></div><div class="r big"><span>Total</span><span>$121.50</span></div></div><span class="btn pri">Pay $121.50</span></div></div></div>

## Anatomy and props

| Part | Notes |
|---|---|
| Status card | Title and subtitle, hidden when the cart is not paid yet |
| Header | Merchant name, subtitle, order number, date, payment method |
| Items | Quantity, name and line price; one line per product |
| Totals | Subtotal, discount, tax, total in bold |
| Barcode | Decorative, tied to the order number |
| Paper | light, cream or dark; serrated bottom edge via CSS mask |
| Motion | Paper prints top to bottom in 2.4s; off with reduced motion |
| Actions | Replay and copy receipt |
