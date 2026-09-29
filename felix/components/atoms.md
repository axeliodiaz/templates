# Atoms

Smallest pieces in `@felix/ui`. One primary button per screen. Buttons are always pills.


## Amount {#amount}

<div class="fx-preview"><div class="fx-amount">$1,724<span>.00</span> <small>MXN</small></div></div>

Plain amount whose digits roll when the value changes.

Shows a screen's hero amount, like what you send or what the other person receives. Import it from @felix/ui, pass value, currency and locale, and pick the size with size (xl, lg or md). When the value changes, only the changed digits roll and the number keeps its width. With reduced motion the change is instant. In lists or tables where many amounts change at once, pass animated={false}.

## Avatar {#avatar}

<div class="fx-preview fx-row"><span class="fx-avatar">MA</span><span class="fx-avatar sm">JL</span><span class="fx-avatar ok">AR</span></div>

Profile image with initials fallback, 5 sizes, and status.

Represents a person in recipient lists, headers, and receipts. Import it from @felix/ui together with AvatarFallback for initials when there's no photo. Control the size with size (xs to xl) and show a status dot with status (success, warning, danger, or neutral).

## Badge {#badge}

<div class="fx-preview fx-row"><span class="fx-badge">En camino</span><span class="fx-badge fx-badge-lime">Promo</span><span class="fx-badge fx-badge-warn">Pendiente</span><span class="fx-badge fx-badge-err">Fallido</span><span class="fx-badge fx-badge-slate">Beta</span></div>

Pill label for status and metadata.

Compact read-only label for status and metadata: promos, transfer states, beta features. Import it from @felix/ui and pick the style with variant: default, secondary, destructive, outline, ghost, or dark. It's not interactive; if you need an action, use Button or IconButton.

## Bubble {#bubble}

<div class="fx-preview fx-stack"><div class="fx-bubble">Listo, María. Ya salió tu envío.</div><div class="fx-bubble them">¿Cuánto llega?</div></div>

Body of a chat message. 7 variants; 24 px radius.

The balloon that wraps a message's text in a conversation. Import it from @felix/ui and pick the tone with variant: default (turquoise, your messages), secondary, muted (the other party), tinted, outline, ghost (no frame, ideal for AI replies or markdown) or destructive (error). It hugs its content: constrain the width from the container or let Message handle it.

## Button {#button}

<div class="fx-preview fx-row"><button class="fx-btn fx-btn-primary" type="button">Enviar</button><button class="fx-btn fx-btn-secondary" type="button">Cancelar</button><button class="fx-btn fx-btn-ghost" type="button">Ghost</button><button class="fx-btn fx-btn-line" type="button">Line</button><button class="fx-btn fx-btn-danger" type="button">Danger</button></div>

Primary action. 5 variants and 3 sizes; always a pill.

The main action on every screen, always pill-shaped. Import it from @felix/ui and choose variant (primary, secondary, ghost, line, or danger) and size (sm, md, or lg). It accepts disabled and fullWidth to span the full width. System rule: only one primary button per screen.

## Checkbox {#checkbox}

<div class="fx-preview"><label class="fx-check"><input type="checkbox" checked> Acepto los términos</label><label class="fx-check"><input type="checkbox"> Guardar destinatario</label></div>

Multi-select. Compose with Label via id.

Select one or more independent options, like accepting terms or applying filters. Import it from @felix/ui and pair it with Label by connecting id and htmlFor. It supports defaultChecked and disabled; if there's no visible label, pass an aria-label.

## CoinLoader {#coinloader}

<div class="fx-preview"><span class="fx-coin" aria-hidden="true"></span></div>

