import { useRef, useState } from "react";
import { MenuItem } from "./Item";
import { SearchInput, SearchResults } from "./SearchChoices";
import { ChoiceType } from "./types";

export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ position: "relative" }}>
      <SearchInput value="" onChange={() => {}} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        onClick={() => onClick()}
      />
    </div>
  );
}

// <MobileSearchChoices onChooseId={select} choices={choices} />
export function MobileSearchChoices({
  choices,
  onChooseId,
  onCancel,
}: {
  choices: ChoiceType[];
  onChooseId: (id: string) => void;
  onCancel: () => void;
}) {
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapperRef}
      style={{
        top: 0,
        left: 0,
        width: "100%",
        position: "absolute",
        zIndex: 999,
        background: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SearchInput
        autoFocus
        value={search}
        onChange={setSearch}
        onBlur={() => setTimeout(() => onCancel(), 200)}
      />
      {search ? (
        <SearchResults
          choices={choices}
          search={search}
          onChooseId={onChooseId}
          itemComponent={MenuItem}
          itemWithChildrenComponent={MenuItem}
        />
      ) : (
        choices.map((choice) => (
          <MenuItem key={choice.id} choice={choice} onChooseId={onChooseId} />
        ))
      )}
    </div>
  );
}
