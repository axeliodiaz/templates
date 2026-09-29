# Molecules

Composed components: feedback, overlays, navigation, and conversation pieces. Alerts stay on the page. Toasts confirm without interrupting. Collapse hides secondary detail. Accordion keeps one section open.


<div class="fx-stack">
  <div class="fx-alert"><strong>Transferencia en camino.</strong> María la recibe en 1–3 días hábiles.</div>
  <details class="fx-collapse" open>
    <summary>Tipo de cambio</summary>
    <p>1 USD = 17.24 MXN. La comisión es $0.00.</p>
  </details>
  <div class="fx-card">
    <div class="fx-card-title">Resumen</div>
    <p>Envías $100.00 · Recibe $1,724.00 MXN</p>
  </div>
  <div class="fx-toast">Transferencia enviada</div>
  <div class="fx-tabs">
    <span class="fx-tab is-on">Envíos</span>
    <span class="fx-tab">Recargas</span>
  </div>
</div>

## Accordion {#accordion}

Collapsible sections. One open at a time.

Organizes content into collapsible sections where only one stays open at a time, ideal for FAQs. Import Accordion, AccordionItem, AccordionTrigger, and AccordionContent from @felix/ui. Use type set to single with collapsible to allow closing them all, and give each AccordionItem a unique value.

## Alert {#alert}

Contextual status message.

Status message that lives on the page without interrupting: transfer completed, on its way, or failed. Import Alert together with AlertTitle and AlertDescription from @felix/ui and pick the tone with variant: success, warning, or error. For transient notices use toast; Alert stays fixed in the layout.

## Attachment {#attachment}

Attached file or image chip. 3 sizes Ã 3 states Ã 2 types.

The attachment that travels with a message or the chat composer: a PDF receipt, a photo of the ticket. Import it from @felix/ui and pass name and meta (format · size). Pick size (sm, md, or lg), state (default, error, or loading, which shows a spinner and a progress bar driven by progress) and type (file or image; image + lg becomes a vertical card with a thumbnail). The close button fires onRemove; label it with removeLabel.

## Breadcrumb {#breadcrumb}

Hierarchical navigation trail.

Shows the hierarchical trail and lets users go back up levels in deep flows. Import Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, and BreadcrumbSeparator from @felix/ui. Use BreadcrumbLink with href for navigable levels and BreadcrumbPage for the current page.

## Calendar {#calendar}

Calendar to pick a date.

Calendar to pick a date directly on the page, for example when scheduling a transfer. Import it from @felix/ui with mode set to single and control the selection with selected and onSelect. If you need the calendar inside a form field, use DatePicker.

## Card {#card}

Content container. Border or shadow, never both.

Base container to group related information, like a transfer summary. Import Card with CardHeader, CardTitle, CardDescription, CardContent, and CardFooter from @felix/ui and compose only the parts you need. System rule: a Card uses a border or a shadow, never both.

## ChoiceCard {#choicecard}

Mutually-exclusive option cards (rich radio).

Rich radio in card form for key decisions, like choosing between cash pickup and bank deposit. Import ChoiceCardGroup and ChoiceCard from @felix/ui: control the group with value and onValueChange, and give each card value, icon, title, and description. Use it when the options deserve more weight than a RadioGroup.

## Collapse {#collapse}

Content that expands and collapses.

Shows or hides a block of secondary content, like the exchange rate detail. Import Collapse, CollapseTrigger, and CollapseContent from @felix/ui and control it with open and onOpenChange. Unlike Accordion, it's a single standalone block.

## DatePicker {#datepicker}

Field with a calendar in a popover.

Form field that opens a calendar in a popover, ideal for picking dates without taking over the screen. Import it from @felix/ui and control it with value and onChange; customize the empty text with placeholder. If the date is the focus of the screen, use Calendar directly.

## Dialog {#dialog}

Centered modal dialog for confirmations.

Centered modal for confirmations that demand full attention, like confirming a money transfer. Import Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, and DialogClose from @felix/ui. Wrap the opening button with DialogTrigger asChild and close it with DialogClose. For longer mobile flows, consider Drawer.

## Drawer {#drawer}

Edge-anchored sliding panel (mobile-first).

Panel that slides in from the edge of the screen, mobile-first for details and quick actions. Import Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, and DrawerClose from @felix/ui, and open it by wrapping the trigger with DrawerTrigger asChild. For one-off confirmations on desktop, prefer Dialog.

