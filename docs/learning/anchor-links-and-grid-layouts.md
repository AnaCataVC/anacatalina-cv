# Learning: Anchor Links with Sticky Headers & CSS Grid Layouts

**Date:** 2026-08-10

## 1. Handling Anchor Links with Sticky Headers

### Problem
When using sticky navigation bars (headers), navigating to an internal anchor link (`#id`) causes the browser to scroll exactly to the top edge of the target element. Because the sticky header overlays the top of the viewport, the beginning of the target content is hidden behind the navigation menu.

### Solution / Pattern
The cleanest way to resolve this offset issue without affecting the original visual design (e.g., margins and paddings) is to use Tailwind CSS's **`scroll-mt-*`** utility class (e.g., `scroll-mt-24`). 

Applying this class to the target anchor element creates an invisible top margin specifically reserved for scroll calculations.

```html
<!-- Correct Pattern: The element stops scrolling 6rem below the top of the viewport -->
<div id="target-section" class="scroll-mt-24">
  ... content ...
</div>
```

## 2. Invisible Anchor Elements in CSS Grid Layouts

### Problem
In CSS Grid layouts (such as `grid-cols-2`), inserting empty `<div>` elements solely to act as scroll anchors can break the design. The grid container will interpret the empty `<div>` as a direct child and allocate a full column to it. This inadvertently pushes the actual content to the next row, disrupting the side-by-side alignment.

### Solution / Pattern
If you cannot use `scroll-mt-*` directly on the parent container and need a customized invisible anchor, do not place it as a sibling inside the grid parent. Instead, nest the anchor **inside** the grid item. 

To achieve the necessary scroll offset, configure the grid item as `relative` and position the invisible anchor absolutely at a negative top offset (e.g., `absolute inset-x-0 -top-24`). This ensures the element does not take up structural space in the grid while acting as a perfectly positioned anchor.

```html
<!-- Incorrect Pattern: Breaks the grid structure -->
<div class="grid grid-cols-2">
  <div class="content-1">...</div>
  <div id="invisible-anchor" class="scroll-mt-24"></div> <!-- Consumes 1 column! -->
  <div class="content-2">...</div>
</div>

<!-- Correct Pattern: Preserves grid, maintains scroll offset -->
<div class="grid grid-cols-2">
  <div class="content-1">...</div>
  
  <div class="content-2 relative">
    <!-- Anchor positioned 6rem above without altering grid -->
    <div id="invisible-anchor" class="absolute inset-x-0 -top-24"></div>
    ...
  </div>
</div>
```
