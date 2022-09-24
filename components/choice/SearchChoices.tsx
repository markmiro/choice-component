import {
  Dispatch,
  KeyboardEventHandler,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import s from "./Choice.module.css";
import { ChoiceType } from "./types";

export function SearchChoices({
  value,
  onChange,
  choices,
}: {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  choices: ChoiceType[];
}) {
  const [search, setSearch] = [value, onChange];
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleInputEsc: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Escape" && search) {
      setSearch("");
      e.stopPropagation();
    }
  };
  useEffect(() => {
    searchInputRef?.current?.focus();
  }, [searchInputRef]);

  const filteredChoices = choices.filter((choice: ChoiceType) =>
    // TODO: what about children matching the search?
    search ? choice.name.toLowerCase().indexOf(search.toLowerCase()) > -1 : true
  );

  return (
    <div className={s.searchWrapper}>
      <input
        ref={searchInputRef}
        className={s.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleInputEsc}
      />
      {search &&
        filteredChoices.map((choice) => (
          <div key={choice.id}>{choice.name}</div>
        ))}
      {choices.length > 0 && filteredChoices.length === 0 && (
        <span>Nothing found 👀</span>
      )}
    </div>
  );
}
