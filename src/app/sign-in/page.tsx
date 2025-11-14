"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitHub, Google } from "@/icons";
import { Eye, EyeOff } from "lucide-react";
import {
  useState,
  useCallback,
  memo,
  type ChangeEvent,
  type FormEvent,
} from "react";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

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

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
        <div className="p-8 pb-6">
          <div>
            <h1 className="mb-1 text-xl font-semibold">Sign In to Linea</h1>
            <p className="text-sm">Welcome back! Sign in to continue</p>
          </div>

          <div className="space-y-6 mt-5">
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

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <Button asChild variant="link" size="sm">
                  <a href="#" className="text-sm">
                    Forgot your Password?
                  </a>
                </Button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

              <hr className="my-4 border-dashed" />

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  aria-label="Sign in with Google"
                >
                  <Google />
                  <span>Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  aria-label="Sign in with Microsoft"
                >
                  <GitHub />
                  <span>GitHub</span>
                </Button>
              </div>
            </div>

            <Button onClick={handleSubmit} className="w-full" type="submit">
              Sign In
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Don't have an account?
            <Button asChild variant="link" className="px-2">
              <a href="/sign-up">Create account</a>
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
