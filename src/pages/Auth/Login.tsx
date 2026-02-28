import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Mail01Icon, 
  LockPasswordIcon, 
  ViewIcon, 
  ViewOffIcon,
  AlertCircleIcon
} from '@hugeicons/core-free-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-primary p-3 rounded-2xl mb-4 shadow-lg shadow-primary/20">
            <img src="/logo.svg" alt="Archiver Logo" className="w-10 h-10 brightness-0 invert" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Archiver</h1>
          <p className="text-gray-400 mt-2 font-medium">Secure Document Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-large border border-gray-100 shadow-xl shadow-gray-200/50">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sign in to your account</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-base flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <HugeiconsIcon icon={AlertCircleIcon} size={20} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-600 font-medium leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <HugeiconsIcon icon={Mail01Icon} size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-base py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <a href="#" className="text-xs font-bold text-primary hover:text-primary-hover transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <HugeiconsIcon icon={LockPasswordIcon} size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-base py-3 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
              <label htmlFor="remember" className="text-xs font-medium text-gray-500 cursor-pointer select-none">Keep me signed in for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-base hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Sign In to System'
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400 font-medium">
          Confidential access restricted to authorized personnel only. 
          <br />By signing in, you agree to our <a href="#" className="underline decoration-gray-300 hover:text-gray-600">Archival Policies</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
