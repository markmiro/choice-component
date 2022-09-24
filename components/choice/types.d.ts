export type ChoiceType = {
  id: string;
  img: string;
  name: string;
  children: ChoiceType[];
};

export type ChoiceProps = {
  choices: ChoiceType[];
  state: [id: string, setId: Dispatch<SetStateAction<string>>];
};
