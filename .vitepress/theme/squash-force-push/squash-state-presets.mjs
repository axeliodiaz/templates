import {
  TARGET,
  fixupCount,
  initialCommits,
  prNumber,
  prTitle,
  squashedCommits,
} from './commit-data.mjs'

/** @typedef {'loading'|'expanded'|'rebasing'|'squashed'|'pushing'|'pr-running'|'pr-passed'|'pr-running-checks-open'|'pr-passed-checks-open'} SquashStateId */

/**
 * @param {SquashStateId} id
 * @param {{ pushProgress?: number }} opts
 */
export function squashStatePreset(id, opts = {}) {
  const pushProgress = opts.pushProgress ?? (id === 'pushing' ? 0.6 : 0)
  /** @type {import('./commit-data.mjs').initialCommits} */
  const base = {
    headerVariant: 'branch',
    headerLoading: false,
    headerRight: '',
    checksState: 'idle',
    showRows: false,
    rows: [],
    collapsing: /** @type {string[]} */ ([]),
    footer: 'hidden',
    purple: false,
    compact: false,
    pushing: false,
    pushProgress: 0,
    TARGET,
    fixupCount,
    prNumber,
    prTitle,
  }

  switch (id) {
    case 'loading':
      return {
        ...base,
        headerLoading: true,
      }
    case 'expanded':
      return {
        ...base,
        showRows: true,
        rows: structuredClone(initialCommits),
        footer: 'squash',
        headerRight: '10 commits',
        compact: false,
      }
    case 'rebasing':
      return {
        ...base,
        showRows: true,
        rows: structuredClone(initialCommits),
        collapsing: ['c1', 'c3', 'c4', 'c5', 'c6'],
        footer: 'rebasing',
        headerRight: '10 commits',
        compact: false,
      }
    case 'squashed':
      return {
        ...base,
        showRows: true,
        rows: structuredClone(squashedCommits),
        footer: 'push',
        headerRight: '3 commits',
        compact: true,
      }
    case 'pushing':
      return {
        ...base,
        showRows: true,
        rows: structuredClone(squashedCommits),
        footer: 'push',
        headerRight: '3 commits',
        compact: true,
        pushing: true,
        pushProgress,
      }
    case 'pr-running':
      return {
        ...base,
        headerVariant: 'pr',
        showRows: true,
        rows: structuredClone(squashedCommits),
        footer: 'done',
        checksState: 'running',
        purple: true,
        compact: true,
      }
    case 'pr-passed':
      return {
        ...base,
        headerVariant: 'pr',
        showRows: true,
        rows: structuredClone(squashedCommits),
        footer: 'done',
        checksState: 'passed',
        purple: true,
        compact: true,
      }
    case 'pr-running-checks-open':
      return {
        ...squashStatePreset('pr-running'),
        checksExpanded: true,
      }
    case 'pr-passed-checks-open':
      return {
        ...squashStatePreset('pr-passed'),
        checksExpanded: true,
      }
    default:
      return base
  }
}

export const GALLERY_STATES = [
  {
    id: 'loading',
    title: '1 · Loading',
    code: '<MarginSquashForcePush state="loading" :motion="false" :autoplay="false" />',
  },
  {
    id: 'expanded',
    title: '2 · Expanded (10 commits)',
    code: '<MarginSquashForcePush state="expanded" :motion="false" :autoplay="false" />',
  },
  {
    id: 'rebasing',
    title: '3 · Rebasing (mid-collapse)',
    code: '<MarginSquashForcePush state="rebasing" :motion="false" :autoplay="false" />',
  },
  {
    id: 'squashed',
    title: '4 · Squashed (hold to push)',
    code: '<MarginSquashForcePush state="squashed" :motion="false" :autoplay="false" />',
  },
  {
    id: 'pushing',
    title: '4b · Pushing (~60% fill)',
    code: '<MarginSquashForcePush state="pushing" :push-progress="0.6" :motion="false" :autoplay="false" />',
    pushProgress: 0.6,
  },
  {
    id: 'pr-running',
    title: '5a · Pushed / checks running',
    code: '<MarginSquashForcePush state="pr-running" :motion="false" :autoplay="false" />',
  },
  {
    id: 'pr-passed',
    title: '5b · 6 checks passed',
    code: '<MarginSquashForcePush state="pr-passed" :motion="false" :autoplay="false" />',
  },
  {
    id: 'pr-running-checks-open',
    title: '5a′ · Checks list (running)',
    code: '<MarginSquashForcePush state="pr-running-checks-open" :checks-expanded="true" :motion="false" :autoplay="false" />',
    checksExpanded: true,
  },
  {
    id: 'pr-passed-checks-open',
    title: '5b′ · Checks list (all passed)',
    code: '<MarginSquashForcePush state="pr-passed-checks-open" :checks-expanded="true" :motion="false" :autoplay="false" />',
    checksExpanded: true,
  },
]