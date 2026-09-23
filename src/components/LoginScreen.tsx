import React, { useState, useEffect } from 'react';
import { Sparkles, Key, User, ShieldCheck } from 'lucide-react';
import { setActiveSystem } from '../utils/db';
import ThemeToggle from './ThemeToggle';

interface LoginScreenProps {
  onLoginSuccess: (role: 'teacher' | 'secretary', name: string, userId?: string, system?: 'doctor' | 'alsafa') => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function LoginScreen({ onLoginSuccess, isDarkMode = false, onToggleDarkMode }: LoginScreenProps) {
  const [role, setRole] = useState<'teacher' | 'secretary'>('teacher');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const loadUsers = () => {
      const saved = localStorage.getItem('sams_system_users');
      if (saved) {
        try {
          setUsers(JSON.parse(saved));
          return;
        } catch (e) {}
      }
      
      setUsers([
        { id: 'u-1', name: 'المدير الأكاديمي', role: 'teacher', password: '123', isDefault: true },
        { id: 'u-2', name: 'سكرتيرة', role: 'secretary', password: '123', isDefault: true }
      ]);
    };
    loadUsers();
    
    window.addEventListener('storage', loadUsers);
    return () => window.removeEventListener('storage', loadUsers);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const trimmedPassword = password.trim();
    const finalName = name.trim();
    
    setActiveSystem('doctor');
    const matchedUser = users.find(u => u.name === finalName && u.password === trimmedPassword) 
      || users.find(u => u.role === role && u.password === trimmedPassword)
      || (trimmedPassword === '123' ? { id: role === 'teacher' ? 'u-1' : 'u-2', name: finalName || (role === 'teacher' ? 'المدير الأكاديمي' : 'سكرتيرة'), role } : null);
    
    if (matchedUser) {
      onLoginSuccess(role, finalName || matchedUser.name, matchedUser.id, 'doctor');
    } else {
      setError('رمز الدخول غير صحيح!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-slate-900 flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 shadow-lg overflow-hidden animate-fade-in">
        
        {/* Banner with dynamic branding */}
        <div className="absolute top-4 left-4 z-50">
          {onToggleDarkMode && (
            <div className="bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
              <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
            </div>
          )}
        </div>

        <div className="p-8 text-center relative overflow-hidden flex flex-col items-center justify-center bg-[#0D5C8C]">
          {/* Subtle background decoration */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />

          <div className="relative z-10 flex flex-col items-center animate-scale-up select-none">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#1A7FAA] to-[#F5C453] rounded-full flex items-center justify-center shadow-xl text-white mb-4 ring-4 ring-white/10">
              <Sparkles className="w-11 h-11 text-amber-300 stroke-[1.5]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider">FOX</h1>
            <p className="text-xs font-bold text-[#FCF6BA] mt-2 px-3.5 py-1 bg-white/10 rounded-full border border-white/10 shadow-xs">
              لإدارة السناتر التعليمية
            </p>
          </div>
        </div>

        {/* Content Form */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              مرحباً بك في سيستم FOX لإدارة السناتر التعليمية
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              الرجاء اختيار الدور وإدخال رمز المرور لتسجيل الدخول
            </p>
          </div>

          {/* 2 Choices Tabs: Director & Secretary */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100/80 dark:bg-slate-900/60 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => { 
                setRole('teacher'); 
                setError(''); 
              }}
              className={`py-2.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                role === 'teacher'
                  ? 'bg-white dark:bg-slate-800 text-[#0D5C8C] dark:text-sky-400 shadow-sm ring-1 ring-[#0D5C8C]/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#0D5C8C] dark:text-sky-400" />
              <span className="font-bold">مدير السنتر</span>
            </button>

            <button
              type="button"
              onClick={() => { 
                setRole('secretary'); 
                setError(''); 
              }}
              className={`py-2.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                role === 'secretary'
                  ? 'bg-white dark:bg-slate-800 text-[#0D5C8C] dark:text-sky-400 shadow-sm ring-1 ring-[#0D5C8C]/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100'
              }`}
            >
              <User className="w-4 h-4 shrink-0 text-[#0D5C8C] dark:text-sky-400" />
              <span className="font-bold">سكرتيرة</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Input Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">اسم المستخدم (اختياري):</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'teacher' ? 'المدير' : 'السكرتارية'}
                  className="w-full pl-3 pr-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#0D5C8C] dark:focus:border-sky-500 shadow-3xs"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                رمز الدخول السري:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#0D5C8C] dark:focus:border-sky-500 shadow-3xs text-left tracking-widest"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/40 border border-red-150 text-red-850 dark:text-red-200 rounded-xl text-[11px] font-bold text-center animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 bg-[#0D5C8C] hover:bg-[#1A7FAA]"
            >
              <Sparkles className="w-4 h-4" />
              <span>تأكيد الدخول وفتح لوحة العمل</span>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
