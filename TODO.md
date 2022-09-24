Now:

- return object in getById
- mobile: calculate the drill-down from the current item? This way we can alway open the menu to the right item
- mobile: scroll to top on each drill
- search icon
- ensure choices works with empty children and with undefined children
- animate
- fade in images on load

Polish steps:

- highlight all the active menu items along the way
- ensure memory is released
- close button for mobile?
- test with scrollbars visible
- use arrow keys to navigate
- debounce search
- display nested element immediately, and scroll into view when opening select? Maybe just on mobile?
- consider `toLocaleLowerCase` for search?
- on mobile, if search result is zero items, want to display that
- make sure expander bar doesn't overlap with notch
- drag down expander bar closes menu
- html viewport sizing
- ensure menu scrolls with bounce on ios and mobile
- drag top (on mobile) to increase to full height
