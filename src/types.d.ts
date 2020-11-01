interface TODOItem {
  text: string;
  done?: boolean;
  id: string;
  listID: string;
  timestamp: number;
}

interface TODOList {
  id: string;
  name: string;
  itemIDs: string[];
  timestamp: number;
}

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
