import type { ComponentProps } from "react";

const buttonBase =
  "group inline-flex min-h-12 items-center justify-center gap-6 rounded-[2px] px-6 py-3.5 text-[12px] font-medium tracking-[0.02em] transition-colors duration-200";

const appBase =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-[13px] font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55";

export const buttonStyles = {
  primary: `${buttonBase} bg-navy text-white hover:bg-navy-3`,
  gold: `${buttonBase} bg-gold text-navy hover:bg-[#c29f2c]`,
  light: `${buttonBase} bg-white text-navy hover:bg-mist`,
  outlineLight: `${buttonBase} border border-white/40 text-white hover:border-white hover:bg-white/5`,
  outlineDark: `${buttonBase} border border-navy/25 text-navy hover:border-navy`,
  appPrimary: `${appBase} bg-navy text-white shadow-sm hover:bg-navy-3`,
  appSecondary: `${appBase} border border-line bg-white text-navy shadow-sm hover:border-navy/30 hover:bg-mist`,
  appGold: `${appBase} bg-gold text-navy shadow-sm hover:bg-[#c29f2c]`,
  appDanger: `${appBase} border border-line bg-white text-[#b4372c] hover:border-[#b4372c]/40 hover:bg-[#b4372c]/5`,
  appGhost: `${appBase} text-slate hover:bg-mist hover:text-navy`,
};

export type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof buttonStyles;
};

export function Button({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`${buttonStyles[variant]} ${className}`}
    />
  );
}
