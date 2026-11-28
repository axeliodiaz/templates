<script setup>
import MarginExampleTabs from '../MarginExampleTabs.vue'
import PaymentTicket from '../payment-ticket/PaymentTicket.vue'
import ticketDef from '../payment-ticket/payment-ticket.json'
import { TICKET_SCHEMA } from '../margin-example-schemas.mjs'
</script>
<template>
  <MarginExampleTabs
    :definition="ticketDef"
    json-path=".vitepress/theme/payment-ticket/payment-ticket.json"
    :schema-fields="TICKET_SCHEMA"
    code-snippet='<PaymentTicket theme="margin" />'
    tabs-aria-label="Payment ticket"
  >
    <PaymentTicket theme="margin" />
  </MarginExampleTabs>
</template>