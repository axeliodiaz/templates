# Molecules

Composed components: feedback, overlays, navigation, and conversation pieces. Alerts stay on the page. Toasts confirm without interrupting. Collapse hides secondary detail. Accordion keeps one section open.


## Accordion {#accordion}

<div class="fx-preview" data-fx="accordion"><details class="fx-acc" open><summary>¿Cuándo llega?</summary><p>En 1–3 días hábiles.</p></details><details class="fx-acc"><summary>¿Hay comisión?</summary><p>La comisión es $0.00.</p></details></div>

Collapsible sections. One open at a time.

Organizes content into collapsible sections where only one stays open at a time, ideal for FAQs. Import Accordion, AccordionItem, AccordionTrigger, and AccordionContent from @felix/ui. Use type set to single with collapsible to allow closing them all, and give each AccordionItem a unique value.

## Alert {#alert}

<div class="fx-preview fx-stack"><div class="fx-alert ok"><strong>Transferencia completada.</strong> María ya puede retirarla.</div><div class="fx-alert warn"><strong>En camino.</strong> Llega en 1–3 días hábiles.</div><div class="fx-alert err"><strong>No se pudo enviar.</strong> Revisa los datos de la cuenta.</div></div>

Contextual status message.

Status message that lives on the page without interrupting: transfer completed, on its way, or failed. Import Alert together with AlertTitle and AlertDescription from @felix/ui and pick the tone with variant: success, warning, or error. For transient notices use toast; Alert stays fixed in the layout.

## Attachment {#attachment}

<div class="fx-preview fx-row"><div class="fx-file"><b>recibo.pdf</b><small>PDF · 240 KB</small><button type="button" data-remove aria-label="Quitar">×</button></div><div class="fx-file err"><b>foto.jpg</b><small>No se pudo adjuntar</small><button type="button" data-remove aria-label="Quitar">×</button></div></div>

Attached file or image chip. 3 sizes × 3 states × 2 types.

The attachment that travels with a message or the chat composer: a PDF receipt, a photo of the ticket. Import it from @felix/ui and pass name and meta (format · size). Pick size (sm, md, or lg), state (default, error, or loading, which shows a spinner and a progress bar driven by progress) and type (file or image; image + lg becomes a vertical card with a thumbnail). The close button fires onRemove; label it with removeLabel.

## Breadcrumb {#breadcrumb}

<div class="fx-preview"><nav class="fx-crumbs">Envíos / México / Confirmación</nav></div>

Hierarchical navigation trail.

Shows the hierarchical trail and lets users go back up levels in deep flows. Import Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, and BreadcrumbSeparator from @felix/ui. Use BreadcrumbLink with href for navigable levels and BreadcrumbPage for the current page.

## Calendar {#calendar}

<div class="fx-preview" data-fx="calendar"><div class="fx-cal"><div class="fx-cal-h"></div><div class="fx-cal-g"></div></div></div>

Calendar to pick a date.

Calendar to pick a date directly on the page, for example when scheduling a transfer. Import it from @felix/ui with mode set to single and control the selection with selected and onSelect. If you need the calendar inside a form field, use DatePicker.

## Card {#card}

<div class="fx-preview"><div class="fx-card"><div class="fx-card-title">Resumen</div><p>Envías $100.00 · Recibe $1,724.00 MXN</p></div></div>

Content container. Border or shadow, never both.

Base container to group related information, like a transfer summary. Import Card with CardHeader, CardTitle, CardDescription, CardContent, and CardFooter from @felix/ui and compose only the parts you need. System rule: a Card uses a border or a shadow, never both.

## ChoiceCard {#choicecard}

<div class="fx-preview fx-row" data-fx="choice"><button type="button" class="fx-choice on"><b>Depósito</b><small>A su cuenta</small></button><button type="button" class="fx-choice"><b>Efectivo</b><small>Elektra</small></button></div>

Mutually-exclusive option cards (rich radio).

Rich radio in card form for key decisions, like choosing between cash pickup and bank deposit. Import ChoiceCardGroup and ChoiceCard from @felix/ui: control the group with value and onValueChange, and give each card value, icon, title, and description. Use it when the options deserve more weight than a RadioGroup.

## Collapse {#collapse}

<div class="fx-preview"><details class="fx-collapse" open><summary>Tipo de cambio</summary><p>1 USD = 17.24 MXN. La comisión es $0.00.</p></details></div>

Content that expands and collapses.

Shows or hides a block of secondary content, like the exchange rate detail. Import Collapse, CollapseTrigger, and CollapseContent from @felix/ui and control it with open and onOpenChange. Unlike Accordion, it's a single standalone block.

## DatePicker {#datepicker}

<div class="fx-preview" data-fx="datepicker"><label class="fx-field"><span>Fecha</span><button type="button" class="fx-date-btn">10 sep 2026</button></label><div class="fx-cal fx-date-pop" hidden><div class="fx-cal-h"></div><div class="fx-cal-g"></div></div></div>

