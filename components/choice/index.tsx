import {
  Dispatch,
  KeyboardEventHandler,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import s from "./Choice.module.css";
import c from "classnames";
import { useLayer } from "react-laag";

function Img({
  color,
  src,
  sideLength,
}: {
  sideLength: number;
  color: number[];
  src: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="none"
      loading="lazy"
      className={s.img}
      style={{
        backgroundColor: `hsl(${color[0]}deg, 100%, 80%)`,
        width: sideLength,
        height: sideLength,
      }}
    />
  );
}

export type ChoiceType = {
  id: string;
  img: string;
  color: number[];
  name: string;
  children: ChoiceType[];
};

type ChoiceProps = {
  choices: ChoiceType[];
  state: [id: string, setId: Dispatch<SetStateAction<string>>];
};

function Overlay({ onClick }: { onClick?: () => void }) {
  return <div className={s.overlay} onClick={() => onClick?.()} />;
}

function useOnWindowEscape(action: () => void) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        action();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [action]);
}

function InnerChoice({
  choice,
  onChooseId,
  chosenId,
}: {
  choice: ChoiceType;
  chosenId: string;
  onChooseId: (id: string) => void;
}) {
  return (
    <>
      <div
        className={c([
          s.choice,
          {
            [s.active]: choice.id === chosenId,
          },
        ])}
        onClick={() => onChooseId(choice.id)}
      >
        <Img sideLength={40} src={choice.img} color={choice.color} />
        <div className={s.choiceName}>{choice.name}</div>
        {choice.children && choice.children.length > 0 && <>→</>}
      </div>
      {choice.children && choice.children.length > 0 && (
        <InnerChoices
          choices={choice.children}
          onChooseId={onChooseId}
          chosenId={chosenId}
        />
      )}
    </>
  );
}

function InnerChoices({
  choices,
  onChooseId,
  chosenId,
}: {
  choices: ChoiceType[];
  chosenId: string;
  onChooseId: (id: string) => void;
}) {
  return (
    <div style={{ marginLeft: 20 }}>
      {choices.map((choice) => (
        <InnerChoice
          key={choice.id}
          choice={choice}
          chosenId={chosenId}
          onChooseId={onChooseId}
        />
      ))}
    </div>
  );
}

export function Choice({ choices, state }: ChoiceProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [chosenId, setChosenId] = state ?? ["", () => {}];
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // We could grab the whole `choice` rather than just the `id` when the user makes a selection,
  // but then what do you do when the component is mounted with a pre-selected choice?
  // We could also build an index mapping `id` to choices if recursing becomes slow.
  const currentChoice = useMemo(() => {
    // console.countReset("currentChoice search");
    let foundChoice: ChoiceType | undefined;
    function searchChoices(choices: ChoiceType[]) {
      if (foundChoice) return;
      // console.count("currentChoice search");
      choices.forEach((choice) => {
        if (choice.id === chosenId) {
          foundChoice = choice;
          return;
        }
        if (choice.children) searchChoices(choice.children);
      });
    }
    searchChoices(choices);
    return foundChoice;
  }, [choices, chosenId]);

  // actions
  const open = () => setIsOpen(true);
  const close = useCallback(() => setIsOpen(false), []);
  const toggleMobileExpanded = () => setMobileExpanded((s) => !s);
  const handleInputEsc: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Escape" && search) {
      setSearch("");
      e.stopPropagation();
    }
  };
  const select = (id: ChoiceType["id"]) => {
    setChosenId(id);
    // close();
  };
  // misc
  useOnWindowEscape(close);
  const filteredChoices = choices.filter((choice: ChoiceType) =>
    // TODO: what about children matching the search?
    search ? choice.name.toLowerCase().indexOf(search.toLowerCase()) > -1 : true
  );

  useEffect(() => {
    searchInputRef?.current?.focus();
  }, [isOpen]);

  const { triggerProps, layerProps, renderLayer } = useLayer({
    isOpen,
    overflowContainer: false,
    placement: "bottom-start",
    containerOffset: 0,
    auto: true,
    preferX: "left",
    preferY: "top",
    onOutsideClick: close,
  });

  return (
    <>
      <div className={s.chosenBox} {...triggerProps} onClick={open}>
        {currentChoice ? (
          <div style={{ display: "flex", width: "100%", minWidth: 315 }}>
            <Img
              sideLength={24}
              src={currentChoice.img}
              color={currentChoice.color}
            />
            <div>{currentChoice.name}</div>
          </div>
        ) : (
          "Choose something"
        )}
      </div>
      {isOpen && (
        <>
          {/* <Overlay onClick={close} /> */}
          {renderLayer(
            <div
              {...layerProps}
              className={`${s.choices} ${mobileExpanded && s.choicesExpanded}`}
            >
              <div
                className={s.mobileExpanded}
                onClick={toggleMobileExpanded}
              />
              <div className={s.searchWrapper}>
                <input
                  ref={searchInputRef}
                  className={s.search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleInputEsc}
                />
              </div>
              {filteredChoices.map((choice) => (
                <InnerChoice
                  key={choice.id}
                  choice={choice}
                  chosenId={chosenId}
                  onChooseId={select}
                />
              ))}
              {choices.length > 0 && filteredChoices.length === 0 && (
                <span>Nothing found 👀</span>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
