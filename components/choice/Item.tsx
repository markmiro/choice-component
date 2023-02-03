import { DetailedHTMLProps, forwardRef, HTMLAttributes, useId } from "react";
import c from "classnames";
import { ChoiceType } from "./types";
import { useChoiceContext } from "./ChoiceContext";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

function Img({ src, sideSize }: { sideSize: string; src: string }) {
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
        className={`w-${sideSize} h-${sideSize} block shrink-0 bg-black`}
        style={{
          opacity: 0,
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
          <Img sideSize="5" src={choice.img} />
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
          "w-full text-left flex pl-4 pr-2 py-2 items-center gap-2 focus:outline-none",
          {
            "hover:bg-gray-100 focus:bg-gray-100": !isHover && !isActive,
            "bg-blue-500 text-white hover:bg-blue-600":
              isActive && !hasChildren,
            "bg-gray-100": isHover,
          },
        ])}
        {...rest}
      >
        <Img sideSize="7" src={choice.img} />
        <div className="flex-grow">{choice.name}</div>
        <div
          className={c(
            "rounded-full w-2 h-2 bg-blue-500",
            isActive && hasChildren ? "opacity-100" : "opacity-0"
          )}
        />
        <ChevronRightIcon
          className={c("h-5 w-5", hasChildren ? "opacity-30" : "opacity-0")}
        />
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
