import React, { useState, useEffect } from 'react';
import { signInWithGoogle, signInWithEmailAndPassword, signUpWithEmailAndPassword, sendPasswordResetEmail } from '../../services/authService';

import Button from '../Button';
import BirdIcon from '../icons/BirdIcon';
import GoogleIcon from '../icons/GoogleIcon';
import GithubIcon from '../icons/GithubIcon';
import MailIcon from '../icons/MailIcon';
import LockClosedIcon from '../icons/LockClosedIcon';
import UserIcon from '../icons/UserIcon';
import EyeIcon from '../icons/EyeIcon';
import EyeOffIcon from '../icons/EyeOffIcon';


const InputWithIcon: React.FC<{
    icon: React.ReactNode;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    autoComplete?: string;
    required?: boolean;
}> = ({ icon, type, name, value, onChange, placeholder, autoComplete, required }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (isPasswordVisible ? 'text' : 'password') : type;

    return (
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                {icon}
            </span>
                            <input
                                type={inputType}
                                name={name}
                                value={value}
                                onChange={onChange}
                                placeholder={placeholder}
                                autoComplete={autoComplete}
                                required={required}
                                className="w-full pl-12 pr-4 p-4 glass-effect border border-slate-300/30 rounded-lg text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent focus:shadow-[0_0_0_4px_rgba(139,92,246,0.2)] transition duration-300"
                            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-300"
                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                >
                    {isPasswordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            )}
        </div>
    );
};

