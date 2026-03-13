export function warnOnlyOnce(message: string) {
  if (import.meta.env.NODE_ENV === "production") {
    return;
  }
  let run = false;
  return () => {
    if (!run) {
      console.warn(message);
    }
    run = true;
  };
}
