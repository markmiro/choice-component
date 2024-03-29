import { faker } from "@faker-js/faker";
import "normalize.css";
import type { NextPage } from "next";
import Head from "next/head";
import { Dispatch, SetStateAction, useState } from "react";
import { Choice, ChoiceType } from "../components/choice";
import { ChoiceButton } from "../components/choice/ChoiceButton";
import { CurrentChoice } from "../components/choice/Item";

faker.seed(1);

let i = 0;
const getImage = () => {
  // `% 31` to wrap since big ids don't have images, and want a number that's not so predictable
  const img = `https://i.pravatar.cc/150?img=${(i % 31) + 10}/80`;
  i++;
  return img;
};

function createChoice() {
  return {
    id: faker.random.alphaNumeric(10),
    // img: faker.image.avatar(),
    img: getImage(),
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
  "Super Nested": createChoices([10, 3, 3]),
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

      <main className="p-8 ml-auto mr-auto max-w-xl" id="__main">
        <h1 className="leading-none font-semibold text-3xl">
          Choice Component
          <br />
          <small className="font-normal text-lg my-3 opacity-50 italic">
            Choose items from a nested structure.
          </small>
        </h1>

        <p className="leading-snug border rounded-lg px-5 py-3 border-blue-300 bg-blue-50 text-blue-900">
          Try it on mobile. If you&apos;re emulating, make sure to refresh the
          page.
        </p>

        <p className="my-3 leading-snug">Things to try:</p>

        <ol className="list-decimal ml-6 leading-snug">
          <li className="my-1">
            Click on a deeply nested item, then follow the blue dots to find it
            again.
          </li>
          <li className="my-1">Search for a deeply nested item.</li>
          <li className="my-1">Try it on mobile.</li>
          <li className="my-1">Play with the screen size.</li>
          <li className="my-1">
            Press <kbd>Esc</kbd> key when you have a search query. It should
            clear the search. Then press <kbd>Esc</kbd> again. It should close
            the menu.
          </li>
          <li className="my-1">
            Load the page with{" "}
            <a
              href="https://developer.chrome.com/docs/devtools/javascript/disable/#:~:text=Press%20Control%2BShift%2BP%20or,to%20open%20the%20Command%20Menu.&text=Start%20typing%20javascript%20%2C%20select%20Disable,JavaScript%20is%20now%20disabled.&text=The%20yellow%20warning%20icon%20next,you%20that%20JavaScript%20is%20disabled."
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              JavaScript disabled
            </a>
            . The UI should be the same, but the menu is not interactive.
          </li>
        </ol>

        <hr className="my-5" />

        <div className="flex flex-col gap-5">
          {Object.keys(choiceVariations).map((key) => (
            <div key={key}>
              <h3 className="font-semibold mb-3">{key}</h3>
              <div className="flex flex-wrap gap-3">
                <div>
                  <Choice
                    choices={choiceVariations[key as KeyType]}
                    state={choiceVariationsState[key]}
                  />
                  <p className="my-1 text-xs italic text-gray-500">
                    Unselected
                  </p>
                </div>
                <div>
                  <Choice
                    choices={choiceVariations[key as KeyType]}
                    state={choiceVariationsState2[key]}
                  />
                  <p className="my-1 text-xs italic text-gray-500">
                    Pre-selected
                  </p>
                </div>
              </div>
            </div>
          ))}

          <h3>Non-interactive (ChoiceButton without menu)</h3>

          <ChoiceButton>
            <CurrentChoice choice={singleChoice} />
          </ChoiceButton>

          <ChoiceButton style={{ width: 100 }}>
            <CurrentChoice choice={singleChoice} />
          </ChoiceButton>
        </div>

        {/* Footer space */}
        <div style={{ height: "50vh" }} />
        <Choice
          choices={choiceVariations["Super Nested"]}
          state={choiceVariationsState2[0]}
        />
      </main>
    </div>
  );
};

export default Home;
