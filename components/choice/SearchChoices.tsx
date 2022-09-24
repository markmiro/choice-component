import {
  Dispatch,
  KeyboardEventHandler,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import s from "./Choice.module.css";
import { ChoiceType } from "./types";

function searchChoices(choices: ChoiceType[], search: string) {
  let results: ChoiceType[] = [];
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    const isMatch =
      choice.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
    if (isMatch) {
      results.push(choice);
    }
    if (choice.children && choice.children.length > 0) {
      results.push(...searchChoices(choice.children, search));
    }
  }
  return results;
}

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

  const filteredChoices = searchChoices(choices, search);

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
          <div key={choice.id}>
            <pre style={{ display: "inline", marginRight: 5 }}>{choice.id}</pre>
            {choice.name}
          </div>
        ))}
      {choices.length > 0 && filteredChoices.length === 0 && (
        <span>Nothing found 👀</span>
      )}
    </div>
  );
}
