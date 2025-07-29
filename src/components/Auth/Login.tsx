import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone } from "lucide-react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { useCountries } from "../../hooks/useCountries";
import { LoadingSkeleton } from "../UI/LoadingSkeleton";

const loginSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginProps {
  onSubmit: (phone: string, countryCode: string) => Promise<void>;
  isLoading: boolean;
}

export const Login: React.FC<LoginProps> = ({ onSubmit, isLoading }) => {
  const { countries, loading: countriesLoading } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const selectedCountryData = countries.find(
    (c) => `${c.idd.root}${c.idd.suffixes[0]}` === selectedCountry
  );

  const handleFormSubmit = async (data: LoginForm) => {
    await onSubmit(data.phone, data.countryCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to Gemini Chat
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your phone number to get started
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country
            </label>
            {countriesLoading ? (
              <LoadingSkeleton height={40} />
            ) : (
              <select
                {...register("countryCode")}
                onChange={(e) => {
                  setValue("countryCode", e.target.value);
                  setSelectedCountry(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select country</option>
                {countries.map((country) => {
                  const dialCode = `${country.idd.root}${country.idd.suffixes[0]}`;
                  return (
                    <option key={country.cca2} value={dialCode}>
                      {country.flag} {country.name.common} ({dialCode})
                    </option>
                  );
                })}
              </select>
            )}
            {errors.countryCode && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.countryCode.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="flex">
              {selectedCountryData && (
                <div className="min-w-[80px] flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-600 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg">
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedCountryData.flag} {selectedCountry}
                  </span>
                </div>
              )}
              <Input
                {...register("phone")}
                type="tel"
                placeholder="Enter phone number"
                error={errors.phone?.message}
                className={selectedCountryData ? "rounded-l-none" : ""}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Send OTP
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};
