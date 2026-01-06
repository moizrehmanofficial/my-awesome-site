import { motion } from "framer-motion";
import { Heart, Github, Linkedin, Mail } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="text-lg font-bold font-mono text-gradient">
                Moiz Rehman
              </span>
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
               Made by Moiz Rehman © {currentYear}
              {/* Made with <Heart className="text-red-500" size={14} /> by Moiz Rehman © {currentYear} */}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <motion.a
              href="https://github.com/moizrehmanofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <Github size={18} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/moizrehmanofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <Linkedin size={18} />
            </motion.a>
            <motion.a
              href="https://mail.google.com/mail/?view=cm&to=moizrehmanofficial@gmail.com"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <Mail size={18} />
            </motion.a>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#home" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#skills" className="text-muted-foreground hover:text-primary transition-colors">
              Skills
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
