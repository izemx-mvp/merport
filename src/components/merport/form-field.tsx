import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type Common = { label: string; name: string; error?: string | undefined; hint?: ReactNode; required?: boolean };

export function Field({ label, name, error, hint, required, className = "", ...props }: Common & Omit<InputHTMLAttributes<HTMLInputElement>, "name">) {
  const describedBy = [hint ? `${name}-hint` : "", error ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`field ${error ? "field-error" : ""} ${className}`}>
      <label htmlFor={name}>{label}{required && <span className="required" aria-hidden="true"> *</span>}</label>
      <input id={name} name={name} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...props} />
      {hint && <span className="field-hint" id={`${name}-hint`}>{hint}</span>}
      {error && <span className="field-message" id={`${name}-error`} role="alert">{error}</span>}
    </div>
  );
}

export function TextArea({ label, name, error, hint, required, className = "", ...props }: Common & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name">) {
  const describedBy = [hint ? `${name}-hint` : "", error ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`field ${error ? "field-error" : ""} ${className}`}>
      <label htmlFor={name}>{label}{required && <span className="required" aria-hidden="true"> *</span>}</label>
      <textarea id={name} name={name} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...props} />
      {hint && <span className="field-hint" id={`${name}-hint`}>{hint}</span>}
      {error && <span className="field-message" id={`${name}-error`} role="alert">{error}</span>}
    </div>
  );
}

/** Champ piège invisible pour les robots. */
export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="honeypot" aria-hidden="true">
      <label htmlFor="website">Site web</label>
      <input id="website" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
