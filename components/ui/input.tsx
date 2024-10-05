// components/ui/input.tsx
export const Input = ({ type, value, onChange, placeholder, className }: any) => (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`border rounded-md p-2 ${className}`} />
  );