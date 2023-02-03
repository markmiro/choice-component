import { DetailedHTMLProps, forwardRef, HTMLAttributes, useId } from "react";
import c from "classnames";
import { ChoiceType } from "./types";
import { useChoiceContext } from "./ChoiceContext";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

function Img({ src, sideLength }: { sideLength: number; src: string }) {
  const id = useId();
  return (
    <div
      className="flex-shrink-0 overflow-hidden rounded-full bg-gray-200"
      // translateZ fixes safari bug
      // https://stackoverflow.com/a/58283449/3075798
      style={{ transform: "translateZ(0)" }}
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
        className="w-10 h-10 block shrink-0 bg-black"
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
        <div className="flex items-center gap-2">
          <Img sideLength={24} src={choice.img} />
          <div className="truncate">{choice.name}</div>
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
          "w-full text-left flex px-4 py-3 items-center gap-3 hover:bg-neutral-100 focus:bg-gray-100 focus:outline-none",
          {
            ["bg-blue-500 text-white hover:bg-blue-600"]:
              isActive && !hasChildren,
            ["bg-neutral-100"]: isHover,
          },
        ])}
        {...rest}
      >
        <Img sideLength={40} src={choice.img} />
        <div className="flex-grow">{choice.name}</div>
        {isActive && hasChildren && (
          <div className="rounded-full w-2 h-2 bg-blue-500" />
        )}
        {hasChildren && <ChevronRightIcon className="h-5 w-5 opacity-30" />}
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
