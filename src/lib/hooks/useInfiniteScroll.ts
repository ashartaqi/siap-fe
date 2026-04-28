import { useEffect, useRef } from "react";

export function useInfiniteScroll(
  fetchNextPage: () => void,
  hasNextPage: boolean | undefined,
  isFetchingNextPage: boolean,
) {
  const observerRef = useRef<HTMLDivElement>(null);

  const paginationRef = useRef({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  useEffect(() => {
    paginationRef.current = { fetchNextPage, hasNextPage, isFetchingNextPage };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const { fetchNextPage, hasNextPage, isFetchingNextPage } =
          paginationRef.current;
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    const target = observerRef.current;
    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, []); // stable — created once

  return observerRef;
}
