
interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export const Button = ({ 
  onClick, 
  children, 
  variant = "primary",
  className = "" 
}: ButtonProps) => {
  const baseStyles = "px-8 py-4 text-xl font-bold rounded-lg transition-all active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transform hover:scale-105",
    secondary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transform hover:scale-105"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className} w-full`}
    >
      {children}
    </button>
  );
};

