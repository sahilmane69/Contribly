"use client";

import * as React from "react";

export function NumberTicker({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let frame = 0;
    const totalFrames = 48;
    const counter = window.setInterval(() => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      setDisplayValue(Math.round(value * progress));

      if (frame >= totalFrames) {
        window.clearInterval(counter);
        setDisplayValue(value);
      }
    }, 18);

    return () => window.clearInterval(counter);
  }, [value]);

  return <span className={className}>{displayValue.toLocaleString()}</span>;
}
