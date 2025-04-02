
# Sidebar Component Documentation

This document provides an overview of the sidebar components and how to use them in your application.

## Table of Contents
- [Overview](#overview)
- [Core Components](#core-components)
- [Usage Examples](#usage-examples)
- [Custom Styling](#custom-styling)
- [Mobile Considerations](#mobile-considerations)

## Overview

The sidebar system is composed of several modular components designed to create flexible sidebar layouts. The code is organized into separate files for improved maintainability:

- `context.tsx` - Provides the state management and context for the sidebar
- `sidebar.tsx` - The main sidebar container component
- `trigger.tsx` - Components for toggling the sidebar state
- `sections.tsx` - Layout components for different sidebar sections
- `group.tsx` - Components for grouping sidebar items
- `menu.tsx` - Navigation menu components for the sidebar
- `index.tsx` - Exports all components for easy imports

## Core Components

### SidebarProvider

Wraps your entire application to provide sidebar state management:

```tsx
<SidebarProvider defaultOpen={true}>
  {/* Your app layout */}
</SidebarProvider>
```

### Sidebar

The main sidebar container:

```tsx
<Sidebar
  side="left"  // "left" or "right"
  variant="sidebar"  // "sidebar", "floating", or "inset"
  collapsible="icon"  // "offcanvas", "icon", or "none"
>
  {/* Sidebar content */}
</Sidebar>
```

### Sidebar Layout Components

Use these to structure your sidebar:

```tsx
<SidebarHeader>
  {/* Header content */}
</SidebarHeader>

<SidebarContent>
  {/* Main content */}
</SidebarContent>

<SidebarFooter>
  {/* Footer content */}
</SidebarFooter>
```

### Sidebar Menu

Create navigation menus with:

```tsx
<SidebarMenu>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HomeIcon />
      <span>Home</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
</SidebarMenu>
```

## Usage Examples

### Basic Sidebar

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Settings, User } from "lucide-react";

export function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <h1>My App</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Home />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <User />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            {/* Footer content */}
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
```

## Custom Styling

Most components accept a `className` prop for additional styling:

```tsx
<Sidebar className="bg-indigo-900 text-white">
  {/* Content */}
</Sidebar>
```

The sidebar uses CSS variables for easy theming:

- `--sidebar-width`: Width of the expanded sidebar
- `--sidebar-width-icon`: Width of the collapsed sidebar in "icon" mode
- `--sidebar-width-mobile`: Width of the sidebar on mobile devices

## Mobile Considerations

The sidebar automatically adapts to mobile screens using the `useIsMobile()` hook. On mobile:
- The sidebar becomes a sheet that slides in from the side
- Use `SidebarTrigger` to toggle the mobile sidebar
