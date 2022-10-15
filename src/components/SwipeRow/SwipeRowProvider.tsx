import React from 'react';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react';

interface SwipeRowContext {
  openedItemKey: string;
  setOpenedItemKey: Dispatch<SetStateAction<string>>;
  isFocused: boolean;
  focusTabDep: string | undefined;
}

const swipeContextValues: SwipeRowContext = {
  openedItemKey: '',
  setOpenedItemKey: () => {},
  isFocused: false,
  focusTabDep: undefined,
};

export const SwipeRowContext = createContext(swipeContextValues);

interface SwipeRowProviderProps {
  initialOpenedItemKey?: string;
  isFocusedScreen: boolean;
  focusTabDep?: string | undefined;
}

export const SwipeRowProvider = ({
  initialOpenedItemKey = '',
  isFocusedScreen,
  focusTabDep,
  children,
}: PropsWithChildren<SwipeRowProviderProps>) => {
  const [openedItemKey, setOpenedItemKey] = useState(initialOpenedItemKey);
  const value = useMemo(() => {
    return {
      openedItemKey,
      setOpenedItemKey,
      isFocused: isFocusedScreen,
      focusTabDep,
    };
  }, [openedItemKey, isFocusedScreen, focusTabDep]);

  return (
    <SwipeRowContext.Provider value={value}>
      {children}
    </SwipeRowContext.Provider>
  );
};

SwipeRowProvider.Context = SwipeRowContext;
