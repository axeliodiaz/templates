/** Bootstrap 6.0.0-alpha.1 pins (jsDelivr + SRI). Shared by Pulsefit BS6 surfaces and docs. */
export const BOOTSTRAP6_CSS =
  'https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css'
export const BOOTSTRAP6_CSS_SRI =
  'sha384-B/GM4XqrwHnWXNOWMbloTmrYXZg10cakYGmpfsR/bbzQ6JAJI4ihuyADKLnBgrCe'
export const BOOTSTRAP6_JS =
  'https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js'
export const BOOTSTRAP6_JS_SRI =
  'sha384-1a/pXj49ZQ1aHEmrJ+gMw1otqoVsYwlEnlD8mIfY2TV03r20Y0CN7uqx1tQogjPL'

export function bootstrap6StylesheetLink(): string {
  return `<link rel="stylesheet" href="${BOOTSTRAP6_CSS}" integrity="${BOOTSTRAP6_CSS_SRI}" crossorigin="anonymous">`
}

export function bootstrap6ModuleScript(): string {
  return `<script type="module" src="${BOOTSTRAP6_JS}" integrity="${BOOTSTRAP6_JS_SRI}" crossorigin="anonymous"></script>`
}
