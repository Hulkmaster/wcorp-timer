export function rafCallback<T>(callbackFunction: (...args: T[]) => void) {
  let rafId: number = 0;

  const call = (...args: T[]) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      callbackFunction(...args);
    });
  };

  return call;
}

