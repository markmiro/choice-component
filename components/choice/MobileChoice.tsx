import { useEffect, useRef, useState } from "react";
import s from "./Choice.module.css";
import { CurrentChoice, MenuItem } from "./Item";
import { ChoiceProps, ChoiceType } from "./types";
import { useChoiceById } from "./useChoiceById";
import { useOnWindowEscape } from "./useOnWindowEscape";
import { Portal } from "react-portal";
import { ChoiceButton } from "./ChoiceButton";
import { motion, AnimatePresence } from "framer-motion";

function Overlay({ onClick }: { onClick?: () => void }) {
  return <div className={s.mobileOverlay} onClick={() => onClick?.()} />;
}

export function MobileChoice({ choices, state }: ChoiceProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [chosenIdPath, setChosenIdPath] = useState<string[]>([]);
  const [chosenId, setChosenId] = state ?? ["", () => {}];
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const choiceById = useChoiceById(choices);

  // refs
  const choiceButtonRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // actions
  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
    choiceButtonRef.current?.focus();
  };
  const back = () => setChosenIdPath((p) => p.slice(0, -1));
  const toggleMobileExpanded = () => setMobileExpanded((s) => !s);
  const select = (id: ChoiceType["id"]) => {
    const children = choiceById.get(id)?.children;
    if (children && children.length > 0) {
      setChosenIdPath((p) => [...p, id]);
    } else {
      setChosenId(id);
      setTimeout(close, 300);
    }
  };

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
          {isOpen && (
            <>
              <Overlay onClick={close} />
              <motion.div
                className={`${s.menuMobile} ${
                  mobileExpanded && s.menuExpanded
                }`}
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
                  className={s.mobileHandle}
                  onClick={toggleMobileExpanded}
                  style={{ marginBottom: -4 }}
                >
                  <div className={s.mobileHandleInner} />
                </button>
                {isDrilling && (
                  <div className={s.mobileBackWrapper}>
                    <button className={s.mobileBackButton} onClick={back}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/icons/back.svg"
                        width={18}
                        height={16}
                        alt=""
                      />
                    </button>
                  </div>
                )}
                {(!search || isDrilling) && (
                  <div className={s.menuMobileScroll} ref={scrollRef}>
                    {currentChoices.map((choice) => (
                      <MenuItem
                        key={choice.id}
                        choice={choice}
                        chosenId={chosenId}
                        onChooseId={select}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
