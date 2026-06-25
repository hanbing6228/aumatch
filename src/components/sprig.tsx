// The AuMatch "panned gold" wheat sprig motif, used as a recurring accent.
export function Sprig({
  width = 20,
  height = 32,
  color = "#b1812f",
  className,
  style,
}: {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 32"
      fill={color}
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d="M10 9 V31" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <ellipse cx="10" cy="4.5" rx="1.7" ry="4" />
      <ellipse cx="6.4" cy="10" rx="1.5" ry="3.3" transform="rotate(34 6.4 10)" />
      <ellipse cx="13.6" cy="10" rx="1.5" ry="3.3" transform="rotate(-34 13.6 10)" />
      <ellipse cx="6.6" cy="15.5" rx="1.5" ry="3.2" transform="rotate(34 6.6 15.5)" />
      <ellipse cx="13.4" cy="15.5" rx="1.5" ry="3.2" transform="rotate(-34 13.4 15.5)" />
      <ellipse cx="7" cy="21" rx="1.4" ry="3" transform="rotate(34 7 21)" />
      <ellipse cx="13" cy="21" rx="1.4" ry="3" transform="rotate(-34 13 21)" />
    </svg>
  );
}
