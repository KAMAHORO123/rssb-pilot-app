type AuthFormFieldProps = {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
};

export default function AuthFormField({
  label,
  type,
  placeholder,
  value,
  onChange,
  required,
  disabled,
  error,
  hint
}: AuthFormFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        className={`auth-input mt-2${error ? " auth-input-error" : ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-stone-400">{hint}</p>
      ) : null}
    </div>
  );
}
