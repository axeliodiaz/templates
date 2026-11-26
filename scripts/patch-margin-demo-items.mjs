#!/usr/bin/env node
/** Normalize utility/layout/helper demo markup to mg-demo-item / mg-demo-surface. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.vitepress/theme/margin-bs6-generic-demos.ts')
let s = fs.readFileSync(file, 'utf8')

const repl = [
  [/<div class="p-3 border rounded">/g, '<div class="mg-demo-item mg-demo-item--soft">'],
  [/<div class="p-2 border rounded">/g, '<div class="mg-demo-item">'],
  [/<span class="p-2 border rounded/g, '<span class="mg-demo-item'],
  [/<span class="p-1 border">/g, '<span class="mg-demo-item">'],
  [/<span class="p-2 rounded border/g, '<span class="mg-demo-item mg-demo-item--soft'],
  [/<div class="d-flex justify-content-between align-items-stretch gap-2 p-3 border rounded">/g,
    '<div class="mg-demo-surface d-flex justify-content-between align-items-stretch gap-2">'],
  [/<div class="flex-fill p-3 border rounded bg-primary-subtle text-center">/g,
    '<div class="mg-demo-item mg-demo-item--accent flex-fill text-center">'],
  [/<div class="align-self-center p-2 border rounded">/g, '<div class="mg-demo-item align-self-center">'],
  [/<div class="d-flex align-items-center gap-2 border rounded p-2"/g, '<div class="mg-demo-surface d-flex align-items-center gap-2"'],
  [/<div class="d-flex gap-2 border rounded p-2">/g, '<div class="mg-demo-surface d-flex gap-2">'],
  [/<div class="d-flex justify-content-between border rounded p-2">/g, '<div class="mg-demo-surface d-flex justify-content-between gap-2">'],
  [/<div class="border rounded p-2 overflow-auto">/g, '<div class="mg-demo-surface overflow-auto">'],
  [/<div class="border rounded h-25 d-flex/g, '<div class="mg-demo-surface h-25 d-flex'],
  [/<div class="w-50 border rounded p-2">/g, '<div class="mg-demo-item w-50">'],
  [/<div class="position-relative border rounded p-4">/g, '<div class="mg-demo-surface position-relative">'],
  [/<div class="position-relative border rounded" style="height:4rem">/g, '<div class="mg-demo-surface position-relative" style="height:4rem">'],
  [/<span class="badge text-bg-secondary">/g, '<span class="mg-demo-item mg-demo-item--soft">'],
  [/<div class="container border py-2 mb-2">/g, '<div class="container mg-demo-surface py-2 mb-2">'],
  [/<div class="container-fluid border py-2">/g, '<div class="container-fluid mg-demo-surface py-2">'],
  [/<div class="p-3 border rounded"><button/g, '<div class="mg-demo-surface"><button'],
  [/<p class="text-center border rounded p-2 mb-0">/g, '<p class="mg-demo-item text-center mb-0">'],
  [/<p class="user-select-all border rounded p-2 mb-0">/g, '<p class="mg-demo-item mb-0">'],
  [/<span class="opacity-50 border p-2 rounded">/g, '<span class="mg-demo-item opacity-50">'],
  [/<span class="p-2 rounded text-bg-primary">/g, '<span class="mg-demo-item mg-demo-item--accent">'],
  [/<span class="p-2 border border-2 rounded">/g, '<span class="mg-demo-item" style="border-width:2px">'],
  [/<span class="p-2 border border-primary rounded">/g, '<span class="mg-demo-item mg-demo-item--accent">'],
  [/<span class="p-3 bg-secondary-subtle rounded-pill">/g, '<span class="mg-demo-item mg-demo-item--soft rounded-pill">'],
  [/<div class="p-2 border rounded color-scheme-dark"/g, '<div class="mg-demo-surface color-scheme-dark"'],
  [/<div class="@container border rounded p-2">/g, '<div class="mg-demo-surface @container">'],
  [/<div class="grid gap-2"/g, '<div class="mg-demo-surface grid gap-2"'],
  [/<div class="vstack gap-2"><span class="p-2 border rounded">/g, '<div class="vstack gap-2"><span class="mg-demo-item">'],
  [/<div class="row g-2"><div class="col-md-4"><div class="p-3 border rounded">Column/g,
    '<div class="row g-2"><div class="col-md-4"><div class="mg-demo-item mg-demo-item--soft">Column'],
  [/<div class="col-12 col-md-6"><div class="p-2 border rounded">/g, '<div class="col-12 col-md-6"><div class="mg-demo-item">'],
  [/<div class="col"><div class="p-2 border rounded">/g, '<div class="col"><div class="mg-demo-item">'],
  [/<div class="col-6"><div class="p-2 border rounded">/g, '<div class="col-6"><div class="mg-demo-item">'],
  [/<div class="d-flex flex-wrap align-content-center gap-1 border rounded p-2"/g,
    '<div class="mg-demo-surface d-flex flex-wrap align-content-center gap-1"'],
  [/<div class="d-grid gap-1 justify-items-center border rounded p-2"/g, '<div class="mg-demo-surface d-grid gap-1 justify-items-center"'],
  [/<div class="d-grid place-items-center border rounded"/g, '<div class="mg-demo-surface d-grid place-items-center"'],
  [/<div class="ratio ratio-16x9 border rounded">/g, '<div class="mg-demo-surface ratio ratio-16x9">'],
  [/<div class="p-3 shadow rounded bg-body">/g, '<div class="mg-demo-item mg-demo-item--soft shadow">'],
]

for (const [re, to] of repl) s = s.replace(re, to)

fs.writeFileSync(file, s)
console.log('Patched margin-bs6-generic-demos.ts')