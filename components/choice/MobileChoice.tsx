import { useCallback, useState } from "react";
import s from "./Choice.module.css";
import { CurrentChoice, MenuItem } from "./MenuItem";
import { SearchChoices } from "./SearchChoices";
import { ChoiceProps, ChoiceType } from "./types";
import { useCurrentChoice } from "./useCurrentChoice";
import { useOnWindowEscape } from "./useOnWindowEscape";

export function MobileChoice({ choices, state }: ChoiceProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [chosenId, setChosenId] = state ?? ["", () => {}];
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const currentChoice = useCurrentChoice(chosenId, choices);

  // actions
  const open = () => setIsOpen(true);
  const close = useCallback(() => setIsOpen(false), []);
  const toggleMobileExpanded = () => setMobileExpanded((s) => !s);
  const select = (id: ChoiceType["id"]) => {
    setChosenId(id);
    close();
  };
  // misc
  useOnWindowEscape(close);

  return (
    <>
      <button className={s.choiceButton} onClick={open}>
        <CurrentChoice choice={currentChoice} />
      </button>
      {isOpen && (
        <div className={`${s.menu} ${mobileExpanded && s.menuExpanded}`}>
          <div className={s.mobileExpanded} onClick={toggleMobileExpanded} />
          <SearchChoices
            value={search}
            onChange={setSearch}
            choices={choices}
          />
          {!search &&
            choices.map((choice) => (
              <MenuItem
                key={choice.id}
                choice={choice}
                chosenId={chosenId}
                onChooseId={select}
              />
            ))}
        </div>
      )}
    </>
  );
}
