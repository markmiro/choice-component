import { useMemo } from "react";
import { ChoiceType } from "./types";

export function useChoiceById(choices: ChoiceType[]) {
  return useMemo(() => {
    // const byId = new Map<string, ChoiceType>();
    const byId: Record<string, ChoiceType> = {};

    const iterateChoices = (choices: ChoiceType[]) => {
      choices.forEach((choice) => {
        // byId.set(choice.id, choice);
        byId[choice.id] = choice;
        if (choice.children) iterateChoices(choice.children);
      });
    };
    iterateChoices(choices);

    return (id: string) => byId[id];
  }, [choices]);
}
