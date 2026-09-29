# Organisms

Full regions built from atoms and molecules.

## MessageScroller {#messagescroller}

<div class="fx-preview" data-fx="thread"><div class="fx-thread"><header>María Álvarez</header><div data-thread><div class="fx-bubble them">¿Ya salió?</div><div class="fx-bubble">Sí, hoy en la tarde.</div></div><footer><input placeholder="Escribe un mensaje"><button class="fx-btn fx-btn-primary" type="button" data-send>Enviar</button></footer></div></div>

Chat surface: header, thread or empty state, and input.

The complete frame of a conversation: a header with title and refresh button, the scrollable message thread (or an empty state while there's nothing yet), and the input block with attach and send. Import MessageScroller, MessageScrollerHeader, MessageScrollerEmpty, MessageScrollerMessages, and MessageScrollerInput from @felix/ui. Figma's Empty/Scrolled state is resolved by composition: render MessageScrollerEmpty or MessageScrollerMessages as the middle child. Size the frame (Figma uses 380 × 600) and turn on showScrollToBottom for the 'Scroll to bottom' pill.

## Sidebar {#sidebar}

<div class="fx-preview" data-fx="select-one"><aside class="fx-side"><b class="fx-logo">felix</b><button type="button" data-item class="on">Envíos</button><button type="button" data-item>Historial</button><div class="fx-sfoot"><span class="fx-avatar sm">AD</span><small>Axel</small></div></aside></div>

Full side navigation: header, sections, and footer.

The app's full side navigation: brand on top, link sections, and the account at the bottom. Import Sidebar, SidebarHeader, SidebarBody, SidebarSection, and SidebarNavItem from @felix/ui, and close it with SidebarFooter. Each SidebarNavItem takes href, icon, and active to mark the current route; group links with SidebarSection and its title prop.
