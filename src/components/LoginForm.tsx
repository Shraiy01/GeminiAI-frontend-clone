import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Bot, Sparkles, ChevronDown, Search } from 'lucide-react';
import { User as UserType, Country } from '../types';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
}

// Validation schemas
const phoneSchema = z.object({
  countryCode: z.string().min(1, 'Please select a country'),
  phoneNumber: z.string()
    .min(6, 'Phone number must be at least 6 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});

const otpSchema = z.object({
  otp: z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

const userDetailsSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OtpFormData = z.infer<typeof otpSchema>;
type UserDetailsFormData = z.infer<typeof userDetailsSchema>;

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'details'>('phone');
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [phoneData, setPhoneData] = useState<PhoneFormData | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form hooks
  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: '',
      phoneNumber: '',
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const userDetailsForm = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,flag,cca2');
        const data: Country[] = await response.json();
        
        // Filter countries with valid IDD codes and sort alphabetically
        const validCountries = data
          .filter(country => country.idd?.root && country.idd?.suffixes?.length > 0)
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        setCountries(validCountries);
        setFilteredCountries(validCountries);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        // Fallback to some common countries
        const fallbackCountries: Country[] = [
          {
            name: { common: 'United States' },
            idd: { root: '+1', suffixes: [''] },
            flag: '🇺🇸',
            cca2: 'US'
          },
          {
            name: { common: 'India' },
            idd: { root: '+91', suffixes: [''] },
            flag: '🇮🇳',
            cca2: 'IN'
          },
          {
            name: { common: 'United Kingdom' },
            idd: { root: '+44', suffixes: [''] },
            flag: '🇬🇧',
            cca2: 'GB'
          }
        ];
        setCountries(fallbackCountries);
        setFilteredCountries(fallbackCountries);
      }
    };

    fetchCountries();
  }, []);

  // Handle country search
  useEffect(() => {
    if (countrySearch) {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase().includes(countrySearch.toLowerCase()) ||
        getCountryCode(country).includes(countrySearch)
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [countrySearch, countries]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCountryCode = (country: Country) => {
    return country.idd.root + (country.idd.suffixes[0] || '');
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setCountrySearch('');
    phoneForm.setValue('countryCode', getCountryCode(country));
    phoneForm.clearErrors('countryCode');
  };

  const handlePhoneSubmit = (data: PhoneFormData) => {
    setIsLoading(true);
    setPhoneData(data);
    
    // Simulate API call to check if user exists and send OTP
    setTimeout(() => {
      setIsLoading(false);
      // Simulate 50% chance of new user
      setIsNewUser(Math.random() > 0.5);
      setStep('otp');
    }, 1500);
  };

  const handleOtpSubmit = (data: OtpFormData) => {
    if (data.otp !== '123456') {
      otpForm.setError('otp', { message: 'Invalid OTP. Use 123456 for demo' });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (isNewUser) {
        setStep('details');
      } else {
        // Existing user - login directly
        onLogin({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phoneNumber: phoneData!.phoneNumber,
          countryCode: phoneData!.countryCode,
          avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`
        });
      }
    }, 1000);
  };

  const handleUserDetailsSubmit = (data: UserDetailsFormData) => {
    setIsLoading(true);

    setTimeout(() => {
      onLogin({
        id: '1',
        name: data.name,
        email: data.email,
        phoneNumber: phoneData!.phoneNumber,
        countryCode: phoneData!.countryCode,
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`
      });
    }, 1000);
  };

  const handleBackToPhone = () => {
    setStep('phone');
    otpForm.reset();
    userDetailsForm.reset();
  };

  const handleBackToOtp = () => {
    setStep('otp');
    userDetailsForm.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gemini Chat</h1>
          <p className="text-gray-600">Your AI conversation companion</p>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
          {step === 'phone' && (
            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country & Phone Number
                </label>
                
                {/* Country Selector */}
                <div className="relative mb-3" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full flex items-center justify-between px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <div className="flex items-center space-x-2">
                      {selectedCountry ? (
                        <>
                          <span className="text-lg">{selectedCountry.flag}</span>
                          <span className="text-sm text-gray-600">
                            {selectedCountry.name.common} ({getCountryCode(selectedCountry)})
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">Select country</span>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showCountryDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-hidden">
                      <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Search countries..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredCountries.map((country) => (
                          <button
                            key={country.cca2}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <span className="text-lg">{country.flag}</span>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium text-gray-900">
                                {country.name.common}
                              </div>
                              <div className="text-xs text-gray-500">
                                {getCountryCode(country)}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {phoneForm.formState.errors.countryCode && (
                  <p className="text-red-600 text-sm mt-1">
                    {phoneForm.formState.errors.countryCode.message}
                  </p>
                )}

                {/* Phone Number Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    {...phoneForm.register('phoneNumber')}
                    placeholder="Enter your phone number"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                {phoneForm.formState.errors.phoneNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {phoneForm.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter OTP</h2>
                <p className="text-gray-600 text-sm">
                  We've sent a 6-digit code to {selectedCountry?.flag} {phoneData?.countryCode} {phoneData?.phoneNumber}
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  Use 123456 for demo
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  {...otpForm.register('otp')}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 text-center text-lg font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  maxLength={6}
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-red-600 text-sm text-center">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Verify OTP</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToPhone}
                  className="w-full text-gray-600 py-2 px-4 rounded-xl font-medium hover:text-gray-800 focus:outline-none transition-colors duration-200"
                >
                  Change phone number
                </button>
              </div>
            </form>
          )}

          {step === 'details' && (
            <form onSubmit={userDetailsForm.handleSubmit(handleUserDetailsSubmit)} className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Profile</h2>
                <p className="text-gray-600 text-sm">
                  Please provide your details to complete registration
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...userDetailsForm.register('name')}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {userDetailsForm.formState.errors.name && (
                    <p className="text-red-600 text-sm mt-1">
                      {userDetailsForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...userDetailsForm.register('email')}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {userDetailsForm.formState.errors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {userDetailsForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToOtp}
                  className="w-full text-gray-600 py-2 px-4 rounded-xl font-medium hover:text-gray-800 focus:outline-none transition-colors duration-200"
                >
                  Back to OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;