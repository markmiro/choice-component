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

export function searchChoices(choices: ChoiceType[], search: string) {
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

export function SearchInput(props: {
  autoFocus?: boolean;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cancelSearch = () => {
    props.onChange("");
    searchInputRef.current?.blur();
  };

  useEffect(() => {
    if (props.autoFocus) {
      searchInputRef?.current?.focus();
    }
  }, [searchInputRef, props.autoFocus]);

  const handleInputEsc: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Escape") {
      if (props.value) {
        props.onChange("");
        e.stopPropagation();
      } else {
        searchInputRef?.current?.blur();
      }
    }
  };

  return (
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
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          onKeyDown={handleInputEsc}
          onFocus={() => props.onFocus?.()}
          onBlur={() => props.onBlur?.()}
        />
        {props.value && (
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
  );
}

export function SearchResults({
  choices,
  onChooseId,
  search,
  itemComponent,
  itemWithChildrenComponent,
}: {
  choices: ChoiceType[];
  onChooseId: (id: string) => void;
  search: string;
  itemComponent: any;
  itemWithChildrenComponent: any;
}) {
  const debouncedSearch = useDebounce(search, 300);
  const filteredChoices = useMemo(() => {
    console.log("search!");
    return searchChoices(choices, debouncedSearch);
  }, [choices, debouncedSearch]);

  const MenuItem = itemComponent;
  const MenuItemWithChildren = itemWithChildrenComponent;

  if (!debouncedSearch) return null;

  return (
    <>
      {choices.length > 0 &&
        filteredChoices.length === 0 &&
        debouncedSearch && <div style={{ padding: 12 }}>Nothing found 👀</div>}
      {filteredChoices.map((choice) =>
        choice.children && choice.children.length > 0 ? (
          <MenuItemWithChildren
            key={choice.id}
            choice={choice}
            onChooseId={onChooseId}
          />
        ) : (
          <MenuItem key={choice.id} choice={choice} onChooseId={onChooseId} />
        )
      )}
    </>
  );
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
  const searchScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchScrollRef.current) searchScrollRef.current.scrollTo({ top: 0 });
  }, [search]);

  return (
    <>
      <SearchInput
        autoFocus={autoFocus}
        value={search}
        onChange={setSearch}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <div ref={searchScrollRef} className={s.searchScroll} tabIndex={0}>
        <SearchResults
          choices={choices}
          search={search}
          onChooseId={onChooseId}
          itemComponent={itemComponent}
          itemWithChildrenComponent={itemWithChildrenComponent}
        />
      </div>
    </>
  );
}
