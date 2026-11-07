"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

type Mode = "login" | "signup";
type Errors = Partial<
  Record<"name" | "email" | "password" | "confirm", string>
>;

const copy = {
  login: {
    title: "Welcome back",
    subtitle: "Log in to continue planning your day.",
    button: "Log in",
    switchText: "Don't have an account?",
    switchLink: "Sign up",
    switchHref: "/signup",
  },
  signup: {
    title: "Create your account",
    subtitle: "Start organizing your time for free.",
    button: "Create account",
    switchText: "Already have an account?",
    switchLink: "Log in",
    switchHref: "/login",
  },
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
    hasError ? "border-red-400" : "border-border"
  }`;
}

export default function AuthForm({
  mode,
  active,
}: {
  mode: Mode;
  active: boolean;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const text = copy[mode];
  const isSignup = mode === "signup";

  const id = (field: string) => `${mode}-${field}`;
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    const newErrors: Errors = {};

    if (isSignup && name.length < 2) {
      newErrors.name = "Please enter your name.";
    }
    if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (isSignup) {
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters.";
      }
      if (confirm !== password) {
        newErrors.confirm = "Passwords do not match.";
      }
    } else if (password.length === 0) {
      newErrors.password = "Please enter your password.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    //Backend
    console.log({ mode, name, email });
  }

  return (
    <div
      inert={!active}
      className={`min-h-screen flex-col px-6 py-8 sm:px-12 ${
        active ? "flex" : "hidden lg:flex"
      }`}
    >
      <Link
        href="/"
        className="flex w-fit items-center gap-2 text-xl font-extrabold tracking-tight"
      >
        <span className="h-3 w-3 rounded-full bg-primary" />
        <span>
          Day<span className="text-primary">Flow</span>
        </span>
      </Link>

      <div className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {text.title}
          </h1>
          <p className="mt-2 text-muted">{text.subtitle}</p>
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {isSignup && (
              <div>
                <label
                  htmlFor={id("name")}
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Name
                </label>
                <input
                  id={id("name")}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? id("name-error") : undefined}
                  className={inputClass(!!errors.name)}
                />
                {errors.name && (
                  <p
                    id={id("name-error")}
                    className="mt-1.5 text-sm text-red-500"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor={id("email")}
                className="mb-1.5 block text-sm font-semibold"
              >
                Email
              </label>
              <input
                id={id("email")}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? id("email-error") : undefined}
                className={inputClass(!!errors.email)}
              />
              {errors.email && (
                <p
                  id={id("email-error")}
                  className="mt-1.5 text-sm text-red-500"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={id("password")}
                className="mb-1.5 block text-sm font-semibold"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id={id("password")}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder={
                    isSignup ? "At least 8 characters" : "Your password"
                  }
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? id("password-error") : undefined
                  }
                  className={`${inputClass(!!errors.password)} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p
                  id={id("password-error")}
                  className="mt-1.5 text-sm text-red-500"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {isSignup && (
              <div>
                <label
                  htmlFor={id("confirm")}
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Confirm password
                </label>
                <input
                  id={id("confirm")}
                  name="confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  aria-invalid={!!errors.confirm}
                  aria-describedby={
                    errors.confirm ? id("confirm-error") : undefined
                  }
                  className={inputClass(!!errors.confirm)}
                />
                {errors.confirm && (
                  <p
                    id={id("confirm-error")}
                    className="mt-1.5 text-sm text-red-500"
                  >
                    {errors.confirm}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              {text.button}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {text.switchText}{" "}
            <Link
              href={text.switchHref}
              className="font-semibold text-primary hover:underline"
            >
              {text.switchLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
