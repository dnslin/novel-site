import type { Ref } from "vue";

export const useTypeWriter = (
  text: string,
  displayRef: Ref<string>,
  speed: number = 100
): Promise<void> => {
  return new Promise((resolve) => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        displayRef.value += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
};
