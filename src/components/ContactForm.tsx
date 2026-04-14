import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Bitte geben Sie Ihren Namen ein (min. 2 Zeichen)'),
  company: z.string().min(2, 'Bitte geben Sie Ihren Unternehmensnamen ein'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  message: z.string().min(10, 'Bitte beschreiben Sie kurz Ihr Anliegen (min. 10 Zeichen)'),
});

type FormData = z.infer<typeof schema>;

const STEPS = [
  {
    field: 'name' as const,
    label: 'Wie lautet Ihr Name?',
    placeholder: 'Max Mustermann',
    type: 'text' as const,
  },
  {
    field: 'company' as const,
    label: 'Für welches Unternehmen arbeiten Sie?',
    placeholder: 'Muster GmbH',
    type: 'text' as const,
  },
  {
    field: 'email' as const,
    label: 'Wie können wir Sie erreichen?',
    placeholder: 'max@muster.de',
    type: 'email' as const,
  },
  {
    field: 'message' as const,
    label: 'Was beschäftigt Sie?',
    placeholder: 'Ich möchte mehr über Ihre KI-Lösungen für SAP erfahren...',
    type: 'textarea' as const,
  },
];

const API_URL = 'https://api.enterprisebrain.eu/contact';

export default function ContactForm() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', company: '', email: '', message: '' },
  });

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const handleNext = async () => {
    const valid = await form.trigger(current.field);
    if (valid) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setIsError(false);
    setStep((s) => s - 1);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Server error');
      setIsSuccess(true);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    'w-full px-4 py-3.5 rounded-xl border bg-white text-carbon text-sm font-body placeholder-ash/60 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/12';
  const inputNormal = `${inputBase} border-stone/20`;
  const inputError = `${inputBase} border-red-400 ring-2 ring-red-400/12`;

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #ed9f7b, #f29202)' }} />
        <div className="p-8 flex flex-col items-center text-center gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ed9f7b 0%, #f29202 100%)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <h3
              className="text-xl font-display font-700 text-carbon mb-2"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}
            >
              Vielen Dank!
            </h3>
            <p className="text-ash text-sm leading-relaxed">
              Ihre Anfrage ist eingegangen. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div
        className="h-1 bg-stone/10 transition-all duration-500"
        style={{ width: '100%' }}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #ed9f7b, #f29202)',
          }}
        />
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between mb-7">
          <span
            className="text-xs font-display font-700 tracking-widest uppercase"
            style={{ fontFamily: "'Syne', sans-serif", color: '#756e64' }}
          >
            {step + 1} / {STEPS.length}
          </span>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? '20px' : '6px',
                  background: i <= step ? 'linear-gradient(90deg, #ed9f7b, #f29202)' : '#e5e7eb',
                }}
              />
            ))}
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="mb-8">
            <label
              htmlFor={current.field}
              className="block text-lg font-display font-700 text-carbon mb-4"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}
            >
              {current.label}
            </label>

            {current.type === 'textarea' ? (
              <textarea
                id={current.field}
                {...form.register(current.field)}
                placeholder={current.placeholder}
                rows={4}
                className={
                  form.formState.errors[current.field] ? inputError : inputNormal
                }
                style={{ resize: 'none' }}
              />
            ) : (
              <input
                id={current.field}
                {...form.register(current.field)}
                type={current.type}
                placeholder={current.placeholder}
                className={
                  form.formState.errors[current.field] ? inputError : inputNormal
                }
              />
            )}

            {form.formState.errors[current.field] && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {form.formState.errors[current.field]?.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className="px-6 py-3 rounded-xl border text-sm font-display font-700 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Syne', sans-serif",
                borderColor: '#e5e7eb',
                color: '#6b6b6b',
              }}
              onMouseEnter={(e) => {
                if (step > 0) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f8f7f5';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              Zurück
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 rounded-xl text-white text-sm font-display font-700 transition-opacity duration-200 hover:opacity-90"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: 'linear-gradient(135deg, #ed9f7b 0%, #f29202 100%)',
                }}
              >
                Weiter
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-xl text-white text-sm font-display font-700 transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: 'linear-gradient(135deg, #ed9f7b 0%, #f29202 100%)',
                }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Wird gesendet…
                  </>
                ) : (
                  'Absenden'
                )}
              </button>
            )}
          </div>

          {isError && (
            <p className="mt-4 text-sm text-red-500 text-center flex items-center justify-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