const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
    const getStrength = () => {
        let score = 0;
        if (password.length > 7) score++;
        if (password.length > 11) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };
    const strength = getStrength();
    const levels = [
        { width: '0%', color: '', text: '' },
        { width: '20%', color: 'bg-red-500', text: 'Very Weak' },
        { width: '40%', color: 'bg-orange-500', text: 'Weak' },
        { width: '60%', color: 'bg-yellow-500', text: 'Fair' },
        { width: '80%', color: 'bg-lime-500', text: 'Good' },
        { width: '100%', color: 'bg-green-500', text: 'Strong' },
    ];
    const currentLevel = levels[strength];

    return (
        <div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${currentLevel.color}`} style={{ width: currentLevel.width }}></div>
            </div>
            <p className="text-xs text-right mt-1 text-gray-500 font-mono">{currentLevel.text}</p>
        </div>
    );
};


const Login: React.FC = () => {
    const [view, setView] = useState<'login' | 'signup' | 'forgotPassword'>('login');
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', agreedToTerms: false });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<null | 'google' | 'github'>(null);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (error) {
            setShake(true);
            const timer = setTimeout(() => setShake(false), 500); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setError('');
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSocialSignIn = async (provider: 'google' | 'github') => {
        setSocialLoading(provider);
        setError('');
        try {
            if (provider === 'google') {
                await signInWithGoogle();
            } else {
                alert("GitHub sign-in is not yet implemented.");
                setSocialLoading(null);
            }
        } catch (err) {
            console.error("Sign in failed:", err);
            setError("Failed to sign in. Please try again.");
            setSocialLoading(null);
        }
    };
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(form.email, form.password);
        } catch (err: any) {
            setError(err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (!form.agreedToTerms) {
            setError("You must agree to the terms and conditions.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            await signUpWithEmailAndPassword(form.name, form.email, form.password);
        } catch (err: any) {
             setError(err.code === 'auth/email-already-in-use' ? 'This email is already registered.' : 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await sendPasswordResetEmail(form.email);
            setMessage('Password reset email sent! Check your inbox.');
        } catch (err: any) {
            setError(err.code === 'auth/user-not-found' ? 'No account found with this email.' : 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const submitButtonText = {
        login: 'Sign In',
        signup: 'Create Account',
        forgotPassword: 'Send Reset Link'
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-theme-dark">
            {/* Background blur overlay */}
            <div className="bg-blur-overlay"></div>
            
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-bounce-slow"></div>
                <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-full blur-xl animate-float"></div>
                <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-purple-400/40 transform rotate-45 animate-float-delayed"></div>
                <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-cyan-400/50 rounded-full animate-float-reverse"></div>
            </div>
            <div className={`w-[400px] min-h-[500px] glass-effect-with-bg rounded-2xl shadow-2xl p-8 flex flex-col ${shake ? 'shake-anim' : ''} relative z-20`}>
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <BirdIcon className="h-12 w-12 text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-100">
                        {view === 'login' && 'Welcome Back'}
                        {view === 'signup' && 'Create Your Account'}
                        {view === 'forgotPassword' && 'Reset Password'}
                    </h1>
                    <p className="text-slate-300 mt-2">
                        {view === 'login' && 'Sign in to continue your journey.'}
                        {view === 'signup' && 'Start your journey with Mavericks.'}
                        {view === 'forgotPassword' && 'We\'ll send you a link to reset it.'}
                    </p>
                </div>
                
                <div className="flex-grow">
                    {/* View: Login */}
                    {view === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <InputWithIcon icon={<MailIcon className="h-5 w-5" />} type="email" name="email" value={form.email} onChange={handleInputChange} placeholder="Email" autoComplete="email" required />
                            <InputWithIcon icon={<LockClosedIcon className="h-5 w-5" />} type="password" name="password" value={form.password} onChange={handleInputChange} placeholder="Password" autoComplete="current-password" required />
                            <div className="text-right text-sm">
                                <button type="button" onClick={() => setView('forgotPassword')} className="font-medium text-slate-300 hover:underline">Forgot password?</button>
                            </div>
                            {error && <p className="text-red-500 text-sm text-center error-message">{error}</p>}
                            <Button type="submit" loading={loading} size="lg" className="w-full !rounded-lg !py-3 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] hover:from-[#a855f7] hover:to-[#8b5cf6] !transition-all !duration-300">
                                Sign In
                            </Button>
                        </form>
                    )}
                    
                    {/* View: Signup */}
                    {view === 'signup' && (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <InputWithIcon icon={<UserIcon className="h-5 w-5" />} type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Full Name" autoComplete="name" required />
                            <InputWithIcon icon={<MailIcon className="h-5 w-5" />} type="email" name="email" value={form.email} onChange={handleInputChange} placeholder="Email" autoComplete="email" required />
                            <InputWithIcon icon={<LockClosedIcon className="h-5 w-5" />} type="password" name="password" value={form.password} onChange={handleInputChange} placeholder="Password" autoComplete="new-password" required />
                            {form.password && <PasswordStrengthMeter password={form.password} />}
                            <InputWithIcon icon={<LockClosedIcon className="h-5 w-5" />} type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" autoComplete="new-password" required />
                            <div className="flex items-center">
                                <input id="terms" name="agreedToTerms" type="checkbox" checked={form.agreedToTerms} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"/>
                                <label htmlFor="terms" className="ml-2 block text-sm text-slate-200">I agree to the <a href="#" className="font-medium text-purple-400 hover:underline">Terms</a></label>
                            </div>
                            {error && <p className="text-red-500 text-sm text-center error-message">{error}</p>}
                            <Button type="submit" loading={loading} size="lg" className="w-full !rounded-lg !py-3 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] hover:from-[#a855f7] hover:to-[#8b5cf6] !transition-all !duration-300">
                                Create Account
                            </Button>
                        </form>
                    )}
                    
                    {/* View: Forgot Password */}
                    {view === 'forgotPassword' && (
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <InputWithIcon icon={<MailIcon className="h-5 w-5" />} type="email" name="email" value={form.email} onChange={handleInputChange} placeholder="Enter your email" autoComplete="email" required />
                            {error && <p className="text-red-500 text-sm text-center error-message">{error}</p>}
                            {message && <p className="text-green-500 text-sm text-center">{message}</p>}
                             <Button type="submit" loading={loading} size="lg" className="w-full !rounded-lg !py-3 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] hover:from-[#a855f7] hover:to-[#8b5cf6] !transition-all !duration-300">
                                Send Reset Link
                            </Button>
                        </form>
                    )}
                </div>
                
                {/* Social Logins & View Toggler */}
                <div className="mt-auto pt-6">
                    {view !== 'forgotPassword' && (
                        <>
                            <div className="my-6 flex items-center">
                                <div className="flex-grow border-t border-slate-400/30"></div>
                                <span className="flex-shrink mx-4 text-slate-400 text-sm">OR</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button onClick={() => handleSocialSignIn('google')} variant="secondary" loading={socialLoading === 'google'} disabled={!!socialLoading} className="!bg-white !text-gray-700 !border !border-gray-300 hover:!bg-gray-50">
                                    <GoogleIcon className="h-5 w-5 mr-2"/> Google
                                </Button>
                                <Button onClick={() => handleSocialSignIn('github')} variant="secondary" loading={socialLoading === 'github'} disabled={!!socialLoading} className="!bg-white !text-gray-700 !border !border-gray-300 hover:!bg-gray-50">
                                    <GithubIcon className="h-5 w-5 mr-2"/> GitHub
                                </Button>
                            </div>
                        </>
                    )}
                    
                    <div className="mt-6 text-center text-sm">
                        {view === 'login' && <p className="text-slate-300">Don't have an account? <button onClick={() => setView('signup')} className="font-medium text-purple-400 hover:underline">Sign Up</button></p>}
                        {view === 'signup' && <p className="text-slate-300">Already have an account? <button onClick={() => setView('login')} className="font-medium text-purple-400 hover:underline">Sign In</button></p>}
                        {view === 'forgotPassword' && <p className="text-slate-300">Remembered your password? <button onClick={() => setView('login')} className="font-medium text-purple-400 hover:underline">Sign In</button></p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
