<template>
  <div class="cal cal-m">
    <div class="cal-head">
      <div class="cal-title">
        <b>October 2026</b>
        <span class="cal-nav"><i>Today</i></span>
      </div>
      <div class="cal-seg">
        <span>Day</span><span>Week</span><span class="on">Month</span><span>Agenda</span>
      </div>
    </div>
    <div class="cal-mg">
      <div v-for="d in dows" :key="d" class="cal-dow">{{ d }}</div>
      <div
        v-for="(cell, i) in cells"
        :key="i"
        class="cal-day"
        :class="{ today: cell.today, we: cell.we, out: cell.out }"
      >
        <span class="cal-num">{{ cell.n }}</span>
        <span v-for="(ev, j) in cell.events" :key="j" class="cal-ev" :class="ev.c">{{ ev.t }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const cells = [
  { n: 1, out: true },
  { n: 2, out: true },
  { n: 3, out: true },
  { n: 4, out: true },
  { n: 5, events: [{ t: 'Sprint review', c: 'e1' }] },
  { n: 6, events: [] },
  { n: 7, today: true, events: [{ t: 'Design sync', c: 'e1' }, { t: 'Focus block', c: 'e4' }] },
  { n: 8, events: [{ t: '1:1 with Maya', c: 'e1' }] },
  { n: 9, events: [] },
  { n: 10, we: true, events: [] },
  { n: 11, we: true, events: [] },
  { n: 12, events: [] },
  { n: 13, events: [] },
  { n: 14, events: [{ t: 'Roadmap review', c: 'e1' }] },
  ...Array.from({ length: 17 }, (_, k) => ({ n: 15 + k, events: [] })),
]
</script>