Field with a calendar in a popover.

Form field that opens a calendar in a popover, ideal for picking dates without taking over the screen. Import it from @felix/ui and control it with value and onChange; customize the empty text with placeholder. If the date is the focus of the screen, use Calendar directly.

## Dialog {#dialog}

<div class="fx-preview" data-fx="overlay"><button class="fx-btn fx-btn-primary" type="button" data-open>Confirmar envío</button><div class="fx-scrim"><div class="fx-dialog"><b>¿Enviar $100.00?</b><p>María recibe $1,724.00 MXN.</p><div class="fx-row"><button class="fx-btn fx-btn-primary" type="button" data-close>Confirmar</button><button class="fx-btn fx-btn-line" type="button" data-close>Volver</button></div></div></div></div>

Centered modal dialog for confirmations.

Centered modal for confirmations that demand full attention, like confirming a money transfer. Import Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, and DialogClose from @felix/ui. Wrap the opening button with DialogTrigger asChild and close it with DialogClose. For longer mobile flows, consider Drawer.

## Drawer {#drawer}

<div class="fx-preview" data-fx="overlay"><button class="fx-btn fx-btn-line" type="button" data-open>Ver detalle</button><div class="fx-scrim fx-scrim-end"><div class="fx-drawer"><b>Detalle</b><p>Referencia FX-20491</p><button class="fx-btn fx-btn-primary" type="button" data-close>Cerrar</button></div></div></div>

Edge-anchored sliding panel (mobile-first).

Panel that slides in from the edge of the screen, mobile-first for details and quick actions. Import Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, and DrawerClose from @felix/ui, and open it by wrapping the trigger with DrawerTrigger asChild. For one-off confirmations on desktop, prefer Dialog.

## DropdownMenu {#dropdownmenu}

<div class="fx-preview"><details class="fx-menu"><summary class="fx-btn fx-btn-line">Cuenta</summary><div><button type="button">Perfil</button><button type="button">Salir</button></div></details></div>

Contextual menu anchored to a trigger.

Contextual action menu anchored to a button, like the account menu. Import DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, and DropdownMenuSeparator from @felix/ui. Wrap the trigger with DropdownMenuTrigger asChild and group actions with DropdownMenuSeparator. To pick a form value, use Select.

## HoverCard {#hovercard}

<div class="fx-preview"><span class="fx-hover-wrap"><button type="button" class="fx-btn fx-btn-line">María</button><div class="fx-hover"><span class="fx-avatar sm">MA</span><div><b>María Álvarez</b><small>CDMX · Elektra</small></div></div></span></div>

Card that appears on hover.

Card with extra context that appears on hover, like a recipient's profile. Import HoverCard, HoverCardTrigger, and HoverCardContent from @felix/ui, wrapping the element with HoverCardTrigger asChild. Since there's no hover on touch, don't put critical information in it.

## Message {#message}

<div class="fx-preview"><div class="fx-msg"><span class="fx-avatar sm">MA</span><div><small>María · 14:03</small><div class="fx-bubble them">Ya lo recibí, gracias.</div></div></div></div>

One thread entry: avatar, sender, Bubble, and time.

