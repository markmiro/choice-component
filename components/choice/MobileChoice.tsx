import { useCallback, useState } from "react";
import s from "./Choice.module.css";
import { CurrentChoice, MenuItem } from "./MenuItem";
import { SearchChoices } from "./SearchChoices";
import { ChoiceProps, ChoiceType } from "./types";
import { useChoiceById } from "./useChoiceById";
import { useOnWindowEscape } from "./useOnWindowEscape";

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

  const isDrilling = chosenIdPath.length > 0;
  const currentChoices = isDrilling
    ? choiceById(chosenIdPath[chosenIdPath.length - 1]).children
    : choices;

  return (
    <>
      <button className={s.choiceButton} onClick={open}>
        <CurrentChoice choice={choiceById(chosenId)} />
      </button>
      {isOpen && (
        <>
          <Overlay onClick={close} />
          <div
            className={`${s.menuMobile} ${mobileExpanded && s.menuExpanded}`}
          >
            <div className={s.mobileExpanded} onClick={toggleMobileExpanded} />
            {!isDrilling && (
              <SearchChoices
                value={search}
                onChange={setSearch}
                choices={choices}
              />
            )}
            <div className={s.mobileBackWrapper}>
              {isDrilling && <button onClick={back}>Back</button>}
              <pre>{chosenIdPath.join(" > ")}</pre>
            </div>
            {currentChoices.map((choice) => (
              <MenuItem
                key={choice.id}
                choice={choice}
                chosenId={chosenId}
                onChooseId={select}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
