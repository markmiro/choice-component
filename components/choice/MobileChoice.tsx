import { useEffect, useRef, useState } from "react";
import { CurrentChoice, MenuItem } from "./Item";
import { ChoiceProps, ChoiceType } from "./types";
import { useChoiceById } from "./useChoiceById";
import { useOnWindowEscape } from "./useOnWindowEscape";
import { Portal } from "react-portal";
import { ChoiceButton } from "./ChoiceButton";
import { motion, AnimatePresence } from "framer-motion";
import { MobileSearchChoices, SearchTrigger } from "./MobileSearchChoices";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";

function Overlay({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full"
      onClick={() => onClick?.()}
    />
  );
}

export function MobileChoice({ choices, state }: ChoiceProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [chosenIdPath, setChosenIdPath] = useState<string[]>([]);
  const [chosenId, setChosenId] = state ?? ["", () => {}];
  const [isOpen, setIsOpen] = useState(false);
  const choiceById = useChoiceById(choices);
  const [scrollWindowScrollYMem, setScrollWindowScrollYMem] = useState(0);
  const [showSearch2, setShowSearch2] = useState(false);

  // refs
  const choiceButtonRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // actions
  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
    choiceButtonRef.current?.focus({ preventScroll: true });
  };
  const back = () => setChosenIdPath((p) => p.slice(0, -1));
  const toggleMobileExpanded = () => setMobileExpanded((s) => !s);
  const select = (id: ChoiceType["id"]) => {
    const children = choiceById.get(id)?.children;
    if (children && children.length > 0) {
      setChosenIdPath((p) => [...p, id]);
    } else {
      setChosenId(id);
      // allow user to see item get selected before closing
      setTimeout(close, 300);
    }
  };

  useEffect(() => {
    const mainEl = document.getElementById("__main");
    if (!mainEl) return;
    if (showSearch2) {
      setScrollWindowScrollYMem(window.scrollY);
      mainEl.style.display = "none";
    } else {
      mainEl.style.display = "block";
      window.scrollTo({ top: scrollWindowScrollYMem });
    }
    return () => {
      const mainEl = document.getElementById("__main");
      if (!mainEl) return;
      mainEl.style.display = "block";
      setScrollWindowScrollYMem(0);
    };
  }, [showSearch2]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [chosenIdPath]);

  // misc
  useOnWindowEscape(close);

  const isDrilling = chosenIdPath.length > 0;
  const currentChoices = isDrilling
    ? choiceById.get(chosenIdPath[chosenIdPath.length - 1]).children
    : choices;

  return (
    <>
      <ChoiceButton
        ref={choiceButtonRef}
        isActive={isOpen}
        onClick={open}
        disabled={!choices || choices.length === 0}
      >
        <CurrentChoice choice={choiceById.get(chosenId)} />
      </ChoiceButton>

      <Portal>
        <AnimatePresence>
          {isOpen && !showSearch2 && (
            <>
              <Overlay onClick={close} />
              <motion.div
                className={classNames(
                  "fixed bottom-0 left-0 w-full max-h-[70vh] border-t bg-white flex flex-col shadow-2xl",
                  mobileExpanded && "h-full max-h-screen"
                )}
                initial={{
                  opacity: 0,
                  translateY: 200,
                }}
                animate={{
                  opacity: 1,
                  translateY: 0,
                  transition: { duration: 0.2 },
                }}
                exit={{
                  opacity: 0,
                  translateY: 200,
                  transition: { duration: 0.2 },
                }}
              >
                <button
                  className="p-2 w-2/3 ml-auto mr-auto"
                  onClick={toggleMobileExpanded}
                  style={{ height: 2, marginBottom: -4 }}
                >
                  <div className="h-[3px] bg-gray-200 w-9 ml-auto mr-auto rounded-full" />
                </button>

                {!isDrilling && choiceById.count > 5 && (
                  <SearchTrigger onClick={() => setShowSearch2(true)} />
                )}

                {isDrilling && (
                  <div className="sticky top-0 border-b border-gray-200">
                    <button className="p-3" onClick={back}>
                      <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                  </div>
                )}

                <div
                  className="overflow-y-auto overscroll-contain flex flex-col"
                  ref={scrollRef}
                >
                  {currentChoices.map((choice) => (
                    <MenuItem
                      key={choice.id}
                      choice={choice}
                      onClick={() => select(choice.id)}
                      isActive={
                        choiceById.path(chosenId).includes(choice.id) ||
                        chosenId === choice.id
                      }
                    />
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>

      <Portal>
        <AnimatePresence>
          {showSearch2 && (
            <motion.div
              initial={{
                opacity: 0,
                // translateY: 200,
              }}
              animate={{
                opacity: 1,
                // translateY: 0,
                transition: { duration: 0.2 },
              }}
              exit={{
                opacity: 0,
                // translateY: 200,
                transition: { duration: 0.2 },
              }}
            >
              <MobileSearchChoices
                choices={choices}
                onChooseId={(id) => {
                  select(id);
                  const chosen = choiceById.get(id);
                  if (chosen.children && chosen.children.length > 0) {
                    setShowSearch2(false);
                  }
                }}
                onCancel={() => setShowSearch2(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
