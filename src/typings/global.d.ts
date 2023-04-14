type OnChangeHandler = (field: string, value: any) => void;

interface BasicOption {
  value: string;
  label: string;
}

type entityType = 'movie' | 'book' | 'game';
