"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitHub, Google } from "@/icons";
import { Eye, EyeOff, Check, X } from "lucide-react";
import {
  useState,
  useCallback,
  useMemo,
  memo,
  type ChangeEvent,
  type FormEvent,
} from "react";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface PasswordCheckItem {
  label: string;
  check: (pwd: string) => boolean;
}

const PASSWORD_CHECK_ITEMS: readonly PasswordCheckItem[] = [
  { label: "At least 8 characters", check: (pwd) => pwd.length >= 8 },
  { label: "Contains uppercase letter", check: (pwd) => /[A-Z]/.test(pwd) },
  { label: "Contains number", check: (pwd) => /[0-9]/.test(pwd) },
  {
    label: "Contains special character",
    check: (pwd) => /[!@#$%^&*]/.test(pwd),
  },
] as const;

const PasswordCheckItem = memo<{
  checkItem: PasswordCheckItem;
  password: string;
}>(({ checkItem, password }) => {
  const isValid = checkItem.check(password);

  return (
    <div className="flex items-center gap-2 text-xs">
      {isValid ? (
        <Check
          className="w-3.5 h-3.5 text-green-600 dark:text-green-400"
          aria-hidden="true"
        />
      ) : (
        <X className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
      )}
      <span
        className={
          isValid
            ? "text-green-700 dark:text-green-400 font-medium"
            : "text-muted-foreground"
        }
      >
        {checkItem.label}
      </span>
    </div>
  );
});
PasswordCheckItem.displayName = "PasswordRequirementItem";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      console.log("Form submitted:", formData);
    },
    [formData]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const showPasswordStrength = useMemo(
    () => passwordFocus || formData.password.length > 0,
    [passwordFocus, formData.password.length]
  );

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
        <div className="p-8 pb-6">
          <div>
            <h1 className="mb-1 text-xl font-semibold">
              Create a Linea Account
            </h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <div className="space-y-5 mt-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="block text-sm">
                  Firstname
                </Label>
                <Input
                  type="text"
                  required
                  name="firstname"
                  id="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="John"
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname" className="block text-sm">
                  Lastname
                </Label>
                <Input
                  type="text"
                  required
                  name="lastname"
                  id="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  className="pr-10"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {showPasswordStrength && (
                <div
                  className="mt-3 p-3 rounded-md bg-muted border space-y-2"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-xs font-medium mb-2">
                    Password requirements:
                  </p>
                  {PASSWORD_CHECK_ITEMS.map((item, idx) => (
                    <PasswordCheckItem
                      key={idx}
                      checkItem={item}
                      password={formData.password}
                    />
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleSubmit} className="w-full" type="submit">
              Continue
            </Button>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              aria-label="Sign up with Google"
            >
              <Google />
              <span>Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-label="Sign up with GitHub"
            >
              <GitHub />
              <span>GitHub</span>
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Have an account?
            <Button asChild variant="link" className="px-2">
              <a href="/sign-in">Sign In</a>
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
