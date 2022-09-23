Now:

- Fix using "Choice" to refer to both the individual choice, and the full choice component
- mobile: keep opened menu right below the chooser
  - if chooser is too low, then covering is ok

Polish steps:

- use arrow keys to navigate
- debounce search
- display nested element immediately, and scroll into view when opening select? Maybe just on mobile?
- consider `toLocaleLowerCase` for search?
- on mobile, if search result is zero items, want to display that
- make sure expander bar doesn't overlap with notch
- drag down expander bar closes menu
- html viewport sizing
- ensure menu scrolls with bounce on ios and mobile
- esc key to close choices
- word wrapping
- arrow and search icons
- framer-motion
- Lazy load laag for desktop so it's not loaded on mobile
- drag top (on mobile) to increase to full height
- Install Inter font
- Use tailwind?

Done

- click outside
- select input on open
- if filtered choices = 0, then show zero
- close when parent component is unmounted
- don't close component when searching and esc is pressed
- sticky search input
- don't load images until they're in view
- show nested element even when scrolling
