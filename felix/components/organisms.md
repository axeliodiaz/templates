# Organisms

Full regions built from atoms and molecules.

## MessageScroller {#messagescroller}

### Estado vacío

<div class="fx-preview"><div class="fx-thread"><header>María</header><div class="fx-empty">Quiero saber cuándo llega mi envío…</div></div></div>

### Con mensajes

<div class="fx-preview" data-fx="thread"><div class="fx-thread"><header>María</header><div data-thread><div class="fx-msg"><span class="fx-avatar sm">MG</span><div><small>María</small><div class="fx-bubble them">Déjame revisarlo por ti.</div></div></div><div class="fx-msg end"><div><small>Tú</small><div class="fx-bubble">¡Hola! ¿Cómo va tu envío?</div><small>Leído · 2:34 PM</small></div></div></div><footer><input placeholder="Escribe un mensaje"><button class="fx-btn fx-btn-primary" type="button" data-send>Enviar</button></footer></div></div>

Chat surface: header, thread or empty state, and input.

The complete frame of a conversation: a header with title and refresh button, the scrollable message thread (or an empty state while there's nothing yet), and the input block with attach and send. Import MessageScroller, MessageScrollerHeader, MessageScrollerEmpty, MessageScrollerMessages, and MessageScrollerInput from @felix/ui. Figma's Empty/Scrolled state is resolved by composition: render MessageScrollerEmpty or MessageScrollerMessages as the middle child. Size the frame (Figma uses 380 × 600) and turn on showScrollToBottom for the 'Scroll to bottom' pill.

## Sidebar {#sidebar}

### Sidebar

<div class="fx-preview"><aside class="fx-side" data-fx="select-one"><b class="fx-logo">felix</b><button type="button" data-item class="on">Inicio</button><button type="button" data-item>Enviar</button><button type="button" data-item>Perfil</button><div class="fx-sfoot"><span class="fx-avatar sm">MG</span></div></aside></div>

Full side navigation: header, sections, and footer.

The app's full side navigation: brand on top, link sections, and the account at the bottom. Import Sidebar, SidebarHeader, SidebarBody, SidebarSection, and SidebarNavItem from @felix/ui, and close it with SidebarFooter. Each SidebarNavItem takes href, icon, and active to mark the current route; group links with SidebarSection and its title prop.
