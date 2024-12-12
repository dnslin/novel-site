// 预定义一些柔和的颜色组合
const colorPalettes = [
  {
    bg: "bg-blue-100/70",
    text: "text-blue-700",
    darkBg: "dark:bg-blue-900/30",
    darkText: "dark:text-blue-300",
  },
  {
    bg: "bg-purple-100/70",
    text: "text-purple-700",
    darkBg: "dark:bg-purple-900/30",
    darkText: "dark:text-purple-300",
  },
  {
    bg: "bg-green-100/70",
    text: "text-green-700",
    darkBg: "dark:bg-green-900/30",
    darkText: "dark:text-green-300",
  },
  {
    bg: "bg-pink-100/70",
    text: "text-pink-700",
    darkBg: "dark:bg-pink-900/30",
    darkText: "dark:text-pink-300",
  },
  {
    bg: "bg-yellow-100/70",
    text: "text-yellow-700",
    darkBg: "dark:bg-yellow-900/30",
    darkText: "dark:text-yellow-300",
  },
  {
    bg: "bg-red-100/70",
    text: "text-red-700",
    darkBg: "dark:bg-red-900/30",
    darkText: "dark:text-red-300",
  },
  {
    bg: "bg-indigo-100/70",
    text: "text-indigo-700",
    darkBg: "dark:bg-indigo-900/30",
    darkText: "dark:text-indigo-300",
  },
  {
    bg: "bg-orange-100/70",
    text: "text-orange-700",
    darkBg: "dark:bg-orange-900/30",
    darkText: "dark:text-orange-300",
  },
  {
    bg: "bg-teal-100/70",
    text: "text-teal-700",
    darkBg: "dark:bg-teal-900/30",
    darkText: "dark:text-teal-300",
  },
  {
    bg: "bg-cyan-100/70",
    text: "text-cyan-700",
    darkBg: "dark:bg-cyan-900/30",
    darkText: "dark:text-cyan-300",
  },
];

// 使用字符串作为key来缓存颜色，确保同样的字符串总是得到同样的颜色
const colorCache = new Map<string, string>();

export const getRandomTagColor = (text: string): string => {
  // 如果已经有缓存的颜色，直接返回
  if (colorCache.has(text)) {
    return colorCache.get(text)!;
  }

  // 使用字符串的字符之和作为种子来选择颜色
  const seed = text
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palette = colorPalettes[seed % colorPalettes.length];

  // 组合颜色类
  const colorClass = `${palette.bg} ${palette.text} ${palette.darkBg} ${palette.darkText}`;

  // 缓存结果
  colorCache.set(text, colorClass);

  return colorClass;
};
