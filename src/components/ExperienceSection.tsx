import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, GraduationCap, Calendar } from "lucide-react";

const experiences = [
  {
    type: "work",
    title: "Freelance MERN Stack Developer",
    company: "Self-Employed",
    location: "Islamabad, Pakistan",
    period: "November 2024 - Present",
    description: [
      "Built dynamic web applications using React.js for front-end and Node.js/Express.js for back-end",
      "Designed and managed MongoDB databases using Mongoose",
      "Developed and consumed RESTful APIs with JWT authentication",
      "Deployed applications to platforms like Render, Vercel, and Netlify",
      "Worked directly with clients to understand requirements and deliver custom solutions",
    ],
  },
  {
    type: "work",
    title: "MERN Stack Developer Intern",
    company: "SOFTOO",
    location: "Islamabad, Pakistan",
    period: "June 2024 - September 2024",
    description: [
      "Developed and maintained RESTful APIs using Node.js and Express.js",
      "Worked with MongoDB for designing databases and data modeling",
      "Integrated backend services with React.js front-end components",
      "Implemented user authentication and authorization using JWT and middleware",
    ],
  },
  {
    type: "work",
    title: "Frontend Web Developer",
    company: "CNEX",
    location: "Rawalpindi, Pakistan",
    period: "March 2023 - April 2024",
    description: [
      "Built responsive websites using HTML, CSS, and JavaScript",
      "Used Bootstrap and Tailwind CSS for styling and layouts",
      "Converted Figma/PSD designs into working web pages",
      "Connected front-end with APIs using Fetch and AJAX",
    ],
  },
  {
    type: "education",
    title: "Bachelor's of Software Engineering",
    company: "SZABIST University - Islamabad Campus",
    location: "Islamabad, Pakistan",
    period: "September 2021",
    description: [
      "Focused on software development and engineering principles",
      "Learned various programming languages and development methodologies",
    ],
  },
];

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-24 relative">
      <div className="absolute inset-0 bg-dots opacity-20" />
      
      <div className="container mx-auto px-6 relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm mb-4 block">
            {"// Experience & Education"}
          </span>
          <h2 className="section-heading">
            My <span className="text-gradient">Journey</span>
          </h2>
          <p className="section-subheading max-w-2xl mx-auto">
            A timeline of my professional experience and educational background
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="timeline-line" />

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="relative pl-12 pb-12 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="timeline-dot" style={{ top: "6px" }} />

              <div className="card-gradient border-glow rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {exp.type === "work" ? (
                        <Briefcase className="text-primary" size={18} />
                      ) : (
                        <GraduationCap className="text-primary" size={18} />
                      )}
                      <span className="text-xs font-mono text-primary uppercase">
                        {exp.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{exp.title}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-muted-foreground text-sm">{exp.location}</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm bg-secondary/50 px-3 py-1 rounded-full">
                    <Calendar size={14} />
                    <span>{exp.period}</span>
                  </div>
                </div>

                <ul className="space-y-2">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <span className="text-primary mt-1">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