Branded loader (Felix's coin) for longer waits.

Branded loader featuring Felix's coin for longer waits, like processing a transfer. Import it from @felix/ui, set the size with size (sm, md, or lg), and pass a descriptive label for screen readers. For short or inline loads, prefer Spinner or Dots.

## Dots {#dots}

<div class="fx-preview"><span class="fx-dots" aria-hidden="true"><i></i><i></i><i></i></span></div>

Compact inline loading indicator.

Compact loading indicator for inline contexts, like inside a button or next to text. Import it from @felix/ui, pick the size with size (sm, md, or lg), and pass an accessible label. For longer branded waits, use CoinLoader.

## IconButton {#iconbutton}

<div class="fx-preview fx-row"><button class="fx-icon fx-btn-primary" type="button" aria-label="Editar">✎</button><button class="fx-icon fx-btn-line" type="button" aria-label="Cerrar">×</button></div>

Icon-only button. Same variants as Button. aria-label required.

Icon-only button for compact actions like edit, delete, or add. Import it from @felix/ui, pass the icon through the icon prop, and choose variant (primary, secondary, ghost, line, or danger) and size (sm, md, or lg), same as Button. The aria-label is required because there's no visible text.

## Input {#input}

<div class="fx-preview"><label class="fx-field"><span>Monto</span><input value="100.00"></label></div>

Text field with floating label and helper/error.

Single-line text field with a floating label, ideal for amounts, emails, and recipient data. Import it from @felix/ui and pass the text through the label prop. Use description for helper text below the field and error for the validation message, which replaces it and turns the field red.

## Label {#label}

<div class="fx-preview"><span class="fx-label">Correo del destinatario</span></div>

Accessible name for a control.

Pairs with Input, Checkbox, RadioGroup, and Switch through id and htmlFor. Import it from @felix/ui.

## Logo {#logo}

<div class="fx-preview"><span class="fx-logo">felix</span></div>

Felix mark: logotype and symbol.

The Felix mark for headers, sidebars, and loading screens. Import it from @felix/ui and pick the form with type: logotype for the full wordmark, symbol for the standalone symbol, or symbol-circular for the circular version. Control the size through the height via style or className, without distorting it.

## Marker {#marker}

<div class="fx-preview"><div class="fx-marker"><span>Hoy</span></div></div>

Thread annotation: system event or date divider.

A low-emphasis line inside a conversation that is not a message: a system event or a date divider. Import it from @felix/ui and pick variant: default (icon + text), separator (centered text between two hairlines, ideal for 'Today') or border (icon + text with a bottom hairline). The default icon is Phosphor's GitBranch; replace it with icon or pass null to omit it.

## Progress {#progress}

<div class="fx-preview"><div class="fx-progress"><span style="width:62%"></span></div></div>

Determinate progress bar.

Determinate progress bar for processes with measurable progress, like completing a profile or uploading a document. Import it from @felix/ui and pass the percentage with value (0 to 100), plus an aria-label describing the progress. If the progress is unknown, use Spinner or CoinLoader.

## RadioGroup {#radiogroup}

<div class="fx-preview"><label class="fx-check"><input type="radio" name="ch" checked> WhatsApp</label><label class="fx-check"><input type="radio" name="ch"> Correo</label></div>

Single choice among options. Compose with Label.

Single choice among a few visible options, like the notification channel. Import RadioGroup and RadioGroupItem from @felix/ui, set the initial option with defaultValue, and pair each item with Label by connecting id and htmlFor. If the options call for more visual weight, use ChoiceCard.

## Separator {#separator}

<div class="fx-preview"><div class="fx-sep"><span>o</span></div></div>

Horizontal or vertical divider, with or without a label.

Subtle divider to separate related blocks of content. Import it from @felix/ui; it's horizontal by default, and with orientation set to vertical it separates inline elements, like footer links. It accepts a label prop for divider text, like the classic or between sign-in methods.

## Skeleton {#skeleton}

<div class="fx-preview fx-stack"><span class="fx-skel w1"></span><span class="fx-skel w2"></span></div>

Loading placeholder: text, block, or circle.

Loading placeholder that mimics the shape of the content while data arrives. Import it from @felix/ui and pick the shape with type: text, block, or circle. Size it with className using utilities like w-full or size-12, and combine several to mirror the real layout.

## Slider {#slider}

<div class="fx-preview"><input class="fx-slider" type="range" value="40"></div>

Select a single value or a range.

Pick a single value or a range by dragging along a track, useful for amounts or filters. Import it from @felix/ui and pass defaultValue as an array: one element for a single value, two for a range. Add an aria-label when there's no visible label.

## Spinner {#spinner}

<div class="fx-preview"><span class="fx-spin" aria-hidden="true"></span></div>

Circular loading indicator.

Circular loading indicator for short, generic waits. Import it from @felix/ui, set the size with size (sm, md, or lg), and pass a label for accessibility. For longer branded waits use CoinLoader; for inline contexts, Dots.

## Switch {#switch}

<div class="fx-preview"><label class="fx-switch"><input type="checkbox" checked><span></span> Notificaciones</label></div>

On/off toggle. Compose with Label via id.

On/off toggle for preferences that apply instantly, like enabling notifications. Import it from @felix/ui and pair it with Label by connecting id and htmlFor. It supports defaultChecked and disabled; use aria-label when there's no visible label. For options confirmed with a button, prefer Checkbox.

## Text {#text}

<div class="fx-preview"><p class="fx-lead">Envía dinero a tu familia.</p><p class="fx-body">Llega en 1–3 días hábiles.</p></div>

Typographic primitive for body, heading, and caption roles.

Renders copy in the Saans/Plain scale. Import it from @felix/ui and pick the role instead of setting raw font sizes.

## Textarea {#textarea}

<div class="fx-preview"><label class="fx-field"><span>Nota</span><textarea rows="3">Para la renta de mamá</textarea></label></div>

Multi-line text input with floating label.

Multi-line text input with a floating label for messages and notes, like the note on a transfer. Import it from @felix/ui, pass the text through label, and control the initial height with rows. It shares styling and states with Input.
