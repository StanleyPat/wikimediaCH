export interface Source {
  label: string;
  url: string;
}

export interface Fact {
  id: string;
  text: string;
  isTrue: boolean;
  explanation: string;
  sources: Source[];
}

export interface GameState {
  score: number;
  currentIndex: number;
  isFinished: boolean;
  history: { factId: string; wasCorrect: boolean }[];
}
