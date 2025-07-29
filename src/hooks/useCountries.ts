import { useState, useEffect } from 'react';
import { Country } from '../types';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,flag,cca2');
        if (!response.ok) throw new Error('Failed to fetch countries');
        
        const data: Country[] = await response.json();
        const sortedCountries = data
          .filter(country => country.idd?.root && country.idd?.suffixes?.length > 0)
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        setCountries(sortedCountries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch countries');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
}