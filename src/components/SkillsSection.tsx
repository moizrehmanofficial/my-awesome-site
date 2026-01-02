import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skills = {
  frontend: [
    { name: "React.js", level: 90 },
    { name: "HTML5", level: 95 },
    { name: "CSS3", level: 90 },
    { name: "Tailwind CSS", level: 88 },
    { name: "Bootstrap", level: 85 },
    { name: "JavaScript (ES6+)", level: 92 },
  ],
  backend: [
    { name: "Node.js", level: 88 },
    { name: "Express.js", level: 90 },
    { name: "REST APIs", level: 92 },
    { name: "MongoDB", level: 85 },
    { name: "JWT Auth", level: 88 },
    { name: "Mongoose", level: 85 },
  ],
  tools: [
    { name: "Git & GitHub", level: 90 },
    { name: "Docker", level: 75 },
    { name: "VS Code", level: 95 },
    { name: "Postman", level: 90 },
    { name: "Vercel/Netlify", level: 85 },
    { name: "Render", level: 80 },
  ],
};

const SkillBar = ({ name, level, delay }: { name: string; level: number; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50px" });

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-sm text-primary font-mono">{level}%</span>
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section id="skills" className="py-24 bg-card/30">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm mb-4 block">
            {"// My Skills"}
          </span>
          <h2 className="section-heading">
            Technical <span className="text-gradient">Expertise</span>
          </h2>
          <p className="section-subheading max-w-2xl mx-auto">
            Proficient in modern web technologies and best practices
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Frontend Skills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-gradient border-glow rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold">Frontend</h3>
            </div>
            {skills.frontend.map((skill, index) => (
              <SkillBar
                key={skill.name}
                name={skill.name}
                level={skill.level}
                delay={0.3 + index * 0.1}
              />
            ))}
          </motion.div>

          {/* Backend Skills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-gradient border-glow rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold">Backend</h3>
            </div>
            {skills.backend.map((skill, index) => (
              <SkillBar
                key={skill.name}
                name={skill.name}
                level={skill.level}
                delay={0.5 + index * 0.1}
              />
            ))}
          </motion.div>

          {/* Tools */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="card-gradient border-glow rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold">Tools & DevOps</h3>
            </div>
            {skills.tools.map((skill, index) => (
              <SkillBar
                key={skill.name}
                name={skill.name}
                level={skill.level}
                delay={0.7 + index * 0.1}
              />
            ))}
          </motion.div>
        </div>

        {/* Currently Learning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            <span className="text-primary font-mono">Currently exploring:</span>{" "}
            Next.js, DevOps (CI/CD), Advanced System Design
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
