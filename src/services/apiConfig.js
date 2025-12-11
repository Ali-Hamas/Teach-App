// API Configuration
// Set this to true to use mock API (local storage), false to use Supabase
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

if (USE_MOCK_API) {
  console.log('Using mock API for development');
} else {
  console.log('Using Supabase API');
}