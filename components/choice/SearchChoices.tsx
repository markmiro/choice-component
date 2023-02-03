import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/20/solid";
import {
  Dispatch,
  KeyboardEventHandler,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useDebounce } from "usehooks-ts";
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
    <div className="py-2 px-4 flex gap-2 group">
      <div className="grow relative">
        <MagnifyingGlassIcon className="ml-2.5 w-5 h-full absolute opacity-30" />
        <input
          type="search"
          ref={searchInputRef}
          placeholder="Search"
          className="w-full rounded-full px-3 pl-9 py-2 bg-gray-100 placeholder:opacity-30 placeholder:text-black"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          onKeyDown={handleInputEsc}
          onFocus={() => props.onFocus?.()}
          onBlur={() => props.onBlur?.()}
        />
        <button
          className="absolute right-0 top-0 px-1.5 h-full hidden group-focus-within:block"
          onClick={cancelSearch}
        >
          <XCircleIcon className="w-6 h-6" />
        </button>
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
      <div
        ref={searchScrollRef}
        className="overflow-y-auto overscroll-contain flex flex-col"
        tabIndex={0}
      >
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
