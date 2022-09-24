import { useCallback, useState } from "react";
import { useHover, useLayer } from "react-laag";
import s from "./Choice.module.css";
import { CurrentChoice, MenuItem } from "./MenuItem";
import { SearchChoices } from "./SearchChoices";
import { ChoiceProps, ChoiceType } from "./types";
import { useOnWindowEscape } from "./useOnWindowEscape";
import { motion, AnimatePresence } from "framer-motion";
import { useChoiceById } from "./useChoiceById";

console.log("loaded DesktopChoice!");

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
      {renderLayer(
        <AnimatePresence>
          {isOpen && choice.children && choice.children.length > 0 && (
            <motion.div
              {...layerProps}
              {...hoverProps}
              className={s.menu}
              transition={{ duration: 0.1 }}
              initial={{ opacity: 0.2, translateY: 15 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <MenuItems
                choices={choice.children}
                onChooseId={onChooseId}
                chosenId={chosenId}
              />
            </motion.div>
          )}
        </AnimatePresence>
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

export function DesktopChoice({ choices, state }: ChoiceProps) {
  const [chosenId, setChosenId] = state ?? ["", () => {}];
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const choiceById = useChoiceById(choices);

  // actions
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const select = (id: ChoiceType["id"]) => {
    const children = choiceById(id).children;
    if (children && children.length > 0) {
    } else {
      setChosenId(id);
      close();
    }
  };

  // misc
  useOnWindowEscape(close);

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
        <CurrentChoice choice={choiceById(chosenId)} />
      </button>
      {isOpen &&
        renderLayer(
          <div {...layerProps} className={s.menu}>
            <SearchChoices
              value={search}
              onChange={setSearch}
              choices={choices}
            />
            {!search &&
              choices.map((choice) =>
                choice.children && choice.children.length > 0 ? (
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
          </div>
        )}
    </>
  );
}

export default DesktopChoice;
