export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

const SYMBOL = /[!@#$%^&*()_+\-=[\]{};'\\:"|<>?,./`~]/;

export type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
  {
    id: "length",
    label: `${PASSWORD_MIN_LENGTH} to ${PASSWORD_MAX_LENGTH} characters`,
    test: (p) =>
      p.length >= PASSWORD_MIN_LENGTH && p.length <= PASSWORD_MAX_LENGTH,
  },
  {
    id: "upper",
    label: "An uppercase letter (A–Z)",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "A lowercase letter (a–z)",
    test: (p) => /[a-z]/.test(p),
  },
  { id: "number", label: "A number (0–9)", test: (p) => /\d/.test(p) },
  {
    id: "symbol",
    label: "A symbol (e.g. ! @ # $)",
    test: (p) => SYMBOL.test(p),
  },
  {
    id: "spaces",
    label: "No spaces",
    test: (p) => p.length > 0 && !/\s/.test(p),
  },
];

export function unmetPasswordRules(password: string) {
  return passwordRules
    .filter((rule) => !rule.test(password))
    .map((rule) => rule.label);
}

export type PasswordStrength = "weak" | "fair" | "strong";

export function passwordStrength(password: string): PasswordStrength {
  if (unmetPasswordRules(password).length > 0) return "weak";
  return password.length >= 12 ? "strong" : "fair";
}