One entry in the conversation: an optional avatar plus a column with a header (who's writing), a Bubble, and a footer (time or read state). Import Message, MessageAvatar, MessageContent, MessageHeader, and MessageFooter from @felix/ui. With align='start' the avatar sits on the left and content aligns to the start (the other party); align='end' mirrors it (your messages). Always write the avatar first in JSX: align handles the visual order. To give a newly arrived message a short entrance, pass animateIn; don't use it on history that was already loaded.

## NavigationMenu {#navigationmenu}

<div class="fx-preview" data-fx="select-one"><nav class="fx-nav"><button type="button" data-item class="on">Envíos</button><button type="button" data-item>Recargas</button><button type="button" data-item>Historial</button></nav></div>

Primary navigation with dropdown menus.

Horizontal primary navigation with dropdown menus, typical of the site header. Import NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, and NavigationMenuLink from @felix/ui. Use NavigationMenuTrigger with NavigationMenuContent for dropdowns and NavigationMenuLink with href for direct links.

## Pagination {#pagination}

<div class="fx-preview" data-fx="pages"><div class="fx-row"><button class="fx-page" type="button" data-dir="prev">‹</button><button class="fx-page on" type="button" data-page="1">1</button><button class="fx-page" type="button" data-page="2">2</button><button class="fx-page" type="button" data-page="3">3</button><button class="fx-page" type="button" data-dir="next">›</button></div><p class="fx-body" data-page-label>Página 1 de 3</p></div>

Navigation across pages of results.

Navigation across long result sets, like the transfer history. Import Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, and PaginationEllipsis from @felix/ui. Mark the current page with isActive on PaginationLink and compress long ranges with PaginationEllipsis.

## Popover {#popover}

<div class="fx-preview"><details class="fx-menu"><summary class="fx-btn fx-btn-line">Tipo de cambio</summary><div class="fx-pop"><b>Tipo de cambio</b><p>1 USD = 17.24 MXN</p></div></details></div>

Floating panel anchored to a trigger.

Floating panel anchored to a trigger for lightweight content, like the exchange rate detail. Import Popover, PopoverTrigger, and PopoverContent from @felix/ui, wrapping the button with PopoverTrigger asChild. Unlike Tooltip it opens on click and can hold interactive elements.

## Select {#select}

<div class="fx-preview"><label class="fx-field"><span>País</span><select><option>México</option><option>Guatemala</option></select></label></div>

Select one option from a list.

Pick one option from a dropdown list, like the destination country. Import Select, SelectTrigger, SelectValue, SelectContent, and SelectItem from @felix/ui. Set the placeholder on SelectValue and give each SelectItem a unique value. With few options, consider RadioGroup to keep them all visible.

## Sheet {#sheet}

<div class="fx-preview" data-fx="overlay"><button class="fx-btn fx-btn-line" type="button" data-open>Abrir detalle</button><div class="fx-scrim fx-scrim-end"><div class="fx-sheet"><b>Detalle del envío</b><p>Estado: en camino</p><button class="fx-btn fx-btn-primary" type="button" data-close>Cerrar</button></div></div></div>

Side panel for secondary flows.

Side panel for secondary flows that don't warrant a page change, like a transfer's detail. Import Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, and SheetFooter from @felix/ui. Open it by wrapping the trigger with SheetTrigger asChild and close it with SheetClose.

## SidebarFooter {#sidebarfooter}

<div class="fx-preview"><div class="fx-sfoot"><span class="fx-avatar sm">AD</span><div><b>Axel Díaz</b><small>axel@felixpago.com</small></div></div></div>

Sidebar footer with the user's account.

Sidebar footer showing the active user's account. Import it from @felix/ui and pass name, email, and an avatar, usually an Avatar with AvatarFallback at size sm. It goes as the Sidebar's last child, below SidebarBody.

## Stepper {#stepper}

<div class="fx-preview" data-fx="select-one"><ol class="fx-steps"><li><button type="button" data-item class="done">Monto</button></li><li><button type="button" data-item class="on">Destino</button></li><li><button type="button" data-item>Confirmar</button></li></ol></div>

Step progress through a flow.

Shows step-by-step progress through a flow, like amount, recipient, and confirmation. Import Stepper from @felix/ui and define each step with Stepper.Step as children. Set the current step with activeIndex (zero-based); previous steps are marked as completed.

## Table {#table}

<div class="fx-preview"><table class="fx-table"><thead><tr><th>Fecha</th><th>Destino</th><th>Estado</th></tr></thead><tbody><tr><td>10 sep</td><td>María</td><td>En camino</td></tr><tr><td>02 sep</td><td>Luis</td><td>Completado</td></tr></tbody></table></div>

Tabular data with a header.

Presents tabular data like the transfer history. Import Table, TableHeader, TableBody, TableRow, TableHead, and TableCell from @felix/ui. Use TableHead for header cells and TableCell for data cells. For long lists, add Pagination.

## Tabs {#tabs}

<div class="fx-preview" data-fx="tabs"><div class="fx-tabs"><button type="button" class="fx-tab is-on" data-tab="envios">Envíos</button><button type="button" class="fx-tab" data-tab="recargas">Recargas</button></div><p class="fx-body" data-panel="envios">Tu historial de envíos aparece aquí.</p><p class="fx-body" data-panel="recargas" hidden>Tus recargas aparecen aquí.</p></div>

Switchable views under one area.

Switches between same-level views within one area, like transfers and top-ups. Import Tabs, TabsList, TabsTrigger, and TabsContent from @felix/ui. Set the initial tab with defaultValue and link each TabsTrigger to its TabsContent using the same value.

## Toast {#toast}

<div class="fx-preview" data-fx="toast"><button class="fx-btn fx-btn-primary" type="button" data-fire>Mostrar toast</button><div class="fx-toast" hidden>Transferencia enviada</div></div>

Transient notification. Fire with toast(...).

Transient notification that confirms an action without interrupting, like a completed transfer. Mount the Toaster once in the app (you can place it with position) and import the toast function from @felix/ui. Fire it with toast(title, options) passing a description, or use toast.secondary for the alternate style.

## Tooltip {#tooltip}

<div class="fx-preview"><span class="fx-tip" data-tip="Copiar referencia">Referencia</span></div>

Brief label on hover or focus.

Brief label that clarifies a control on hover or keyboard focus. Import Tooltip, TooltipProvider, TooltipTrigger, and TooltipContent from @felix/ui. Wrap the area with TooltipProvider and the trigger with TooltipTrigger asChild. Short text only and never essential information: there's no hover on touch.
