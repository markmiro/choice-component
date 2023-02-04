import { ChevronDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ForwardedRef,
  forwardRef,
} from "react";

type ChoiceButtonPropType = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  isActive?: boolean;
};

export const ChoiceButton = forwardRef(function ChoiceButton(
  { children, isActive, ...rest }: ChoiceButtonPropType,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      className={classNames([
        "h-9 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-start relative flex items-center gap-2 disabled:opacity-50 cursor-default",
        { "hover:bg-gray-200": isActive },
      ])}
      {...rest}
    >
      <div className="grow truncate">{children}</div>
      <ChevronDownIcon className="h-5 w-5 shrink-0" />
    </button>
  );
});