## DropdownMenu {#dropdownmenu}

Contextual menu anchored to a trigger.

Contextual action menu anchored to a button, like the account menu. Import DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, and DropdownMenuSeparator from @felix/ui. Wrap the trigger with DropdownMenuTrigger asChild and group actions with DropdownMenuSeparator. To pick a form value, use Select.

## HoverCard {#hovercard}

Card that appears on hover.

Card with extra context that appears on hover, like a recipient's profile. Import HoverCard, HoverCardTrigger, and HoverCardContent from @felix/ui, wrapping the element with HoverCardTrigger asChild. Since there's no hover on touch, don't put critical information in it.

## Message {#message}

One thread entry: avatar, sender, Bubble, and time.

One entry in the conversation: an optional avatar plus a column with a header (who's writing), a Bubble, and a footer (time or read state). Import Message, MessageAvatar, MessageContent, MessageHeader, and MessageFooter from @felix/ui. With align='start' the avatar sits on the left and content aligns to the start (the other party); align='end' mirrors it (your messages). Always write the avatar first in JSX: align handles the visual order. To give a newly arrived message a short entrance, pass animateIn; don't use it on history that was already loaded.

## NavigationMenu {#navigationmenu}

Primary navigation with dropdown menus.

Horizontal primary navigation with dropdown menus, typical of the site header. Import NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, and NavigationMenuLink from @felix/ui. Use NavigationMenuTrigger with NavigationMenuContent for dropdowns and NavigationMenuLink with href for direct links.

## Pagination {#pagination}

Navigation across pages of results.

Navigation across long result sets, like the transfer history. Import Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, and PaginationEllipsis from @felix/ui. Mark the current page with isActive on PaginationLink and compress long ranges with PaginationEllipsis.

## Popover {#popover}

Floating panel anchored to a trigger.

Floating panel anchored to a trigger for lightweight content, like the exchange rate detail. Import Popover, PopoverTrigger, and PopoverContent from @felix/ui, wrapping the button with PopoverTrigger asChild. Unlike Tooltip it opens on click and can hold interactive elements.

## Select {#select}

Select one option from a list.

Pick one option from a dropdown list, like the destination country. Import Select, SelectTrigger, SelectValue, SelectContent, and SelectItem from @felix/ui. Set the placeholder on SelectValue and give each SelectItem a unique value. With few options, consider RadioGroup to keep them all visible.

## Sheet {#sheet}

Side panel for secondary flows.

Side panel for secondary flows that don't warrant a page change, like a transfer's detail. Import Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, and SheetFooter from @felix/ui. Open it by wrapping the trigger with SheetTrigger asChild and close it with SheetClose.

## SidebarFooter {#sidebarfooter}

Sidebar footer with the user's account.

Sidebar footer showing the active user's account. Import it from @felix/ui and pass name, email, and an avatar, usually an Avatar with AvatarFallback at size sm. It goes as the Sidebar's last child, below SidebarBody.

## Stepper {#stepper}

Step progress through a flow.

Shows step-by-step progress through a flow, like amount, recipient, and confirmation. Import Stepper from @felix/ui and define each step with Stepper.Step as children. Set the current step with activeIndex (zero-based); previous steps are marked as completed.

## Table {#table}

Tabular data with a header.

Presents tabular data like the transfer history. Import Table, TableHeader, TableBody, TableRow, TableHead, and TableCell from @felix/ui. Use TableHead for header cells and TableCell for data cells. For long lists, add Pagination.

## Tabs {#tabs}

Switchable views under one area.

Switches between same-level views within one area, like transfers and top-ups. Import Tabs, TabsList, TabsTrigger, and TabsContent from @felix/ui. Set the initial tab with defaultValue and link each TabsTrigger to its TabsContent using the same value.

## Toast {#toast}

Transient notification. Fire with toast(...).

Transient notification that confirms an action without interrupting, like a completed transfer. Mount the Toaster once in the app (you can place it with position) and import the toast function from @felix/ui. Fire it with toast(title, options) passing a description, or use toast.secondary for the alternate style.

## Tooltip {#tooltip}

Brief label on hover or focus.

Brief label that clarifies a control on hover or keyboard focus. Import Tooltip, TooltipProvider, TooltipTrigger, and TooltipContent from @felix/ui. Wrap the area with TooltipProvider and the trigger with TooltipTrigger asChild. Short text only and never essential information: there's no hover on touch.
