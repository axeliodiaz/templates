/** Bootstrap 6.0.0-alpha.1 ESM bundle (pinned, same as Umail). */
const BS6 =
  'https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js'

let loading: Promise<typeof import('bootstrap')> | undefined

export function ensureScBs6(): Promise<typeof import('bootstrap')> | undefined {
  if (!loading) loading = import(/* @vite-ignore */ BS6)
  return loading
}
