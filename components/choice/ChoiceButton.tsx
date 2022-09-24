import { forwardRef } from "react";
import s from "./ChoiceButton.module.css";

export const ChoiceButton = forwardRef(function ChoiceButton(
  { children, ...rest }: any,
  ref
) {
  return (
    <button ref={ref} className={s.button} {...rest}>
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
