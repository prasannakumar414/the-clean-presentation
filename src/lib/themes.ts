import type { ProjectTheme } from "@/lib/types";

export type ThemeConfig = {
  id: ProjectTheme;
  label: string;
  appClassName: string;
  slideClassName: string;
  accentClassName: string;
};

export const THEME_OPTIONS: ThemeConfig[] = [
  {
    id: "light",
    label: "Light",
    appClassName: "bg-white text-slate-900",
    slideClassName: "bg-white text-slate-900",
    accentClassName: "text-blue-600",
  },
  {
    id: "dark",
    label: "Dark",
    appClassName: "bg-slate-950 text-slate-100",
    slideClassName: "bg-slate-900 text-slate-100",
    accentClassName: "text-indigo-300",
  },
  {
    id: "ocean",
    label: "Ocean Blue",
    appClassName: "bg-gradient-to-br from-cyan-50 to-blue-100 text-slate-900",
    slideClassName: "bg-gradient-to-br from-cyan-100 to-blue-200 text-slate-900",
    accentClassName: "text-blue-700",
  },
  {
    id: "sunset",
    label: "Warm Gradient",
    appClassName: "bg-gradient-to-br from-orange-50 to-rose-100 text-slate-900",
    slideClassName: "bg-gradient-to-br from-orange-100 to-rose-200 text-slate-900",
    accentClassName: "text-rose-700",
  },
  {
    id: "minimal",
    label: "Minimal",
    appClassName: "bg-stone-100 text-stone-900",
    slideClassName: "bg-stone-50 text-stone-900",
    accentClassName: "text-stone-700",
  },
];

export function getThemeConfig(theme: ProjectTheme | undefined): ThemeConfig {
  return THEME_OPTIONS.find((option) => option.id === theme) ?? THEME_OPTIONS[0];
}
