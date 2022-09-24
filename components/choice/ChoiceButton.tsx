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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={s.icon}
        src="/icons/chevron-down.svg"
        width={12}
        height={7}
        alt=""
      />
    </button>
  );
});
