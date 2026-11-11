'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput, USER_ROLES } from '@smartspace/shared';
import { useAuth } from '@/hooks/use-auth';
import { Building2, Lock, Mail, User, Phone, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAuth } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: USER_ROLES.USER,
      email: '',
      password: '',
      fullName: '',
      phone: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values: RegisterInput) => {
    try {
      setServerError(null);
      await registerAuth(values);
      router.push('/spaces');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#060e20]">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-lg glass-panel p-8 rounded-3xl space-y-6 relative my-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2 text-white font-bold text-xl">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <span>SmartSpace</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white pt-2">Join SmartSpace</h1>
          <p className="text-sm text-slate-400">Book workspaces or list your property with live telemetry</p>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Role Toggle Switch */}
        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#0b1326] border border-white/10">
          <button
            type="button"
            onClick={() => setValue('role', USER_ROLES.USER)}
            className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              selectedRole === USER_ROLES.USER
                ? 'bg-emerald-500 text-slate-950 shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>I want to Book Spaces</span>
          </button>
          <button
            type="button"
            onClick={() => setValue('role', USER_ROLES.SPACE_OWNER)}
            className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              selectedRole === USER_ROLES.SPACE_OWNER
                ? 'bg-emerald-500 text-slate-950 shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>I am a Space Owner</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                {...register('fullName')}
                type="text"
                placeholder="Sarah Connor"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b1326] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
              />
            </div>
            {errors.fullName && <p className="text-xs text-rose-400">{errors.fullName.message}</p>}
          </div>

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
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Phone (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                {...register('phone')}
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b1326] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                {...register('password')}
                type="password"
                placeholder="At least 8 chars with uppercase, lowercase & number"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b1326] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
              />
            </div>
            {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
          </div>

          <div className="text-xs text-slate-400 space-y-1 pt-1">
            <div className="flex items-center space-x-2 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant access to 200+ verified workspaces across 5 cities</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live desk occupancy and real-time floorplan reservations</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-glow disabled:opacity-50 pt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

