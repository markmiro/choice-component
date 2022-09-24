import { DetailedHTMLProps, forwardRef, HTMLAttributes } from "react";
import s from "./Item.module.css";
import c from "classnames";
import { ChoiceType } from "./types";

function Img({
  color,
  src,
  sideLength,
}: {
  sideLength: number;
  color: number[];
  src: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      className={s.img}
      style={{
        backgroundColor: `hsl(${color[0]}deg, 100%, 80%)`,
        width: sideLength,
        height: sideLength,
      }}
    />
  );
}

export function CurrentChoice({ choice }: { choice?: ChoiceType }) {
  return (
    <>
      {choice ? (
        <div className={s.currentChoice}>
          <Img sideLength={24} src={choice.img} color={choice.color} />
          <div className={s.currentChoiceText}>{choice.name}</div>
        </div>
      ) : (
        "Choose something"
      )}
    </>
  );
}

type MenuItemPropsType = {
  choice: ChoiceType;
  chosenId?: string;
  onChooseId: (id: string) => void;
} & DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemPropsType>(
  function MenuItem({ choice, onChooseId, chosenId, ...rest }, ref) {
    return (
      <button
        ref={ref}
        className={c([
          s.menuItem,
          {
            [s.active]: choice.id === chosenId,
          },
        ])}
        onClick={() => onChooseId(choice.id)}
        {...rest}
      >
        <Img sideLength={40} src={choice.img} color={choice.color} />
        <div className={s.menuItemName}>{choice.name}</div>
        {choice.children && choice.children.length > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={s.menuItemIcon}
            src="/icons/popover-select.svg"
            width={8}
            height={14}
            alt=""
          />
        )}
      </button>
    );
  }
);
