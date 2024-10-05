// components/ui/card.tsx
export const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">{children}</div>
  );
  
  export const CardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="border-b p-4">{children}</div>
  );
  
  export const CardContent = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4">{children}</div>
  );
  
  export const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-bold">{children}</h2>
  );