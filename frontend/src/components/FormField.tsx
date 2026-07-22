interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  errors?: string[];
  autoComplete?: string;
  required?: boolean;
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  errors,
  autoComplete,
  required = true,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
      />
      {errors?.map((error) => (
        <p key={error} className="text-sm text-red-600">
          {error}
        </p>
      ))}
    </div>
  );
}
