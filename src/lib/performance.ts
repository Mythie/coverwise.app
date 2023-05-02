export const logT = (...args: any[]) => {
  const start = performance.now();

  return () => {
    const end = performance.now();

    console.log(`[${(end - start).toFixed(2)}MS]:`, ...args);
  };
};
