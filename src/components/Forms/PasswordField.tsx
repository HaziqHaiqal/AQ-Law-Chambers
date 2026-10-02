"use client";

import { useState } from "react";
import { FieldError } from "@/components/Forms/FieldError";
import { FieldLabel } from "@/components/Forms/FieldLabel";
import { Check, Eye, EyeOff, Lock } from "@/components/Icons";
import {
  PASSWORD_MIN_LENGTH,
  passwordRules,
  passwordStrength,
  type PasswordStrength,
} from "@/lib/validation/password";

const strengthStyle: Record<
  PasswordStrength,
  { label: string; bars: number; colour: string; text: string }
> = {
  weak: {
    label: "Weak",
    bars: 1,
    colour: "bg-[#b4372c]",
    text: "text-[#b4372c]",
  },
  fair: { label: "Fair", bars: 2, colour: "bg-gold", text: "text-gold-ink" },
  strong: { label: "Strong", bars: 3, colour: "bg-navy", text: "text-navy" },
};

export function PasswordField({
  label,
  name,
  autoComplete,
  error,
  showRules = false,
}: {
  label: string;
  name: string;
  autoComplete: "current-password" | "new-password";
  error?: string;
  showRules?: boolean;
}) {
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const rulesId = `${name}-rules`;
  const errorId = `${name}-error`;
  const strength = strengthStyle[passwordStrength(value)];
  const Toggle = visible ? EyeOff : Eye;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={name}>
        <FieldLabel required>{label}</FieldLabel>
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-slate-light" />
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          maxLength={200}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [showRules && rulesId, error && errorId]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className="field-input pr-12 pl-11"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-lg text-slate transition-colors hover:text-navy"
        >
          <Toggle className="size-[18px]" />
        </button>
      </div>
      <FieldError id={errorId}>{error}</FieldError>

      {showRules && (
        <div id={rulesId} aria-live="polite">
          {value ? (
            <div className="mt-1 grid gap-2.5 rounded-lg bg-mist px-3.5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-1 gap-1.5" aria-hidden="true">
                  {[1, 2, 3].map((bar) => (
                    <span
                      key={bar}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${bar <= strength.bars ? strength.colour : "bg-line"}`}
                    />
                  ))}
                </div>
                <span className={`text-xs font-medium ${strength.text}`}>
                  {strength.label}
                </span>
              </div>
              <ul
                className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2"
                aria-label="Your password needs"
              >
                {passwordRules.map((rule) => {
                  const met = rule.test(value);
                  return (
                    <li
                      key={rule.id}
                      className={`flex items-center gap-2 text-xs transition-colors ${met ? "text-navy" : "text-slate"}`}
                    >
                      <span
                        className={`grid size-4 shrink-0 place-items-center rounded-full transition-colors ${
                          met
                            ? "bg-gold text-navy"
                            : "bg-white text-transparent ring-1 ring-line"
                        }`}
                      >
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                      {rule.label}
                      <span className="sr-only">
                        {met ? "(done)" : "(not yet)"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="text-xs leading-relaxed text-slate">
              At least {PASSWORD_MIN_LENGTH} characters, with upper and lower
              case letters, a number and a symbol.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
