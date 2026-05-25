import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Delete, Check, Circle } from 'lucide-react';

type PasscodeGateProps = {
  onUnlock: () => void;
};

const PASSCODE = '0501';
const BUTTONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export default function PasscodeGate({ onUnlock }: PasscodeGateProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (input.length !== PASSCODE.length) return;
    if (input === PASSCODE) {
      onUnlock();
      return;
    }

    setError(true);
    const timeout = window.setTimeout(() => {
      setError(false);
      setInput('');
    }, 900);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [input, onUnlock]);

  const digits = useMemo(
    () => Array.from({ length: PASSCODE.length }).map((_, index) => (
      <div
        key={index}
        className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 ${
          input[index]
            ? 'border-red-500 bg-red-500/10 text-red-300'
            : 'border-white/20 bg-white/5 text-white/40'
        }`}
      >
        {input[index] ?? ''}
      </div>
    )),
    [input]
  );

  const handleButton = (digit: string) => {
    if (input.length >= PASSCODE.length || error) return;
    setInput((current) => current + digit);
  };

  const clearInput = () => {
    setInput('');
    setError(false);
  };

  const deleteDigit = () => {
    setInput((current) => current.slice(0, -1));
    setError(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 px-4 py-6 text-white"
    >
      <div className="relative w-full max-w-xl rounded-[32px] border border-white/10 bg-black/80 p-8 shadow-2xl shadow-red-900/20 backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-t-[32px]" />
        <div className="relative space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
              <Lock size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Passcode Required</p>
              <h1 className="mt-1 text-3xl font-bebas tracking-[0.02em] text-white">Enter the secret code</h1>
            </div>
          </div>

          <p className="text-sm text-white/70 leading-relaxed">
            Only the correct four-digit passcode will unlock the site. Use the buttons below to enter the code.
          </p>

          <div className="grid grid-cols-4 gap-4">
            {digits}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {BUTTONS.map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleButton(digit)}
                className="rounded-3xl border border-white/10 bg-white/5 py-5 text-2xl font-semibold text-white transition hover:border-red-500/40 hover:bg-red-500/10"
              >
                {digit}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-1">
            <button
              type="button"
              onClick={deleteDigit}
              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm uppercase tracking-[0.24em] text-white/80 transition hover:border-red-500/40 hover:bg-red-500/10"
            >
              <Delete size={16} /> Delete
            </button>
            <button
              type="button"
              onClick={clearInput}
              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm uppercase tracking-[0.24em] text-white/80 transition hover:border-red-500/40 hover:bg-red-500/10"
            >
              <Circle size={16} /> Clear
            </button>
            <div className="ml-auto inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm uppercase tracking-[0.24em] text-white/80">
              <Check size={16} /> 4 digits only
            </div>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error ? 'Incorrect passcode. Try again.' : 'Enter the correct four-digit passcode to unlock the site.'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
