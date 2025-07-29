import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '../UI/Button';
import { OTP_LENGTH } from '../../utils/constants';

const otpSchema = z.object({
  otp: z.string().length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`),
});

type OTPForm = z.infer<typeof otpSchema>;

interface OTPVerificationProps {
  phone: string;
  countryCode: string;
  onSubmit: (phone: string, countryCode: string, otp: string) => Promise<void>;
  onBack: () => void;
  onResend: (phone: string, countryCode: string) => Promise<void>;
  isLoading: boolean;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  phone,
  countryCode,
  onSubmit,
  onBack,
  onResend,
  isLoading
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setValue('otp', otp.join(''));
  }, [otp, setValue]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, OTP_LENGTH);
    const newOtp = pastedData.split('').concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH);
    setOtp(newOtp);
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleFormSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length === OTP_LENGTH) {
      await onSubmit(phone, countryCode, otpString);
    }
  };

  const handleResend = async () => {
    setTimeLeft(300);
    setCanResend(false);
    await onResend(phone, countryCode);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Verify OTP
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the {OTP_LENGTH}-digit code sent to
          </p>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {countryCode} {phone}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <div className="flex justify-center space-x-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-medium border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-center text-sm text-red-600 dark:text-red-400">
                {errors.otp.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading || otp.join('').length !== OTP_LENGTH}
          >
            Verify OTP
          </Button>
        </form>

        <div className="mt-6 text-center">
          {!canResend ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Resend OTP in {formatTime(timeLeft)}
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="flex items-center justify-center w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend OTP
            </button>
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
            For demo purposes, use any 6-digit code (e.g., 123456)
          </p>
        </div>
      </div>
    </div>
  );
};