import { useEffect, useState } from 'react';
import { FlatListProps } from 'react-native';

export interface InfiniteScrollOptions<T> {
  initialOffset?: number;
  initialIsLoading?: boolean;
  perPage?: number;
  getData: (page: number, perPage: number) => Promise<T[]>;
  resetData?: () => void;
}

interface InfiniteScroll<T> {
  isLoading: boolean;
  resetToFirstPage: () => void;
  flatListProps: Pick<
    FlatListProps<T>,
    'onEndReached' | 'refreshing' | 'onRefresh'
  >;
}

export default <T>(options: InfiniteScrollOptions<T>): InfiniteScroll<T> => {
  const opts = {
    initialOffset: 0,
    initialIsLoading: true,
    perPage: 10,
    ...options,
  };
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(opts.initialIsLoading);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(opts.initialOffset);

  const getMoreData = async (hasToResetData: boolean, isReset?: boolean) => {
    setRefreshing(Boolean(isReset));
    setIsLoading(true);
    try {
      if (hasToResetData) {
        options.resetData?.();
      }
      const resp = await opts.getData(offset, opts.perPage);
      setHasMore(resp.length > 0);
    } catch (e) {
      // Ignore the error
    }
    setRefreshing(false);
    setIsLoading(false);
  };

  useEffect(() => {
    getMoreData(offset === 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const onEndReached = () => {
    if (!isLoading && hasMore) {
      setOffset(prevOffset => prevOffset + opts.perPage);
    }
  };

  const resetToFirstPage = () => {
    if (offset === 0) {
      getMoreData(true, true);
    } else {
      setOffset(0);
    }
  };

  return {
    isLoading,
    resetToFirstPage,
    flatListProps: {
      onEndReached,
      refreshing,
      onRefresh: () => resetToFirstPage(),
    },
  };
};
