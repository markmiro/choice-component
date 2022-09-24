import { useState } from "react";
import s from "./Choice.module.css";
import { CurrentChoice, MenuItem } from "./Item";
import { SearchChoices } from "./SearchChoices";
import { ChoiceProps, ChoiceType } from "./types";
import { useChoiceById } from "./useChoiceById";
import { useOnWindowEscape } from "./useOnWindowEscape";
import { useLockedBody } from "usehooks-ts";
import { Portal } from "react-portal";
import { ChoiceButton } from "./ChoiceButton";

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

  // actions
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const back = () => setChosenIdPath((p) => p.slice(0, -1));
  const toggleMobileExpanded = () => setMobileExpanded((s) => !s);
  const select = (id: ChoiceType["id"]) => {
    const children = choiceById(id)?.children;
    if (children && children.length > 0) {
      setChosenIdPath((p) => [...p, id]);
    } else {
      setChosenId(id);
      close();
    }
  };
  // misc
  useOnWindowEscape(close);
  useLockedBody(isOpen);

  const isDrilling = chosenIdPath.length > 0;
  const currentChoices = isDrilling
    ? choiceById(chosenIdPath[chosenIdPath.length - 1]).children
    : choices;

  return (
    <>
      <ChoiceButton onClick={open}>
        <CurrentChoice choice={choiceById(chosenId)} />
      </ChoiceButton>
      {isOpen && (
        <Portal>
          <Overlay onClick={close} />
          <div
            className={`${s.menuMobile} ${mobileExpanded && s.menuExpanded}`}
          >
            <button
              className={s.mobileHandle}
              onClick={toggleMobileExpanded}
              style={{ marginBottom: -4 }}
            >
              <div className={s.mobileHandleInner} />
            </button>
            {!isDrilling && (
              <SearchChoices
                value={search}
                onChange={setSearch}
                onChooseId={select}
                choices={choices}
                itemComponent={MenuItem}
                itemWithChildrenComponent={MenuItem}
              />
            )}
            {isDrilling && (
              <div className={s.mobileBackWrapper}>
                <button className={s.mobileBackButton} onClick={back}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/back.svg" width={18} height={16} alt="" />
                </button>
              </div>
            )}
            {(!search || isDrilling) && (
              <div className={s.menuMobileScroll}>
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
          </div>
        </Portal>
      )}
    </>
  );
}
