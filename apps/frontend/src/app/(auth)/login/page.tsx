'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@smartspace/shared';
import { useAuth } from '@/hooks/use-auth';
import { Building2, Lock, Mail, ArrowRight, Loader2, AlertCircle, Sparkles, User, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginDemo } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      setServerError(null);
      await login(values);
      router.push('/spaces');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Login failed. Please check your credentials or use Quick Demo Sign-In below.');
    }
  };

  const handleDemoLogin = (role: 'USER' | 'SPACE_OWNER' | 'ADMIN') => {
    loginDemo(role);
    if (role === 'SPACE_OWNER') {
      router.push('/dashboard/owner');
    } else if (role === 'ADMIN') {
      router.push('/dashboard/admin');
    } else {
      router.push('/spaces');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#060e20]">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl space-y-6 relative border border-white/10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2 text-white font-bold text-xl">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <span>SmartSpace</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white pt-2">Welcome Back</h1>
          <p className="text-sm text-slate-400">Enter your credentials or choose a quick role demo</p>
        </div>

        {/* 1-Click Quick Demo Sign-In */}
        <div className="p-4 rounded-2xl bg-[#0b1326] border border-cyan-500/30 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Instant Demo Access</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('USER')}
              className="p-2 rounded-xl bg-[#131b2e] hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold">
                <User className="w-3 h-3" />
                <span>Attendee</span>
              </div>
              <div className="text-[10px] text-slate-400">Alice C.</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('SPACE_OWNER')}
              className="p-2 rounded-xl bg-[#131b2e] hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-1 text-cyan-400 text-xs font-bold">
                <Building2 className="w-3 h-3" />
                <span>Owner</span>
              </div>
              <div className="text-[10px] text-slate-400">Marcus S.</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="p-2 rounded-xl bg-[#131b2e] hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-1 text-purple-400 text-xs font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>Admin</span>
              </div>
              <div className="text-[10px] text-slate-400">Chief Ops</div>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-3 text-slate-500 text-[11px] uppercase tracking-wider">Or Sign in with Email</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b1326] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
              <Link href="/forgot-password" className="text-xs text-emerald-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b1326] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
              />
            </div>
            {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-glow disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-emerald-400 font-semibold hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
