import { useMemo } from "react";
import { ChoiceType } from "./types";

export function useChoiceById(choices: ChoiceType[]) {
  return useMemo(() => {
    // const byId = new Map<string, ChoiceType>();
    const byId: Record<string, ChoiceType> = {};
    let count = 0;

    const iterateChoices = (choices: ChoiceType[]) => {
      choices.forEach((choice) => {
        // byId.set(choice.id, choice);
        byId[choice.id] = choice;
        count++;
        if (choice.children) iterateChoices(choice.children);
      });
    };
    iterateChoices(choices);

    return {
      get: (id: string) => byId[id],
      count,
    };
  }, [choices]);
}
