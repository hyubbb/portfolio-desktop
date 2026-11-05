import { useEffect } from "react";
import { getItem } from "@/entities/desktop-item";
import { selectTopWindowId, useWindowStore } from "@/entities/window";
import { readHash, writeHash } from "../lib/hash";

function openFromHash() {
  const id = readHash(window.location.hash);
  const item = id ? getItem(id) : undefined;
  if (item) useWindowStore.getState().open(item.id, item.size);
}

/**
 * 주소의 #해시와 맨 앞 창을 맞춘다.
 * - 처음 들어올 때나 해시가 바뀌면 그 창을 연다 (예: /#fastlane)
 * - 맨 앞 창이 바뀌면 해시를 바꿔서, 지금 화면을 그대로 공유할 수 있게 한다
 */
export function useDeepLink() {
  useEffect(() => {
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    let last = selectTopWindowId(useWindowStore.getState());
    const unsubscribe = useWindowStore.subscribe((state) => {
      const top = selectTopWindowId(state);
      if (top !== last) {
        last = top;
        writeHash(top);
      }
    });
    return () => {
      window.removeEventListener("hashchange", openFromHash);
      unsubscribe();
    };
  }, []);
}
