"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { requestOTP, verifyOTP, ApiError } from '@/lib/api';

export interface OTPModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (token: string) => void;
}

type Step = 'contact' | 'code';
type Status = 'idle' | 'loading' | 'error' | 'success';

export const OTPModal = ({ isOpen, onClose, onSuccess }: OTPModalProps) => {
    const [step, setStep] = useState<Step>('contact');
    const [status, setStatus] = useState<Status>('idle');
    const [contact, setContact] = useState('');
    const [code, setCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const firstFocusRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setStep('contact');
            setStatus('idle');
            setContact('');
            setCode('');
            setErrorMsg('');
            setTimeout(() => firstFocusRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        try {
            await requestOTP(contact);
            setStatus('idle');
            setStep('code');
        } catch (err) {
            setStatus('error');
            setErrorMsg(err instanceof ApiError ? 'Não foi possível enviar o código. Tente novamente.' : 'Erro inesperado. Tente novamente.');
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        try {
            const { token } = await verifyOTP(contact, code);
            setStatus('success');
            setTimeout(() => onSuccess(token), 800);
        } catch (err) {
            setStatus('error');
            setErrorMsg(err instanceof ApiError && err.status === 401 ? 'Código inválido. Verifique e tente novamente.' : 'Erro ao verificar código. Tente novamente.');
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Fechar modal"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="otp-modal-title"
                className="relative w-full max-w-sm mx-4 bg-pavement border border-white/10 rounded-card p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                    aria-label="Fechar"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-semibold mb-1">Acesso Seguro</p>
                    <h2 id="otp-modal-title" className="text-white text-2xl font-black tracking-tight">
                        {step === 'contact' ? 'Encontre suas fotos' : 'Confirme o código'}
                    </h2>
                    <p className="text-zinc-400 text-sm mt-2">
                        {step === 'contact'
                            ? 'Informe seu WhatsApp ou e-mail para receber o código.'
                            : `Código enviado para ${contact}.`}
                    </p>
                </div>

                {/* Step: contact */}
                {step === 'contact' && (
                    <form onSubmit={handleRequestOTP} className="flex flex-col gap-4">
                        <input
                            ref={firstFocusRef}
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="WhatsApp ou e-mail"
                            required
                            disabled={status === 'loading'}
                            className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-volt/60 transition-colors disabled:opacity-50"
                        />
                        {status === 'error' && (
                            <p role="alert" className="text-red-400 text-xs">{errorMsg}</p>
                        )}
                        <button
                            type="submit"
                            disabled={status === 'loading' || !contact.trim()}
                            className="flex items-center justify-center gap-2 w-full bg-volt text-black font-black text-[11px] uppercase tracking-widest rounded-lg py-3 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? (
                                <><Loader2 size={14} className="animate-spin" /> Enviando...</>
                            ) : 'Receber código'}
                        </button>
                    </form>
                )}

                {/* Step: code */}
                {step === 'code' && (
                    <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
                        {status === 'success' ? (
                            <div className="flex flex-col items-center gap-3 py-4">
                                <CheckCircle2 size={40} className="text-volt" />
                                <p className="text-white font-bold text-sm">Identidade confirmada!</p>
                            </div>
                        ) : (
                            <>
                                <input
                                    ref={firstFocusRef}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]{4}"
                                    maxLength={4}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="0000"
                                    required
                                    disabled={status === 'loading'}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white text-center text-2xl font-mono tracking-[0.5em] placeholder:text-zinc-600 focus:outline-none focus:border-volt/60 transition-colors disabled:opacity-50"
                                />
                                {status === 'error' && (
                                    <p role="alert" className="text-red-400 text-xs">{errorMsg}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={status === 'loading' || code.length !== 4}
                                    className="flex items-center justify-center gap-2 w-full bg-volt text-black font-black text-[11px] uppercase tracking-widest rounded-lg py-3 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === 'loading' ? (
                                        <><Loader2 size={14} className="animate-spin" /> Verificando...</>
                                    ) : 'Verificar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setStep('contact'); setStatus('idle'); setCode(''); setErrorMsg(''); }}
                                    className="text-zinc-500 hover:text-white text-xs text-center transition-colors"
                                >
                                    Alterar contato
                                </button>
                            </>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};
