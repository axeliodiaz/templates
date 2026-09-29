# Organisms

Full regions built from atoms and molecules.

## MessageScroller {#messagescroller}

Chat surface: header, thread or empty state, and input.

The complete frame of a conversation: a header with title and refresh button, the scrollable message thread (or an empty state while there's nothing yet), and the input block with attach and send. Import MessageScroller, MessageScrollerHeader, MessageScrollerEmpty, MessageScrollerMessages, and MessageScrollerInput from @felix/ui. Figma's Empty/Scrolled state is resolved by composition: render MessageScrollerEmpty or MessageScrollerMessages as the middle child. Size the frame (Figma uses 380 Ã 600) and turn on showScrollToBottom for the 'Scroll to bottom' pill.

## Sidebar {#sidebar}

Full side navigation: header, sections, and footer.

The app's full side navigation: brand on top, link sections, and the account at the bottom. Import Sidebar, SidebarHeader, SidebarBody, SidebarSection, and SidebarNavItem from @felix/ui, and close it with SidebarFooter. Each SidebarNavItem takes href, icon, and active to mark the current route; group links with SidebarSection and its title prop.
