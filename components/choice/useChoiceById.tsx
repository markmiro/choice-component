import { useMemo } from "react";
import { ChoiceType } from "./types";

export function useChoiceById(choices: ChoiceType[]) {
  return useMemo(() => {
    // const byId = new Map<string, ChoiceType>();
    const byId: Record<string, ChoiceType> = {};
    const pathToId: Record<string, string[]> = {};
    let count = 0;

    const iterateChoices = (path: string[], choices: ChoiceType[]) => {
      choices.forEach((choice) => {
        // byId.set(choice.id, choice);
        byId[choice.id] = choice;
        pathToId[choice.id] = path;
        count++;
        if (choice.children)
          iterateChoices([...path, choice.id], choice.children);
      });
    };
    iterateChoices([], choices);

    return {
      get: (id: string) => byId[id],
      path: (id: string) => pathToId[id] || [],
      count,
    };
  }, [choices]);
}
