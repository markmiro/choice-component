import { DetailedHTMLProps, forwardRef, HTMLAttributes, useId } from "react";
import s from "./Item.module.css";
import c from "classnames";
import { ChoiceType } from "./types";
import { useChoiceContext } from "./ChoiceContext";

function Img({ src, sideLength }: { sideLength: number; src: string }) {
  const id = useId();
  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        borderRadius: 4,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        id={id}
        onLoad={(e) => {
          const el = document.getElementById(id);
          if (!el) return;
          el.style.transition = "opacity 200ms ease-out";
          el.style.opacity = "1";
        }}
        src={src}
        alt=""
        loading="lazy"
        className={s.img}
        style={{
          opacity: 0,
          width: sideLength,
          height: sideLength,
        }}
      />
    </div>
  );
}

export function CurrentChoice({ choice }: { choice?: ChoiceType }) {
  return (
    <>
      {choice ? (
        <div className={s.currentChoice}>
          <Img sideLength={24} src={choice.img} />
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
  isActive?: boolean;
  /** Useful for nested menus */
  isHover?: boolean;
} & DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemPropsType>(
  function MenuItem({ choice, isActive, isHover, ...rest }, ref) {
    const hasChildren = choice.children && choice.children.length > 0;
    return (
      <button
        ref={ref}
        className={c([
          s.menuItem,
          {
            [s.active]: isActive && !hasChildren,
            [s.onPath]: isHover,
          },
        ])}
        {...rest}
      >
        <Img sideLength={40} src={choice.img} />
        <div className={s.menuItemName}>{choice.name}</div>
        {isActive && hasChildren && <div className={s.activeDot} />}
        {hasChildren && (
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

type MenuItemWithContextPropsType = {
  choice: ChoiceType;
} & DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const MenuItemWithContext = forwardRef<
  HTMLButtonElement,
  MenuItemWithContextPropsType
>(function MenuItemWithContext({ choice, ...rest }, ref) {
  const ctx = useChoiceContext();
  return (
    <MenuItem
      ref={ref}
      choice={choice}
      isActive={
        choice.id === ctx.chosenId ||
        ctx.choiceById.path(ctx.chosenId).includes(choice.id)
      }
      isHover={ctx.choiceById.path(ctx.tempChosenId).includes(choice.id)}
      onClick={() => ctx.setChosenId(choice.id)}
      onMouseEnter={(e) => {
        ctx.setTempChosenId(choice.id);
        // console.log(ctx?.choiceById.path(ctx.tempChosenId));
        rest.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        const path = ctx?.choiceById.path(ctx.tempChosenId);
        if (ctx.tempChosenId === choice.id) {
          if (path[path.length - 1]) {
            ctx.setTempChosenId(path[path.length - 1]);
          } else {
            ctx.setTempChosenId("");
          }
        }
        rest.onMouseLeave?.(e);
      }}
    />
  );
});
