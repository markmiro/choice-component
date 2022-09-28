Now:

- make arrow keys work
- mobile: calculate the drill-down from the current item? This way we can alway open the menu to the right item
- desktop: menu only show above or below button (and calculate height to prevent intersection)
- ensure choices works with empty children and with undefined children
- make the Choice component lighter by only including the main button and loading the rest dynamically
- use `matchMedia` instead of `document.body.clientWidth`

Polish steps:

- maybe make it headless?
- highlight all the active menu items along the way
- ensure memory is released
- use arrow keys to navigate
- display nested element immediately, and scroll into view when opening select? Maybe just on mobile?
- consider `toLocaleLowerCase` for search?
- on mobile, if search result is zero items, want to display that
- drag down expander bar closes menu
- drag top to increase to full height
