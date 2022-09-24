import { useMemo } from "react";
import { ChoiceType } from "./types";

// We could grab the whole `choice` rather than just the `id` when the user makes a selection,
// but then what do you do when the component is mounted with a pre-selected choice?
// We could also build an index mapping `id` to choices if recursing becomes slow.
export function useCurrentChoice(chosenId: string, choices: ChoiceType[]) {
  return useMemo(() => {
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
}
