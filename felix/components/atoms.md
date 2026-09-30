# Atoms

Smallest pieces in `@felix/ui`. One primary button per screen. Buttons are always pills.

## Amount {#amount}

Plain amount whose digits roll when the value changes.

### Cambia el monto

<div class="fx-preview fx-stack" data-fx="amount"><div class="fx-amount lg" data-amount-value="200">$200<span>.00</span> <small>USD</small></div><div class="fx-amount md">$1,200<span>.00</span> <small>USD</small></div><div class="fx-row"><button class="fx-btn fx-btn-line" type="button" data-amt="-25">−$25</button><button class="fx-btn fx-btn-line" type="button" data-amt="25">+$25</button></div></div>

Shows a screen's hero amount, like what you send or what the other person receives. Import it from @felix/ui, pass value, currency and locale, and pick the size with size (xl, lg or md). When the value changes, only the changed digits roll and the number keeps its width. With reduced motion the change is instant. In lists or tables where many amounts change at once, pass animated={false}.

## Avatar {#avatar}

Profile image with initials fallback, 5 sizes, and status.

### Tamaños · xs → xl

<div class="fx-preview fx-row"><span class="fx-avatar xs">MG</span><span class="fx-avatar sm">MG</span><span class="fx-avatar">MG</span><span class="fx-avatar lg">MG</span><span class="fx-avatar xl">MG</span></div>

### Estado

<div class="fx-preview fx-row"><span class="fx-avatar ok">MG</span><span class="fx-avatar warn">MG</span><span class="fx-avatar err">MG</span><span class="fx-avatar neutral">MG</span></div>

Represents a person in recipient lists, headers, and receipts. Import it from @felix/ui together with AvatarFallback for initials when there's no photo. Control the size with size (xs to xl) and show a status dot with status (success, warning, danger, or neutral).

## Badge {#badge}

Pill label for status and metadata.

### Variantes

<div class="fx-preview fx-row"><span class="fx-badge">Nuevo</span><span class="fx-badge fx-badge-secondary">Promo</span><span class="fx-badge fx-badge-destructive">Cancelado</span><span class="fx-badge fx-badge-ghost">Borrador</span><span class="fx-badge fx-badge-outline">Etiqueta</span><span class="fx-badge fx-badge-slate">Beta</span></div>

Compact read-only label for status and metadata: promos, transfer states, beta features. Import it from @felix/ui and pick the style with variant: default, secondary, destructive, outline, ghost, or dark. It's not interactive; if you need an action, use Button or IconButton.

## Bubble {#bubble}

Body of a chat message. 7 variants; 24 px radius.

### Variantes

<div class="fx-preview fx-stack"><div class="fx-bubble">¿Cómo va tu envío?</div><div class="fx-bubble them">¡Ya llegó, gracias!</div><div class="fx-bubble secondary">¡Hola! ¿Cómo va tu envío?</div><div class="fx-bubble tinted">¡Va muy bien, gracias por preguntar!</div><div class="fx-bubble ghost">Este es contenido sin marco, como una respuesta de IA o un bloque de markdown.</div><div class="fx-bubble outline">Tengo una duda sobre la comisión.</div><div class="fx-bubble destructive">Error: algo salió mal con la solicitud.</div></div>

The balloon that wraps a message's text in a conversation. Import it from @felix/ui and pick the tone with variant: default (turquoise, your messages), secondary, muted (the other party), tinted, outline, ghost (no frame, ideal for AI replies or markdown) or destructive (error). It hugs its content: constrain the width from the container or let Message handle it.

## Button {#button}

Primary action. 5 variants and 3 sizes; always a pill.

### Variantes

<div class="fx-preview fx-row"><button class="fx-btn fx-btn-primary" type="button">Enviar</button><button class="fx-btn fx-btn-secondary" type="button">Secundario</button><button class="fx-btn fx-btn-ghost" type="button">Ahora no</button><button class="fx-btn fx-btn-line" type="button">Editar</button><button class="fx-btn fx-btn-danger" type="button">Eliminar</button></div>

### Tamaños

<div class="fx-preview fx-row"><button class="fx-btn fx-btn-primary fx-btn-sm" type="button">sm · 36</button><button class="fx-btn fx-btn-primary fx-btn-md" type="button">md · 48</button><button class="fx-btn fx-btn-primary fx-btn-lg" type="button">lg · 56</button></div>

### Estados

<div class="fx-preview fx-stack"><button class="fx-btn fx-btn-primary" type="button" disabled>Deshabilitado</button><button class="fx-btn fx-btn-primary fx-btn-block" type="button">Ancho completo</button></div>

The main action on every screen, always pill-shaped. Import it from @felix/ui and choose variant (primary, secondary, ghost, line, or danger) and size (sm, md, or lg). It accepts disabled and fullWidth to span the full width. System rule: only one primary button per screen.

## Checkbox {#checkbox}

Multi-select. Compose with Label via id.

### Estados

