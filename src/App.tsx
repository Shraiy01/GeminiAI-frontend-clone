import React, { useEffect } from "react";
import { Header } from "./components/Layout/Header";
import { Login } from "./components/Auth/Login";
import { OTPVerification } from "./components/Auth/OTPVerification";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";
import { sendOTP, verifyOTP, logout, resetOTP } from "./store/slices/authSlice";
import { toggleTheme } from "./store/slices/themeSlice";
import { useToast } from "./components/UI/Toast";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const dispatch = useAppDispatch();
  const { user, isLoading, isOtpSent } = useAppSelector((state) => state.auth);
  const { isDark } = useAppSelector((state) => state.theme);
  const { showSuccess, showError, showInfo, ToastContainer } = useToast();
  const [loginData, setLoginData] = React.useState<{
    phone: string;
    countryCode: string;
  } | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleSendOTP = async (phone: string, countryCode: string) => {
    try {
      setLoginData({ phone, countryCode });
      await dispatch(sendOTP({ phone, countryCode })).unwrap();
      showSuccess("OTP sent successfully!");
    } catch (error) {
      showError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async (
    phone: string,
    countryCode: string,
    otp: string
  ) => {
    try {
      await dispatch(verifyOTP({ phone, countryCode, otp })).unwrap();
      showSuccess("Login successful!");
      setLoginData(null);
    } catch (error) {
      showError("Invalid OTP. Please try again.");
    }
  };

  const handleResendOTP = async (phone: string, countryCode: string) => {
    try {
      await dispatch(sendOTP({ phone, countryCode })).unwrap();
      showInfo("OTP resent successfully!");
    } catch (error) {
      showError("Failed to resend OTP. Please try again.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setLoginData(null);
    showInfo("Logged out successfully");
  };

  const handleBackToLogin = () => {
    dispatch(resetOTP());
    setLoginData(null);
  };

  if (user?.isAuthenticated) {
    return (
      <ThemeProvider>
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Header
            isDark={isDark}
            onToggleTheme={() => dispatch(toggleTheme())}
            onLogout={handleLogout}
            user={user}
          />
          <div className="flex-1 overflow-hidden">
            <Dashboard />
          </div>
          <ToastContainer />
        </div>
      </ThemeProvider>
    );
  }

  if (isOtpSent && loginData) {
    return (
      <>
        <OTPVerification
          phone={loginData.phone}
          countryCode={loginData.countryCode}
          onSubmit={handleVerifyOTP}
          onBack={handleBackToLogin}
          onResend={handleResendOTP}
          isLoading={isLoading}
        />
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <Login onSubmit={handleSendOTP} isLoading={isLoading} />
      <ToastContainer />
    </>
  );
}

export default App;
