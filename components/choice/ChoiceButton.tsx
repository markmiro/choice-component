import { ChevronDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ForwardedRef,
  forwardRef,
} from "react";
import s from "./ChoiceButton.module.css";

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
      className={classNames([s.button, { [s.buttonActive]: isActive }])}
      {...rest}
    >
      <div className={s.content}>{children}</div>
      <ChevronDownIcon className="h-5 w-5" />
    </button>
  );
});
