import def from './squash-force-push.json'

export const SQUASH_DEF = def
export default def
export const BRANCH = def.meta.branch
export const TARGET = def.meta.target
export const initialCommits = def.commits.initial
export const squashedCommits = def.commits.squashed
export const CI_CHECKS = def.checks
export const GALLERY_STATES_JSON = def.galleryStates