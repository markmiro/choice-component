import type { NextPage } from "next";
import Head from "next/head";
import "@markmiro/css-base";
import styles from "../styles/Home.module.css";
import { Choice, ChoiceType } from "../components/choice";
import { faker } from "@faker-js/faker";
import { useState } from "react";

faker.seed(1);

let i = 0;
const getImage = () => {
  const img = `https://picsum.photos/id/${i + 10}/80`;
  i++;
  return img;
};
function createChoice(): ChoiceType {
  return {
    id: faker.random.alphaNumeric(10),
    img: getImage(),
    color: faker.color.hsl(),
    name: faker.lorem.word(),
    children: [],
  };
}

function createChoices(count: number) {
  const arr = new Array(count);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = createChoice();
  }
  return arr;
}

const choices = createChoices(5);

const Home: NextPage = () => {
  const [showChoice, setShowChoice] = useState(true);
  const choiceState = useState<string>("");
  const toggleShowChoice = () => setShowChoice((s) => !s);

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
      </main>
      <button
        onClick={toggleShowChoice}
        style={{
          top: 0,
          position: "absolute",
          zIndex: 9999,
        }}
      >
        Toggle show choice
      </button>
      {showChoice && <Choice choices={choices} state={choiceState} />}
    </div>
  );
};

export default Home;
