<script setup lang="ts">
import { computed, ref } from 'vue'
const nav = ref('Dashboard')
const period = ref('Monthly')
const query = ref('')
const status = ref('All')
const selected = ref<number | null>(26)
const notice = ref('')
const dialog = ref<HTMLDialogElement | null>(null)
const customer = ref('')
const product = ref('')
const quantity = ref(1)
const price = ref(100)
const navItems = [
  'Dashboard',
  'Products',
  'Transactions',
  'Reports & Analytics',
  'Messages',
  'Team Performance',
  'Campaigns',
  'Customer List',
  'Channels',
  'Order Management',
  'Roles & Permissions',
  'Billing & Subscription',
  'Integrations',
  'Customer Support',
  'System Settings',
] as const
function selectNav(item: (typeof navItems)[number]) {
  nav.value = item
  if (item === 'Customer Support') notice.value = 'Demo support is local only.'
  else if (item === 'System Settings') notice.value = 'No external account connected.'
}
const rows = ref([
  { id: '04910', customer: 'Ryan Korsgaard', product: 'Ergo Office Chair', status: 'Success', qty: 12, price: 3450 },
  { id: '04911', customer: 'Madelyn Lubin', product: 'Sunset Desk 02', status: 'Success', qty: 20, price: 2980 },
  { id: '04912', customer: 'Abram Bergson', product: 'Eco Bookshelf', status: 'Pending', qty: 22, price: 1750 },
  { id: '04913', customer: 'Phillip Mango', product: 'Green Leaf Desk', status: 'Refunded', qty: 24, price: 1950 },
])
const visible = computed(() =>
  rows.value.filter(
    (r) =>
      (status.value === 'All' || r.status === status.value) &&
      `${r.customer} ${r.product} ${r.id}`.toLowerCase().includes(query.value.toLowerCase()),
  ),
)
const heights = computed(() =>
  Array.from({ length: 60 }, (_, i) => 3 + Math.round(Math.abs(Math.sin(i * 0.63) * (period.value === 'Weekly' ? 5 : 9)) + Math.abs(Math.sin(i * 0.21) * 2))),
)
const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
function exportCSV() {
  const csv =
    'ID,Customer,Product,Status,Quantity,Unit price,Total\n' +
    visible.value.map((r) => [r.id, r.customer, r.product, r.status, r.qty, r.price, r.qty * r.price].join(',')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = 'spark-analytics-demo.csv'
  a.click()
  URL.revokeObjectURL(a.href)
  notice.value = 'Demo CSV exported'
}
function add() {
  if (!customer.value.trim() || !product.value.trim()) return
  rows.value.unshift({
    id: String(4910 + rows.value.length),
    customer: customer.value,
    product: product.value,
    status: 'Pending',
    qty: quantity.value,
    price: price.value,
  })
  dialog.value?.close()
  notice.value = 'Local transaction added. Nothing charged.'
  customer.value = ''
  product.value = ''
}
const pixelFocus = ref(0)
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthTicks = [
  { long: 'JAN', short: 'J' },
  { long: 'FEB', short: 'F' },
  { long: 'MAR', short: 'M' },
  { long: 'APR', short: 'A' },
  { long: 'MAY', short: 'M' },
  { long: 'JUN', short: 'J' },
  { long: 'JUL', short: 'J' },
  { long: 'AUG', short: 'A' },
  { long: 'SEP', short: 'S' },
  { long: 'OCT', short: 'O' },
  { long: 'NOV', short: 'N' },
  { long: 'DEC', short: 'D' },
]
function pixelLabel(i: number) {
  return `${monthNames[Math.floor(i / 5)]} 2026: new users ${heights.value[i] * 2}k, existing users ${heights.value[i]}k`
}
function onPixelKey(e: KeyboardEvent) {
  const n = heights.value.length
  let t = pixelFocus.value
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') t = Math.min(n - 1, t + 1)
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') t = Math.max(0, t - 1)
  else if (e.key === 'Home') t = 0
  else if (e.key === 'End') t = n - 1
  else return
  e.preventDefault()
  pixelFocus.value = t
  ;(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('.spark-pixel-col')[t]?.focus()
}
const kpis = [
  { label: 'Total revenue', value: '$20,320' },
  { label: 'Total orders', value: '10,320' },
  { label: 'New customers', value: '4,305' },
  { label: 'Conversion rate', value: '3.9%' },
]
</script>
<template>
  <section class="reference-dashboard sparkdash b2-bs6 b2-spark" aria-label="Orange agency analytics demo">
    <aside class="spark-sidebar" aria-label="Main navigation">
      <div class="spark-logo">◧ &nbsp; <b>Spark Pixel Team</b><small class="spark-logo-sub">Agency workspace</small></div>
      <small class="rd-nav-label">Main Menu</small>
      <button
        class="btn btn-outline theme-primary"
        v-for="item in ['Dashboard', 'Products', 'Transactions', 'Reports & Analytics', 'Messages', 'Team Performance', 'Campaigns']"
        :key="item"
        :class="{ active: nav === item }"
        @click="selectNav(item)"
      >
        {{ item }}
      </button>
      <small class="rd-nav-label">Customers</small>
      <button
        class="btn btn-outline theme-primary"
        v-for="item in ['Customer List', 'Channels', 'Order Management']"
        :key="item"
        @click="selectNav(item)"
        :class="{ active: nav === item }"
      >
        {{ item }}
      </button>
      <small class="rd-nav-label">Management</small>
      <button
        class="btn btn-outline theme-primary"
        v-for="item in ['Roles & Permissions', 'Billing & Subscription', 'Integrations']"
        :key="item"
        @click="selectNav(item)"
        :class="{ active: nav === item }"
      >
        {{ item }}
      </button>
      <small class="rd-nav-label">Settings</small>
      <button class="btn btn-outline theme-primary" :class="{ active: nav === 'Customer Support' }" @click="selectNav('Customer Support')">Customer Support</button>
      <button class="btn btn-outline theme-primary" :class="{ active: nav === 'System Settings' }" @click="selectNav('System Settings')">System Settings</button>
      <div class="spark-profile">◉ &nbsp; Alex Morgan<small class="spark-profile-sub">Pro Plan · Demo</small></div>
    </aside>
    <main class="spark-main">
      <div class="spark-mobile-nav">
        <label class="spark-mobile-nav-label">Section<select class="form-control" :value="nav" aria-label="Analytics section" @change="selectNav(($event.target as HTMLSelectElement).value as (typeof navItems)[number])">
          <option v-for="item in navItems" :key="item" :value="item">{{ item }}</option>
        </select></label>
      </div>
      <header class="spark-top">
        <span>{{ nav }} › <b class="spark-accent">Overview</b></span>
        <input class="form-control" v-model="query" aria-label="Global search transactions" placeholder="Search..." />
        <button class="btn btn-outline theme-primary spark-icon-btn" aria-label="Show analytics notifications" @click="notice = 'No new notifications'">♧</button>
        <span class="ref-avatar">AM</span>
      </header>
      <div class="ref-heading">
        <h2>{{ nav === 'Dashboard' ? 'Welcome back, Alex' : nav }}</h2>
        <div class="ref-tools">
          <select class="form-control" aria-label="Time granularity" v-model="period"><option>Weekly</option><option>Monthly</option><option>Yearly</option></select>
          <button class="btn btn-outline theme-primary" @click="notice = 'Showing sample data for 6 November 2026'">▣ 6 Nov 2026</button>
          <button class="ref-primary btn btn-solid theme-primary" @click="exportCSV">↥ Export CSV</button>
        </div>
      </div>
      <div class="spark-kpis">
        <article v-for="k in kpis" :key="k.label" class="spark-kpi">
          <small>{{ k.label }}</small><strong>{{ k.value }}</strong>
          <div class="spark-mini" aria-hidden="true"><i v-for="i in 7" :key="i"></i></div>
          <p>↗ +0.94% last year</p>
        </article>
      </div>
      <div class="spark-grid">
        <article class="spark-card">
          <h3>SALES TREND ⓘ</h3>
          <div class="spark-chart-head"><span>Total Revenue: <strong>$20,320</strong></span><div class="spark-tabs"><button class="btn btn-outline theme-primary" v-for="p in ['Weekly', 'Monthly', 'Yearly']" :key="p" :class="{ active: period === p }" @click="period = p">{{ p }}</button></div></div>
          <div class="spark-chart">
            <div class="spark-axis"><span v-for="n in [60, 50, 40, 30, 20, 10, 0]" :key="n">{{ n }}k</span></div>
            <div class="spark-pixels" role="group" aria-label="Orange pixel histogram showing sample sales across 12 months. Use the arrow keys to inspect each column." @keydown="onPixelKey">
              <div
                v-for="(height, i) in heights"
                :key="period + '-' + i"
                class="spark-pixel-col"
                role="img"
                :tabindex="i === pixelFocus ? 0 : -1"
                :aria-label="pixelLabel(i)"
                @mouseenter="selected = i"
                @mouseleave="selected = null"
                @focus="selected = i; pixelFocus = i"
                @blur="selected = null"
              >
                <i v-for="j in height" :key="j" class="spark-pixel" :class="{ existing: j > height * 0.7 }"></i>
              </div>
            </div>
            <div class="spark-months" aria-hidden="true">
              <span v-for="(m, i) in monthTicks" :key="m.long" :title="monthNames[i]"><span class="spark-month-long">{{ m.long }}</span><span class="spark-month-short">{{ m.short }}</span></span>
            </div>
            <div class="spark-tooltip" v-if="selected !== null">
              {{ ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Math.floor(selected / 5)] }} 2026<small>◦ New User &nbsp;{{ heights[selected] * 2 }}k</small
              ><small class="spark-tooltip-existing">• Existing User &nbsp;{{ heights[selected] }}k</small>
            </div>
          </div>
          <p class="spark-chart-legend">□ New user &nbsp; <span class="spark-accent">■ Existing user</span></p>
        </article>
        <article class="spark-card">
          <h3>REVENUE BREAKDOWN ⓘ</h3>
          <p class="spark-card-lead">Revenue by category</p>
          <strong class="spark-card-total">$20,320</strong>
          <button class="spark-ai btn btn-outline theme-primary" @click="notice = 'Sample insight: furniture drives 54% of revenue. No AI request was sent.'">✦ Get AI insight for better analysis</button>
          <div class="spark-revenue">
            <button
              class="btn btn-outline theme-primary spark-revenue-bar"
              v-for="(h, i) in [40, 57, 31, 68, 45, 32, 49, 40, 58, 44, 66, 35]"
              :key="i"
              :style="{ '--spark-bar-h': h + '%' }"
              :aria-label="'Category ' + (i + 1) + ' revenue'"
              @click="notice = 'Category ' + (i + 1) + ': ' + money(h * 50)"
            ></button>
          </div>
          <div class="fix-labels"><span>1 JAN</span><span>30 JAN 2026</span></div>
        </article>
      </div>
      <article class="spark-card">
        <div class="ref-heading spark-table-head">
          <h3 class="spark-table-title">RECENT TRANSACTIONS ⓘ</h3>
          <div class="ref-tools">
            <input class="form-control rd-table-control" v-model="query" aria-label="Search transactions" placeholder="Search transactions..." />
            <select class="form-control rd-table-control" v-model="status" aria-label="Transaction status filter"><option>All</option><option>Success</option><option>Pending</option><option>Refunded</option></select>
            <button class="ref-primary btn btn-solid theme-primary rd-table-control" @click="dialog?.showModal()">+ Add Transaction</button>
          </div>
        </div>
        <div class="ref-table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Status</th>
                <th class="number">Qty</th>
                <th class="number">Unit price</th>
                <th class="number">Total revenue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in visible" :key="r.id">
                <td>#{{ r.id }}</td>
                <td>{{ r.customer }}</td>
                <td>{{ r.product }}</td>
                <td><span class="spark-status" :class="r.status.toLowerCase()">● {{ r.status }}</span></td>
                <td class="number">{{ r.qty }}</td>
                <td class="number">{{ money(r.price) }}</td>
                <td class="number">{{ money(r.qty * r.price) }}</td>
                <td><button class="btn btn-outline theme-primary spark-row-action" :aria-label="'View transaction ' + r.id" @click="notice = `#${r.id} · ${r.customer} · ${money(r.qty * r.price)} · ${r.status}`">•••</button></td>
              </tr>
              <tr v-if="!visible.length"><td colspan="8">No matching transactions.</td></tr>
            </tbody>
          </table>
        </div>
      </article>
      <p v-if="notice" class="ref-notice" role="status">{{ notice }}</p>
      <p class="rd-footnote">Fictitious local demo · No account, customer or payment connected</p>
    </main>
    <dialog ref="dialog" class="ref-dialog">
      <form @submit.prevent="add">
        <h3>Add demo transaction</h3>
        <label>Customer<input class="form-control" v-model="customer" required /></label>
        <label>Product<input class="form-control" v-model="product" required /></label>
        <label>Quantity<input class="form-control" v-model="quantity" type="number" min="1" required /></label>
        <label>Unit price (USD)<input class="form-control" v-model="price" type="number" min="0" step=".01" required /></label>
        <div class="ref-tools"><button class="btn btn-outline theme-primary" type="button" @click="dialog?.close()">Cancel</button><button type="submit" class="ref-primary btn btn-solid theme-primary">Add local row</button></div>
      </form>
    </dialog>
  </section>
</template>
