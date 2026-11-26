<script setup>
import { ref } from 'vue'
import PaymentTicket from './.vitepress/theme/payment-ticket/PaymentTicket.vue'
import { sampleFailed, samplePaid } from './.vitepress/theme/payment-ticket/ticket.sample'
const data=ref(sampleFailed())
const show=ref(true)
const mode=ref('error')
const act=async()=> { if(mode.value==='reject') throw Error('Consumer denied'); return {state:mode.value,message:'Consumer error'} }
</script>
<button id="reject" @click="mode='reject';data=sampleFailed()">Reject</button>
<button id="ack" @click="mode='ack';data=sampleFailed()">Ack</button>
<button id="paid" @click="data=samplePaid()">Paid data</button>
<button id="unmount" @click="show=false">Unmount</button>
<PaymentTicket v-if="show" :data="data" :act="act" :torn="true" />
