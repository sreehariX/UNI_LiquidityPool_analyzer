// components/ui/button.tsx
export const Button = ({ onClick, children, className }: any) => (
    <button onClick={onClick} className={`py-2 px-4 rounded-md text-white ${className}`}>
      {children}
    </button>
  );