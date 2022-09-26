import { createContext, PropsWithChildren, useContext } from "react";

type ChoiceContext = {
  chosenId: string;
  setChosenId: (id: string) => void;
};
const ChoiceContext = createContext<ChoiceContext>({
  chosenId: "",
  setChosenId: () => {},
});

type ChoiceContextProviderProps = PropsWithChildren & {
  chosenId: string;
  setChosenId: (id: string) => void;
};

export function ChoiceContextProvider({
  children,
  chosenId,
  setChosenId,
}: ChoiceContextProviderProps) {
  return (
    <ChoiceContext.Provider
      value={{
        chosenId,
        setChosenId,
      }}
    >
      {children}
    </ChoiceContext.Provider>
  );
}

export function useChoiceContext() {
  return useContext(ChoiceContext);
}
