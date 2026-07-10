import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Card({ children, className }) {
  return (
    <div className={cn("bg-halcyon-surface border border-halcyon-border/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300", className)}>
      {children}
    </div>
  );
}
