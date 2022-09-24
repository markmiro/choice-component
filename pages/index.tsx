import { faker } from "@faker-js/faker";
import "normalize.css";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { Choice, ChoiceType } from "../components/choice";
import styles from "../styles/Home.module.css";
import { ChoiceButton } from "../components/choice/ChoiceButton";
import { CurrentChoice } from "../components/choice/Item";

faker.seed(1);

let i = 0;
const getImage = () => {
  // `% 101` to wrap since big ids don't have images, and want a number that's not so predictable
  const img = `https://picsum.photos/id/${(i + 10) % 101}/80`;
  i++;
  return img;
};

function createChoice() {
  return {
    id: faker.random.alphaNumeric(10),
    img: getImage(),
    color: faker.color.hsl(),
    name: faker.lorem.sentence(),
    children: [],
  };
}

function createChoices(count: number, levels: number): ChoiceType[] {
  const arr = new Array(count);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = {
      ...createChoice(),
      children: levels ? createChoices(7, levels - 1) : [],
    };
  }
  return arr;
}

const singleChoice = createChoice();
const choiceVariations = {
  None: [] as ChoiceType[],
  One: createChoices(1, 0),
  Basic: createChoices(3, 0),
  Medium: createChoices(3, 1),
  Advanced: createChoices(10, 2),
};
type KeyType = keyof typeof choiceVariations;

const Home: NextPage = () => {
  const [showChoice, setShowChoice] = useState(true);
  const toggleShowChoice = () => setShowChoice((s) => !s);

  let choiceVariationsState: Record<
    string,
    [string, Dispatch<SetStateAction<string>>]
  > = {};
  Object.keys(choiceVariations).forEach((key) => {
    // I know it's "bad", but this will execute in the same order each time
    // eslint-disable-next-line react-hooks/rules-of-hooks
    choiceVariationsState[key] = useState<string>("");
  });

  return (
    <div>
      <Head>
        <title>Glide Choice Component</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Glide Choice Component</h1>
        <a href="https://www.figma.com/file/gXlpBINSgg129W887h5ygW/Choice-Component?node-id=0%3A1">
          Figma File
        </a>

        {/* <Image src="/icons/back.svg" width={18} height={16} alt="" />
        <Image src="/icons/chevron-down.svg" width={12} height={7} alt="" />
        <Image src="/icons/popover-select.svg" width={8} height={14} alt="" />
        <Image src="/icons/search.svg" width={19} height={19} alt="" /> */}

        <br />

        {/* <button
          onClick={toggleShowChoice}
          style={{
            top: 0,
            position: "absolute",
            zIndex: 9999,
          }}
        >
          Toggle show choice
        </button> */}

        {/* {showChoice && <Choice choices={choices} state={choiceState} />} */}

        <div style={{ height: 16 }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxWidth: 500,
          }}
        >
          <ChoiceButton>
            <CurrentChoice choice={singleChoice} />
          </ChoiceButton>

          <ChoiceButton style={{ width: 200 }}>
            <CurrentChoice choice={singleChoice} />
          </ChoiceButton>

          {Object.keys(choiceVariations).map((key) => (
            <div key={key}>
              <h3>{key}</h3>
              <Choice
                choices={choiceVariations[key as KeyType]}
                state={choiceVariationsState[key]}
              />
            </div>
          ))}
        </div>
        <div style={{ height: "50vh" }} />
      </main>
    </div>
  );
};

export default Home;
