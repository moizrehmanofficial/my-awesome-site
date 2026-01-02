import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Database, Server, Layers } from "lucide-react";

const highlights = [
  {
    icon: Code2,
    title: "Frontend",
    description: "React.js, HTML5, CSS3, Tailwind CSS",
  },
  {
    icon: Server,
    title: "Backend",
    description: "Node.js, Express.js, REST APIs",
  },
  {
    icon: Database,
    title: "Database",
    description: "MongoDB, Mongoose, Data Modeling",
  },
  {
    icon: Layers,
    title: "DevOps",
    description: "Docker, Git, CI/CD, Deployments",
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 bg-dots opacity-30" />
      
      <div className="container mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm mb-4 block">
            {"// About Me"}
          </span>
          <h2 className="section-heading">
            Passionate <span className="text-gradient">MERN Stack</span> Developer
          </h2>
          <p className="section-subheading max-w-3xl mx-auto">
            Building robust and scalable web applications with modern technologies
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card-gradient border-glow rounded-2xl p-8">
              <p className="text-muted-foreground leading-relaxed mb-6">
                I'm a passionate and dedicated <span className="text-primary font-medium">MERN Stack Developer</span> with 
                hands-on experience building web applications using MongoDB, Express.js, React.js, and Node.js.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                I recently completed an intensive backend development internship at <span className="text-primary font-medium">Softoo</span>, 
                where I worked on real-world projects, improved API development skills, and collaborated with 
                experienced engineers in an agile environment.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I specialize in creating efficient, scalable, and RESTful back-end systems, and I enjoy solving 
                complex problems through clean and optimized code. Currently exploring <span className="text-primary font-medium">Next.js</span> and 
                DevOps practices to stay ahead in the industry.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient">2+</div>
                  <div className="text-muted-foreground text-sm">Years Exp.</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient">10+</div>
                  <div className="text-muted-foreground text-sm">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient">3+</div>
                  <div className="text-muted-foreground text-sm">Companies</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="card-gradient border-glow rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
