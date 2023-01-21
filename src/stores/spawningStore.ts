import { create } from "zustand";
import type { Parents } from "../components/SpawningCard";
import type { Child } from "../pages/api/claim";

interface SpawnState {
  currentParentsIndex: number;
  children: Child[];
  parents: Parents[];
  addParents: (parents: Parents[]) => void;
  addChild: (child: Child) => void;
  increase: () => void;
  reset: () => void;
}

export const useSpawnState = create<SpawnState>()((set) => ({
  currentParentsIndex: 0,
  children: [],
  parents: [],
  addParents: (parents: Parents[]) => set(() => ({ parents: parents })),
  increase: () =>
    set((state) => ({ currentParentsIndex: state.currentParentsIndex + 1 })),
  addChild: (child: Child) =>
    set((state) => ({ children: [...state.children, child] })),
  reset: () =>
    set(() => ({ children: [], currentParentsIndex: 0, parents: [] })),
}));
