import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import s from "./Choice.module.css";

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

export function Choice({ choices, state }: ChoiceProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [chosen, setChosen] = state ?? ["", () => {}];
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // actions
  const open = () => setIsOpen(true);
  const close = useCallback(() => setIsOpen(false), []);
  const toggleMobileExpanded = () => setMobileExpanded((s) => !s);

  useOnWindowEscape(close);

  return (
    <>
      <div className={s.chosenBox} onClick={open}>
        Choose something
      </div>
      {isOpen && (
        <>
          <Overlay onClick={close} />
          <div
            className={`${s.choices} ${mobileExpanded && s.choicesExpanded}`}
          >
            <div className={s.mobileExpanded} onClick={toggleMobileExpanded} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} />
            {choices.map((choice) => (
              <div key={choice.id} className={s.choice}>
                <div className={s.img} />
                {choice.name}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
