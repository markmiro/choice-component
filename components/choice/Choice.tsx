import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { MobileChoice } from "./MobileChoice";
import { ChoiceProps } from "./types";

const DynamicDesktopChoice = dynamic(() => import("./DesktopChoice"), {
  ssr: false,
});

export function Choice(props: ChoiceProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (document.body.clientWidth > 400) {
      setIsDesktop(true);
    }
  }, []);

  if (isDesktop) {
    return <DynamicDesktopChoice {...props} />;
  } else {
    return <MobileChoice {...props} />;
  }
}
