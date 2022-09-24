import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHover, useLayer } from "react-laag";
import s from "./Choice.module.css";
import { CurrentChoice, MenuItem } from "./MenuItem";
import { ChoiceProps, ChoiceType } from "./types";

function useOnWindowEscape(action: () => void) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        action();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [action]);
}

function MenuItemWithChildren({
  choice,
  onChooseId,
  chosenId,
}: {
  choice: ChoiceType;
  chosenId: string;
  onChooseId: (id: string) => void;
}) {
  const [isOpen, hoverProps, close] = useHover({
    delayEnter: 0,
    delayLeave: 0,
    hideOnScroll: false,
  });

  const { triggerProps, layerProps, renderLayer } = useLayer({
    isOpen,
    placement: "right-start",
    possiblePlacements: ["right-start", "left-start"],
    containerOffset: 0,
    auto: true,
    onOutsideClick: close,
    onParentClose: close,
  });

  return (
    <>
      <MenuItem
        key={choice.id}
        choice={choice}
        chosenId={chosenId}
        onChooseId={onChooseId}
        {...hoverProps}
        {...triggerProps}
      />
      {isOpen &&
        renderLayer(
          <div {...layerProps} {...hoverProps} className={s.menu}>
            {choice.children && choice.children.length > 0 && (
              <MenuItems
                choices={choice.children}
                onChooseId={onChooseId}
                chosenId={chosenId}
              />
            )}
          </div>
        )}
    </>
  );
}

function MenuItems({
  choices,
  onChooseId,
  chosenId,
}: {
  choices: ChoiceType[];
  chosenId: string;
  onChooseId: (id: string) => void;
}) {
  return (
    <>
      {choices.map((choice) =>
        choice.children && choice.children.length > 0 ? (
          <MenuItemWithChildren
            key={choice.id}
            choice={choice}
            chosenId={chosenId}
            onChooseId={onChooseId}
          />
        ) : (
          <MenuItem
            key={choice.id}
            choice={choice}
            chosenId={chosenId}
            onChooseId={onChooseId}
          />
        )
      )}
    </>
  );
}

export function Choice({ choices, state }: ChoiceProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [chosenId, setChosenId] = state ?? ["", () => {}];
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // We could grab the whole `choice` rather than just the `id` when the user makes a selection,
  // but then what do you do when the component is mounted with a pre-selected choice?
  // We could also build an index mapping `id` to choices if recursing becomes slow.
  const currentChoice = useMemo(() => {
    // console.countReset("currentChoice search");
    let foundChoice: ChoiceType | undefined;
    function searchChoices(choices: ChoiceType[]) {
      if (foundChoice) return;
      // console.count("currentChoice search");
      choices.forEach((choice) => {
        if (choice.id === chosenId) {
          foundChoice = choice;
          return;
        }
        if (choice.children) searchChoices(choice.children);
      });
    }
    searchChoices(choices);
    return foundChoice;
  }, [choices, chosenId]);

  // actions
  const open = () => setIsOpen(true);
  const close = useCallback(() => setIsOpen(false), []);
  const toggleMobileExpanded = () => setMobileExpanded((s) => !s);
  const handleInputEsc: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Escape" && search) {
      setSearch("");
      e.stopPropagation();
    }
  };
  const select = (id: ChoiceType["id"]) => {
    setChosenId(id);
    // close();
  };
  // misc
  useOnWindowEscape(close);
  const filteredChoices = choices.filter((choice: ChoiceType) =>
    // TODO: what about children matching the search?
    search ? choice.name.toLowerCase().indexOf(search.toLowerCase()) > -1 : true
  );

  useEffect(() => {
    searchInputRef?.current?.focus();
  }, [isOpen]);

  const { triggerProps, layerProps, renderLayer } = useLayer({
    isOpen,
    placement: "bottom-start",
    containerOffset: 0,
    auto: true,
    onOutsideClick: close,
  });

  return (
    <>
      <button className={s.choiceButton} {...triggerProps} onClick={open}>
        <CurrentChoice choice={currentChoice} />
      </button>
      {isOpen &&
        renderLayer(
          <div
            {...layerProps}
            className={`${s.menu} ${mobileExpanded && s.menuExpanded}`}
          >
            <div className={s.mobileExpanded} onClick={toggleMobileExpanded} />
            <div className={s.searchWrapper}>
              <input
                ref={searchInputRef}
                className={s.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleInputEsc}
              />
            </div>
            {filteredChoices.map((choice) =>
              choice.children ? (
                <MenuItemWithChildren
                  key={choice.id}
                  choice={choice}
                  chosenId={chosenId}
                  onChooseId={select}
                />
              ) : (
                <MenuItem
                  key={choice.id}
                  choice={choice}
                  chosenId={chosenId}
                  onChooseId={select}
                />
              )
            )}
            {choices.length > 0 && filteredChoices.length === 0 && (
              <span>Nothing found 👀</span>
            )}
          </div>
        )}
    </>
  );
}