<div class="fx-preview fx-row"><label class="fx-check"><input type="checkbox" aria-label="Opción"></label><label class="fx-check"><input type="checkbox" checked aria-label="Opción"></label><label class="fx-check"><input type="checkbox" disabled aria-label="Opción"></label></div>

### Con etiqueta

<div class="fx-preview"><label class="fx-check"><input type="checkbox" checked> Acepto los términos</label></div>

Select one or more independent options, like accepting terms or applying filters. Import it from @felix/ui and pair it with Label by connecting id and htmlFor. It supports defaultChecked and disabled; if there's no visible label, pass an aria-label.

## CoinLoader {#coinloader}

Branded loader (Felix's coin) for longer waits.

### Tamaños

<div class="fx-preview fx-row"><span class="fx-coin fx-coin-sm" aria-hidden="true"></span><span class="fx-coin" aria-hidden="true"></span><span class="fx-coin fx-coin-lg" aria-hidden="true"></span></div>

Branded loader featuring Felix's coin for longer waits, like processing a transfer. Import it from @felix/ui, set the size with size (sm, md, or lg), and pass a descriptive label for screen readers. For short or inline loads, prefer Spinner or Dots.

## Dots {#dots}

Compact inline loading indicator.

### Tamaños

<div class="fx-preview fx-row"><span class="fx-dots fx-dots-sm" aria-hidden="true"><i></i><i></i><i></i></span><span class="fx-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="fx-dots fx-dots-lg" aria-hidden="true"><i></i><i></i><i></i></span></div>

Compact loading indicator for inline contexts, like inside a button or next to text. Import it from @felix/ui, pick the size with size (sm, md, or lg), and pass an accessible label. For longer branded waits, use CoinLoader.

## IconButton {#iconbutton}

Icon-only button. Same variants as Button. aria-label required.

### Variantes

<div class="fx-preview fx-row"><button class="fx-icon fx-btn-primary" type="button" aria-label="Editar">✎</button><button class="fx-icon fx-btn-secondary" type="button" aria-label="Secundario">✎</button><button class="fx-icon fx-btn-ghost" type="button" aria-label="Ghost">✎</button><button class="fx-icon fx-btn-line" type="button" aria-label="Line">✎</button><button class="fx-icon fx-btn-danger" type="button" aria-label="Eliminar">×</button></div>

### Tamaños

<div class="fx-preview fx-row"><button class="fx-icon fx-btn-primary fx-btn-sm" type="button" aria-label="Editar">✎</button><button class="fx-icon fx-btn-primary fx-btn-md" type="button" aria-label="Editar">✎</button><button class="fx-icon fx-btn-primary fx-btn-lg" type="button" aria-label="Editar">✎</button></div>

Icon-only button for compact actions like edit, delete, or add. Import it from @felix/ui, pass the icon through the icon prop, and choose variant (primary, secondary, ghost, line, or danger) and size (sm, md, or lg), same as Button. The aria-label is required because there's no visible text.

## Input {#input}

Text field with floating label and helper/error.

### Estados

<div class="fx-preview fx-stack"><label class="fx-field"><span>Monto a enviar</span><input value="$60.00 USD"><small class="fx-help">Comisión $0.00 — sin sorpresas.</small></label><label class="fx-field fx-field-error"><span>Correo</span><input value="maria@"><small class="fx-help">Ingresa un correo válido.</small></label></div>

Single-line text field with a floating label, ideal for amounts, emails, and recipient data. Import it from @felix/ui and pass the text through the label prop. Use description for helper text below the field and error for the validation message, which replaces it and turns the field red.

## Label {#label}

Accessible name for a control.

### Variantes

<div class="fx-preview fx-row"><span class="fx-label required">Campo obligatorio</span><span class="fx-label">Etiqueta por defecto</span><span class="fx-label optional">Campo opcional</span><span class="fx-label disabled">Campo deshabilitado</span></div>

Pairs with Input, Checkbox, RadioGroup, and Switch through id and htmlFor. Import it from @felix/ui.

## Logo {#logo}

Felix mark: logotype and symbol.

### Tipos

<div class="fx-preview fx-row"><span class="fx-logo">felix</span><span class="fx-logo-symbol"></span><span class="fx-logo-circle"></span></div>

The Felix mark for headers, sidebars, and loading screens. Import it from @felix/ui and pick the form with type: logotype for the full wordmark, symbol for the standalone symbol, or symbol-circular for the circular version. Control the size through the height via style or className, without distorting it.

## Marker {#marker}

Thread annotation: system event or date divider.

### Variantes

<div class="fx-preview fx-stack"><div class="fx-marker-default">Cambió a una nueva conversación</div><div class="fx-marker-sep">Hoy</div><div class="fx-marker-border">Cambió a soporte prioritario</div></div>

A low-emphasis line inside a conversation that is not a message: a system event or a date divider. Import it from @felix/ui and pick variant: default (icon + text), separator (centered text between two hairlines, ideal for 'Today') or border (icon + text with a bottom hairline). The default icon is Phosphor's GitBranch; replace it with icon or pass null to omit it.

## Progress {#progress}

Determinate progress bar.

### Valores

<div class="fx-preview fx-stack"><div class="fx-progress"><span style="width:25%"></span></div><div class="fx-progress"><span style="width:60%"></span></div><div class="fx-progress"><span style="width:100%"></span></div></div>

Determinate progress bar for processes with measurable progress, like completing a profile or uploading a document. Import it from @felix/ui and pass the percentage with value (0 to 100), plus an aria-label describing the progress. If the progress is unknown, use Spinner or CoinLoader.

## RadioGroup {#radiogroup}

Single choice among options. Compose with Label.

### Opciones

<div class="fx-preview fx-stack"><label class="fx-check"><input type="radio" name="fx-channel" checked> Correo</label><label class="fx-check"><input type="radio" name="fx-channel"> WhatsApp</label></div>

Single choice among a few visible options, like the notification channel. Import RadioGroup and RadioGroupItem from @felix/ui, set the initial option with defaultValue, and pair each item with Label by connecting id and htmlFor. If the options call for more visual weight, use ChoiceCard.

## Separator {#separator}

Horizontal or vertical divider, with or without a label.

### Orientaciones

<div class="fx-preview fx-stack"><div class="fx-sep"><span>o</span></div><div class="fx-sep-v"><span>Inicio</span><span>Envíos</span><span>Perfil</span></div></div>

Subtle divider to separate related blocks of content. Import it from @felix/ui; it's horizontal by default, and with orientation set to vertical it separates inline elements, like footer links. It accepts a label prop for divider text, like the classic or between sign-in methods.

## Skeleton {#skeleton}

Loading placeholder: text, block, or circle.

### Formas

<div class="fx-preview fx-row"><span class="fx-skel"></span><span class="fx-skel fx-skel-block"></span><span class="fx-skel fx-skel-circle"></span></div>

Loading placeholder that mimics the shape of the content while data arrives. Import it from @felix/ui and pick the shape with type: text, block, or circle. Size it with className using utilities like w-full or size-12, and combine several to mirror the real layout.

## Slider {#slider}

Select a single value or a range.

### Valor y rango

<div class="fx-preview fx-stack"><input class="fx-slider" type="range" value="40" aria-label="Monto"><div class="fx-row"><input class="fx-slider" type="range" value="20" aria-label="Mínimo"><input class="fx-slider" type="range" value="80" aria-label="Máximo"></div></div>

Pick a single value or a range by dragging along a track, useful for amounts or filters. Import it from @felix/ui and pass defaultValue as an array: one element for a single value, two for a range. Add an aria-label when there's no visible label.

## Spinner {#spinner}

Circular loading indicator.

### Tamaños

<div class="fx-preview fx-row"><span class="fx-spin fx-spin-sm" aria-hidden="true"></span><span class="fx-spin" aria-hidden="true"></span><span class="fx-spin fx-spin-lg" aria-hidden="true"></span></div>

Circular loading indicator for short, generic waits. Import it from @felix/ui, set the size with size (sm, md, or lg), and pass a label for accessibility. For longer branded waits use CoinLoader; for inline contexts, Dots.

## Switch {#switch}

On/off toggle. Compose with Label via id.

### Estados

<div class="fx-preview fx-row"><label class="fx-switch"><input type="checkbox" aria-label="Desactivado"><span></span></label><label class="fx-switch"><input type="checkbox" checked aria-label="Activado"><span></span></label><label class="fx-switch"><input type="checkbox" checked disabled aria-label="Deshabilitado"><span></span></label></div>

### Con etiqueta

<div class="fx-preview fx-stack"><label class="fx-switch"><input type="checkbox" checked><span></span> Notificaciones</label><label class="fx-switch"><input type="checkbox"><span></span> Notificaciones por WhatsApp</label></div>

On/off toggle for preferences that apply instantly, like enabling notifications. Import it from @felix/ui and pair it with Label by connecting id and htmlFor. It supports defaultChecked and disabled; use aria-label when there's no visible label. For options confirmed with a button, prefer Checkbox.

## Text {#text}

Typographic primitive for body, heading, and caption roles.

### Variantes

<div class="fx-preview fx-stack"><p class="fx-t fx-t-display-md">$1,020.00</p><p class="fx-t fx-t-heading-3">Título de sección</p><p class="fx-t fx-t-body">Texto de cuerpo para instrucciones y descripciones claras.</p><p class="fx-t fx-t-caption">RECIBIDO · HACE 2 MIN</p></div>

Renders copy in the Saans/Plain scale. Import it from @felix/ui and pick the role instead of setting raw font sizes.

## Textarea {#textarea}

Multi-line text input with floating label.

### Por defecto

<div class="fx-preview"><label class="fx-field"><span>Mensaje para María</span><textarea rows="4"></textarea></label></div>

Multi-line text input with a floating label for messages and notes, like the note on a transfer. Import it from @felix/ui, pass the text through label, and control the initial height with rows. It shares styling and states with Input.
