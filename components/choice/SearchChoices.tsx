import {
  Dispatch,
  KeyboardEventHandler,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useDebounce } from "usehooks-ts";
import s from "./SearchChoices.module.css";
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
  onChooseId,
  onFocus,
  onBlur,
  autoFocus = false,
  itemComponent,
  itemWithChildrenComponent,
}: {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  choices: ChoiceType[];
  onChooseId: (id: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  itemComponent: any;
  itemWithChildrenComponent: any;
}) {
  const [search, setSearch] = [value, onChange];
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchScrollRef = useRef<HTMLDivElement>(null);
  const handleInputEsc: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Escape" && search) {
      setSearch("");
      e.stopPropagation();
    }
  };

  const cancelSearch = () => {
    setSearch("");
    searchInputRef.current?.blur();
  };

  useEffect(() => {
    if (searchScrollRef.current) searchScrollRef.current.scrollTo({ top: 0 });
  }, [search]);

  useEffect(() => {
    if (autoFocus) {
      searchInputRef?.current?.focus();
    }
  }, [searchInputRef, autoFocus]);

  const debouncedSearch = useDebounce(search, 300);
  const filteredChoices = useMemo(() => {
    console.log("search!");
    return searchChoices(choices, debouncedSearch);
  }, [choices, debouncedSearch]);

  const MenuItem = itemComponent;
  const MenuItemWithChildren = itemWithChildrenComponent;

  return (
    <>
      <div className={s.searchWrapper}>
        <div className={s.inputGroup}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={s.inputGroupIcon}
            src="/icons/search.svg"
            width={19}
            height={19}
            alt=""
          />
          <input
            type="search"
            ref={searchInputRef}
            placeholder="Search"
            className={s.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleInputEsc}
            onFocus={() => onFocus?.()}
            onBlur={() => onBlur?.()}
          />
          {search && (
            <button
              className={s.inputGroupCloseButton}
              onClick={cancelSearch}
              onTouchStart={cancelSearch}
            >
              <div className={s.inputGroupCloseButtonIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/close.svg" alt="close" />
              </div>
            </button>
          )}
        </div>
      </div>
      {debouncedSearch && (
        <div ref={searchScrollRef} className={s.searchScroll} tabIndex={0}>
          {choices.length > 0 &&
            filteredChoices.length === 0 &&
            debouncedSearch && (
              <div style={{ padding: 12 }}>Nothing found 👀</div>
            )}
          {filteredChoices.map((choice) =>
            choice.children && choice.children.length > 0 ? (
              <MenuItemWithChildren
                key={choice.id}
                choice={choice}
                onChooseId={onChooseId}
              />
            ) : (
              <MenuItem
                key={choice.id}
                choice={choice}
                onChooseId={onChooseId}
              />
            )
          )}
        </div>
      )}
    </>
  );
}
