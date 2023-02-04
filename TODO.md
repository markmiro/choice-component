
Now:
- Fix debounce search
- mobile: remove fade out when closing menu
- mobile: show handle when input is focused
- make arrow keys work

Later:
- mobile: calculate the drill-down from the current item? This way we can alway open the menu to the right item
- desktop: menu only show above or below button (and calculate height to prevent intersection)
- ensure choices works with empty children and with undefined children
- make the Choice component lighter by only including the main button and loading the rest dynamically
- use `matchMedia` instead of `document.body.clientWidth`

Polish steps:

- ensure memory is released
- display nested element immediately, and scroll into view when opening select? Maybe just on mobile?
- consider `toLocaleLowerCase` for search?
- mobile: handle
  - drag down handle closes menu
  - drag top to increase to full height

Speculative:
- maybe make it headless?