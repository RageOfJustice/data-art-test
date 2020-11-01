interface TODOItem {
  text: string;
  done?: boolean;
  id: string;
  parentID: string;
}

interface TODOList {
  id: string;
  name: string;
  items?: TODOItem[];
}
