import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Form } from "../components/Form";
import { login } from "../utils/auth";
import { useAuthStore } from "../utils/store";
import { Layout } from "../components/Layout";
import { TransitionEffect } from "../components/Animations";
import { AunomaDots } from "../components/AunomaDots";
import { isValidEmail, validatePassword, handleNetworkError } from "../utils/errorHandling";
import { toast } from "../components/AccessibleToast";

interface LoginFormData {
  email: string;
  password: string;
}

interface LocationState {
  from?: {
    pathname: string;
  };
  sessionExpired?: boolean;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setSession } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";
  const locationState = location.state as LocationState | null;

  useEffect(() => {
    if (locationState?.sessionExpired) {
      setSessionExpired(true);
    }
  }, [locationState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(null);
    if (sessionExpired) setSessionExpired(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!isValidEmail(formData.email)) {
      setError("Podaj prawidłowy adres email");
      setIsLoading(false);
      toast.error("Podaj prawidłowy adres email", {
        duration: 3000,
        id: "email-validation-error"
      });
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message || "Nieprawidłowe hasło");
      setIsLoading(false);
      toast.error(passwordValidation.message || "Nieprawidłowe hasło", {
        duration: 3000,
        id: "password-validation-error"
      });
      return;
    }

    try {
      const { error, user, session } = await login(formData.email, formData.password);

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (user && session) {
        setUser(user);
        setSession(session);
        localStorage.setItem("aunoma-last-activity", Date.now().toString());

        const navigateTo = from && from !== "/" ? from : "/dashboard";

        // ✅ FIX: Ensure state is updated before redirect
        requestAnimationFrame(() => {
          navigate(navigateTo, { replace: true });
        });
      } else {
        setError("Nieznany błąd logowania");
        setIsLoading(false);
      }
    } catch (err) {
      const errorMessage = handleNetworkError(err, "Błąd logowania. Spróbuj ponownie.");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <TransitionEffect type="fade" duration={400}>
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <AunomaDots className="w-10 h-10" />
              </div>
              <span className="text-2xl text-aunoma-gray-dark tracking-tight font-semibold ml-2">Aunoma</span>
              <span className="text-aunoma-red font-medium text-xl">.ai</span>
            </div>
            <h1 className="text-center text-xl font-semibold text-aunoma-gray-dark mt-3">
              Zaloguj się do swojego konta
            </h1>
          </div>
        </TransitionEffect>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <TransitionEffect type="slide-up" delay={100} duration={400}>
            <div className="bg-white py-8 px-4 sm:px-8 shadow-md sm:rounded-lg border border-gray-50 hover:shadow-lg transition-shadow duration-300">
              <Form
                onSubmit={handleSubmit}
                error={error || undefined}
                success={sessionExpired ? "Twoja sesja wygasła. Zaloguj się ponownie, aby kontynuować." : undefined}
                aria-labelledby="login-heading"
              >
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  label="Adres email"
                  aria-required="true"
                />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  label="Hasło"
                  aria-required="true"
                />

                <div>
                  <Button
                    type="submit"
                    className="w-full py-3 bg-aunoma-red hover:bg-aunoma-red-dark text-white font-medium"
                    disabled={isLoading}
                    aria-busy={isLoading ? "true" : "false"}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                          aria-hidden="true"
                        ></span>
                        Logowanie...
                      </span>
                    ) : (
                      "Zaloguj się"
                    )}
                  </Button>
                </div>

                <div className="text-sm text-center text-aunoma-gray mt-4">
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-aunoma-gray flex justify-between items-center">
                      <span>Wersja: 1.0.0-QA</span>
                      <a
                        href="/testing-page"
                        className="text-aunoma-red hover:underline focus:outline-none focus:ring-2 focus:ring-aunoma-red/70 focus:ring-offset-1 rounded-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/testing-page');
                        }}
                      >
                        Panel testowy
                      </a>
                    </p>
                  </div>
                </div>
              </Form>
            </div>
          </TransitionEffect>
        </div>
      </div>
    </Layout>
  );
}