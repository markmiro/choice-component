import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useChoiceById } from "./useChoiceById";

type ChoiceById = ReturnType<typeof useChoiceById>;
type ChoiceContext = {
  chosenId: string;
  setChosenId: (id: string) => void;
  tempChosenId: string;
  setTempChosenId: (id: string) => void;
  choiceById: ChoiceById;
};

const ChoiceContext = createContext<ChoiceContext | undefined>(undefined);

type ChoiceContextProviderProps = PropsWithChildren & {
  choiceById: ChoiceById;
  chosenId: string;
  setChosenId: (id: string) => void;
};

export function ChoiceContextProvider({
  choiceById,
  chosenId,
  setChosenId,
  children,
}: ChoiceContextProviderProps) {
  const [tempChosenId, setTempChosenId] = useState("");

  return (
    <ChoiceContext.Provider
      value={{
        chosenId,
        setChosenId,
        choiceById,
        tempChosenId,
        setTempChosenId,
      }}
    >
      {children}
    </ChoiceContext.Provider>
  );
}

export const ChoiceContextConsumer = ChoiceContext.Consumer;

export function useChoiceContext() {
  const choiceContext = useContext(ChoiceContext);
  if (choiceContext === undefined) {
    throw new Error("Requires a <ChoiceContext /> parent component");
  }
  return choiceContext;
}
