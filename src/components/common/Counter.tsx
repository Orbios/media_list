interface Props {
  total: number;
  title: string;
}

function Counter({total, title}: Props) {
  if (total === 0) return null;

  return (
    <div>
      {title} count: {total}
    </div>
  );
}

export default Counter;
