import { motion } from "framer-motion";

const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: { container: "w-8 h-8", text: "text-xs" },
    md: { container: "w-10 h-10", text: "text-sm" },
    lg: { container: "w-14 h-14", text: "text-lg" },
  };

  return (
    <motion.div
      className={`${sizes[size].container} relative flex items-center justify-center`}
      whileHover={{ scale: 1.05 }}
    >
      {/* Outer hexagon border */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(186 100% 50%)" />
            <stop offset="100%" stopColor="hsl(200 100% 60%)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Hexagon shape */}
        <polygon
          points="50,2 95,25 95,75 50,98 5,75 5,25"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          filter="url(#glow)"
        />
        
        {/* Inner decorative lines */}
        <line
          x1="20"
          y1="35"
          x2="35"
          y2="50"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          opacity="0.6"
        />
        <line
          x1="35"
          y1="50"
          x2="20"
          y2="65"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          opacity="0.6"
        />
        <line
          x1="80"
          y1="35"
          x2="65"
          y2="50"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          opacity="0.6"
        />
        <line
          x1="65"
          y1="50"
          x2="80"
          y2="65"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          opacity="0.6"
        />
      </svg>
      
      {/* MR Text */}
      <span className={`${sizes[size].text} font-bold font-mono text-gradient relative z-10`}>
        MR
      </span>
    </motion.div>
  );
};

export default Logo;
