import { faker } from "@faker-js/faker";
import "normalize.css";
import type { NextPage } from "next";
import Head from "next/head";
import { Dispatch, SetStateAction, useState } from "react";
import { Choice, ChoiceType } from "../components/choice";
import styles from "../styles/Home.module.css";
import { ChoiceButton } from "../components/choice/ChoiceButton";
import { CurrentChoice } from "../components/choice/Item";

faker.seed(1);

let i = 0;
const getImage = () => {
  // `% 31` to wrap since big ids don't have images, and want a number that's not so predictable
  const img = `https://picsum.photos/id/${(i % 31) + 10}/80`;
  i++;
  return img;
};

function createChoice() {
  return {
    id: faker.random.alphaNumeric(10),
    img: faker.image.avatar(),
    // img: getImage(),
    // name: faker.lorem.sentence(),
    name: faker.name.fullName(),
    children: [],
  };
}

function createChoices(counts: number[]): ChoiceType[] {
  if (!counts || counts.length === 0) return [];
  const arr = new Array(counts[0]);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = {
      ...createChoice(),
      children: createChoices(counts.slice(1)),
    };
  }
  return arr;
}

const singleChoice = createChoice();
const choiceVariations = {
  SuperNested: createChoices([10, 3, 3]),
  Nested: createChoices([3, 7]),
  Many: createChoices([15]),
  Small: createChoices([3]),
  One: createChoices([1]),
  None: [] as ChoiceType[],
};
type KeyType = keyof typeof choiceVariations;

const Home: NextPage = () => {
  let choiceVariationsState: Record<
    string,
    [string, Dispatch<SetStateAction<string>>]
  > = {};
  Object.keys(choiceVariations).forEach((key) => {
    // I know it's "bad", but this will execute in the same order each time
    // eslint-disable-next-line react-hooks/rules-of-hooks
    choiceVariationsState[key] = useState<string>("");
  });

  let choiceVariationsState2: Record<
    string,
    [string, Dispatch<SetStateAction<string>>]
  > = {};
  Object.keys(choiceVariations).forEach((key) => {
    let choice = choiceVariations[key as KeyType]?.[0];
    // select the most nested component
    while (choice && choice.children && choice.children.length > 0) {
      choice = choice.children[0];
    }
    // I know it's "bad", but this will execute in the same order each time
    // eslint-disable-next-line react-hooks/rules-of-hooks
    choiceVariationsState2[key] = useState<string>(choice?.id);
  });

  return (
    <div>
      <Head>
        <title>Choice Component</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>

      <main className={styles.main} id="__main">
        <h1>Choice Component</h1>

        <h1 className="text-3xl font-bold underline">Hello world!</h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxWidth: 500,
          }}
        >
          {Object.keys(choiceVariations).map((key) => (
            <div key={key}>
              <h3>{key}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1em" }}>
                <div>
                  <p>Unselected</p>
                  <Choice
                    choices={choiceVariations[key as KeyType]}
                    state={choiceVariationsState[key]}
                  />
                </div>
                <div>
                  <p>Pre-selected</p>
                  <Choice
                    choices={choiceVariations[key as KeyType]}
                    state={choiceVariationsState2[key]}
                  />
                </div>
              </div>
            </div>
          ))}

          <h3>non-interactive (ChoiceButton without menu)</h3>

          <ChoiceButton>
            <CurrentChoice choice={singleChoice} />
          </ChoiceButton>

          <ChoiceButton style={{ width: 100 }}>
            <CurrentChoice choice={singleChoice} />
          </ChoiceButton>
        </div>
        <div style={{ height: "50vh" }} />
      </main>
    </div>
  );
};

export default Home;
