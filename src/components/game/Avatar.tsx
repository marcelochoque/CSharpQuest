export function Avatar({
  size = 140,
  variant = 'azure',
  evolved = false,
}: {
  size?: number;
  variant?: string;
  evolved?: boolean;
}) {
  const color = variant === 'violet' ? '#b599ff' : variant === 'emerald' ? '#58e8b9' : '#6bb5ff';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      role="img"
      aria-label={evolved ? 'Avatar: arquitecto digital' : 'Avatar: aprendiz digital'}
    >
      <circle cx="90" cy="90" r="81" fill={color} opacity=".07" />
      <circle
        cx="90"
        cy="90"
        r="68"
        fill="none"
        stroke={color}
        opacity=".2"
        strokeDasharray="4 8"
      />
      <path
        d="M41 146 54 107 90 96 126 107 139 146 90 163Z"
        fill="#253f64"
        stroke={color}
        strokeWidth="2"
      />
      <path d="m68 106 22 40 22-40-22 10Z" fill={color} />
      <path
        d="m39 140 16-23 14 13-16 23m88-13-16-23-14 13 16 23"
        fill="#182b47"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M53 50 73 31 110 35 129 55 124 94 104 113 77 111 56 94Z"
        fill="#192a46"
        stroke={color}
        strokeWidth="3"
      />
      <path d="M57 60 87 50 124 59 120 85 91 99 60 85Z" fill="#0b152b" />
      <path
        d="m68 70 12 5-12 6m44-11-12 5 12 6"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M82 89h17" stroke="#d8eaff" strokeWidth="2" strokeLinecap="round" />
      <path d="m87 121 8 0-4 12Z" fill="white" />
      {evolved && (
        <path
          d="m62 33-3-19 20 10 12-17 13 17 19-10-3 21"
          stroke="#fbbf24"
          fill="#413822"
          strokeWidth="3"
        />
      )}
    </svg>
  );
}
