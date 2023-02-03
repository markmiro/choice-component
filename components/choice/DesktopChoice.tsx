import { useRef, useState } from "react";
import { mergeRefs, useLayer } from "react-laag";
import s from "./Choice.module.css";
import { CurrentChoice, MenuItemWithContext } from "./Item";
import { SearchChoices } from "./SearchChoices";
import { ChoiceProps, ChoiceType } from "./types";
import { useOnWindowEscape } from "./useOnWindowEscape";
import { motion, AnimatePresence } from "framer-motion";
import { useChoiceById } from "./useChoiceById";
import { ChoiceButton } from "./ChoiceButton";
import { ChoiceContextProvider, useChoiceContext } from "./ChoiceContext";

console.log("loaded DesktopChoice!");

function MenuItemWithChildren({ choice }: { choice: ChoiceType }) {
  const ctx = useChoiceContext();

  const isOpen = [
    ...ctx.choiceById.path(ctx.tempChosenId),
    ctx.tempChosenId,
  ].includes(choice.id);

  const { triggerProps, layerProps, renderLayer } = useLayer({
    isOpen,
    placement: "right-start",
    possiblePlacements: ["right-start", "left-start"],
    containerOffset: 0,
    auto: true,
    onOutsideClick: () => ctx.setTempChosenId(""),
    // Setting to an empty function to prevent react-laag warning. Children open / close state is handled by ChoiceContext
    onParentClose: () => {},
  });

  return (
    <>
      <MenuItemWithContext choice={choice} {...triggerProps} />
      {renderLayer(
        <AnimatePresence>
          {isOpen && choice.children && choice.children.length > 0 && (
            <motion.div
              {...layerProps}
              transition={{ duration: 0.1 }}
              initial={{
                opacity: 0,
                translateY: 5,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
                scale: 1,
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <div className={s.menu} style={{ transform: "translateY(-8px" }}>
                <MenuItems choices={choice.children} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

function MenuItems({ choices }: { choices: ChoiceType[] }) {
  return (
    <>
      {choices.map((choice) =>
        choice.children && choice.children.length > 0 ? (
          <MenuItemWithChildren key={choice.id} choice={choice} />
        ) : (
          <MenuItemWithContext key={choice.id} choice={choice} />
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
  const choiceButtonRef = useRef<HTMLButtonElement>(null);

  // actions
  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    choiceButtonRef.current?.focus({ preventScroll: true });
  };
  const select = (id: ChoiceType["id"]) => {
    const children = choiceById.get(id).children;
    if (children && children.length > 0) {
    } else {
      setChosenId(id);
      setTimeout(close, 200);
    }
  };

  // misc
  useOnWindowEscape(close);

  const { triggerProps, layerProps, renderLayer } = useLayer({
    isOpen,
    placement: "bottom-start",
    triggerOffset: 4,
    containerOffset: 0,
    auto: true,
    onOutsideClick: close,
  });

  return (
    <>
      <ChoiceButton
        ref={mergeRefs(triggerProps.ref, choiceButtonRef)}
        onClick={open}
        isActive={isOpen}
        disabled={!choices || choices.length === 0}
      >
        <CurrentChoice choice={choiceById.get(chosenId)} />
      </ChoiceButton>

      {renderLayer(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              {...layerProps}
              className={s.menu}
              initial={{
                opacity: 0,
                translateY: 10,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
                transition: { duration: 0.1 },
              }}
              exit={{
                opacity: 0,
                translateY: 10,
                transition: { duration: 0.2 },
              }}
            >
              <ChoiceContextProvider
                chosenId={chosenId}
                setChosenId={select}
                choiceById={choiceById}
              >
                {/* <ChoiceContextConsumer>
                  {(ctx) => <div>tempChosenId: {ctx?.tempChosenId}</div>}
                </ChoiceContextConsumer> */}
                {choiceById.count > 5 && (
                  <SearchChoices
                    value={search}
                    onChange={setSearch}
                    choices={choices}
                    onChooseId={select}
                    autoFocus
                    itemComponent={MenuItemWithContext}
                    itemWithChildrenComponent={MenuItemWithChildren}
                  />
                )}
                {!search &&
                  choices.map((choice) =>
                    choice.children && choice.children.length > 0 ? (
                      <MenuItemWithChildren key={choice.id} choice={choice} />
                    ) : (
                      <MenuItemWithContext key={choice.id} choice={choice} />
                    )
                  )}
              </ChoiceContextProvider>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export default DesktopChoice;
