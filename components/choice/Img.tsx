import s from "./Choice.module.css";

export function Img({
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
      alt="none"
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
