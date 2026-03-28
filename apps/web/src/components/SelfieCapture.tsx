"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Loader2, CheckCircle2, CameraOff } from 'lucide-react';
import { submitSelfie, ApiError } from '@/lib/api';

export interface SelfieCaptureProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type Step = 'camera' | 'consent' | 'submitting' | 'success' | 'error';
type ConsentType = 'global' | 'event';

export const SelfieCapture = ({ isOpen, onClose, onSuccess }: SelfieCaptureProps) => {
    const [step, setStep] = useState<Step>('camera');
    const [consentType, setConsentType] = useState<ConsentType>('global');
    const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
    const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const stopStream = useCallback(() => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
    }, []);

    const startCamera = useCallback(async () => {
        setPermissionDenied(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            if (err instanceof DOMException && err.name === 'NotAllowedError') {
                setPermissionDenied(true);
            }
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            setStep('camera');
            setConsentType('global');
            setCapturedBlob(null);
            setCapturedPreview(null);
            setPermissionDenied(false);
            setErrorMsg('');
            startCamera();
        } else {
            stopStream();
        }
        return () => stopStream();
    }, [isOpen, startCamera, stopStream]);

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            if (!blob) return;
            setCapturedBlob(blob);
            setCapturedPreview(canvas.toDataURL('image/jpeg'));
            stopStream();
            setStep('consent');
        }, 'image/jpeg', 0.9);
    };

    const handleSubmit = async () => {
        if (!capturedBlob) return;
        setStep('submitting');
        const token = localStorage.getItem('kapt_token') ?? '';
        try {
            await submitSelfie(capturedBlob, consentType, token);
            setStep('success');
            setTimeout(onSuccess, 1000);
        } catch (err) {
            setErrorMsg(
                err instanceof ApiError && err.status === 401
                    ? 'Sessão expirada. Faça login novamente.'
                    : 'Não foi possível enviar sua selfie. Tente novamente.',
            );
            setStep('error');
        }
    };

    const handleRetake = () => {
        setCapturedBlob(null);
        setCapturedPreview(null);
        setStep('camera');
        startCamera();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Fechar captura"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="selfie-modal-title"
                className="relative w-full max-w-sm mx-4 bg-pavement border border-white/10 rounded-card p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                    aria-label="Fechar"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-semibold mb-1">
                        Identificação
                    </p>
                    <h2 id="selfie-modal-title" className="text-white text-2xl font-black tracking-tight">
                        {step === 'camera' && 'Tire sua selfie'}
                        {step === 'consent' && 'Consentimento LGPD'}
                        {step === 'submitting' && 'Enviando...'}
                        {step === 'success' && 'Tudo certo!'}
                        {step === 'error' && 'Algo deu errado'}
                    </h2>
                    {step === 'camera' && !permissionDenied && (
                        <p className="text-zinc-400 text-sm mt-2">
                            Posicione seu rosto no centro e clique em "Tirar foto".
                        </p>
                    )}
                    {step === 'consent' && (
                        <p className="text-zinc-400 text-sm mt-2">
                            Confirme como deseja compartilhar seus dados biométricos.
                        </p>
                    )}
                </div>

                {/* Step: camera */}
                {step === 'camera' && (
                    permissionDenied ? (
                        <div className="flex flex-col items-center gap-4 py-4" role="alert">
                            <CameraOff size={40} className="text-zinc-500" />
                            <p className="text-zinc-400 text-sm text-center">
                                Permissão de câmera negada. Habilite o acesso nas configurações do seu navegador.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="relative w-full aspect-square bg-neutral-900 rounded-lg overflow-hidden">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover scale-x-[-1]"
                                    aria-label="Pré-visualização da câmera"
                                />
                            </div>
                            <canvas ref={canvasRef} className="hidden" />
                            <button
                                onClick={handleCapture}
                                className="w-full bg-volt text-black font-black text-[11px] uppercase tracking-widest rounded-lg py-3 hover:brightness-110 transition-all"
                            >
                                Tirar foto
                            </button>
                        </div>
                    )
                )}

                {/* Step: consent */}
                {step === 'consent' && capturedPreview && (
                    <div className="flex flex-col gap-5">
                        <img
                            src={capturedPreview}
                            alt="Sua selfie capturada"
                            className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-volt/40 scale-x-[-1]"
                        />

                        <fieldset className="flex flex-col gap-3">
                            <legend className="text-zinc-400 text-xs uppercase tracking-widest mb-1">
                                Tipo de consentimento
                            </legend>

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="consent"
                                    value="global"
                                    checked={consentType === 'global'}
                                    onChange={() => setConsentType('global')}
                                    className="mt-0.5 accent-volt"
                                />
                                <span className="flex flex-col">
                                    <span className="text-white text-sm font-bold">Global</span>
                                    <span className="text-zinc-400 text-xs">
                                        Ganhe sua 1ª foto grátis no próximo evento
                                    </span>
                                </span>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="consent"
                                    value="event"
                                    checked={consentType === 'event'}
                                    onChange={() => setConsentType('event')}
                                    className="mt-0.5 accent-volt"
                                />
                                <span className="flex flex-col">
                                    <span className="text-white text-sm font-bold">Evento-específico</span>
                                    <span className="text-zinc-400 text-xs">
                                        Apenas para esta cobertura
                                    </span>
                                </span>
                            </label>
                        </fieldset>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-volt text-black font-black text-[11px] uppercase tracking-widest rounded-lg py-3 hover:brightness-110 transition-all"
                        >
                            Confirmar
                        </button>
                        <button
                            type="button"
                            onClick={handleRetake}
                            className="text-zinc-500 hover:text-white text-xs text-center transition-colors"
                        >
                            Tirar nova foto
                        </button>
                    </div>
                )}

                {/* Step: submitting */}
                {step === 'submitting' && (
                    <div className="flex flex-col items-center gap-3 py-6">
                        <Loader2 size={36} className="animate-spin text-volt" />
                        <p className="text-zinc-400 text-sm">Buscando suas fotos...</p>
                    </div>
                )}

                {/* Step: success */}
                {step === 'success' && (
                    <div className="flex flex-col items-center gap-3 py-6">
                        <CheckCircle2 size={40} className="text-volt" />
                        <p className="text-white font-bold text-sm">Fotos sendo buscadas!</p>
                    </div>
                )}

                {/* Step: error */}
                {step === 'error' && (
                    <div className="flex flex-col gap-4">
                        <p role="alert" className="text-red-400 text-sm text-center">{errorMsg}</p>
                        <button
                            onClick={handleRetake}
                            className="w-full bg-volt text-black font-black text-[11px] uppercase tracking-widest rounded-lg py-3 hover:brightness-110 transition-all"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
