import { ResumeContent } from '@/types/resume';

interface TemplateProps {
  content: ResumeContent;
}

export const StudentFresherTemplate: React.FC<TemplateProps> = ({ content }) => {
  const { personalDetails, summary, skills, experience, education, projects, certifications } = content;

  return (
    <div className="p-10 text-[#333]" style={{ fontSize: '11px', lineHeight: '1.6' }}>
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#1a5276] mb-2">
          {personalDetails.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-[10px]">
          {personalDetails.email && <span>{personalDetails.email}</span>}
          {personalDetails.phone && <span>{personalDetails.phone}</span>}
          {personalDetails.location && <span>{personalDetails.location}</span>}
        </div>
        {(personalDetails.linkedin || personalDetails.website) && (
          <div className="flex justify-center gap-4 text-[10px] mt-1 text-[#2874a6]">
            {personalDetails.linkedin && <span>{personalDetails.linkedin}</span>}
            {personalDetails.website && <span>{personalDetails.website}</span>}
          </div>
        )}
      </header>

      {/* Objective/Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-[#1a5276] mb-2 pb-1 border-b-2 border-[#1a5276]">
            CAREER OBJECTIVE
          </h2>
          <p className="text-justify">{summary}</p>
        </section>
      )}

      {/* Education - First for students */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-[#1a5276] mb-2 pb-1 border-b-2 border-[#1a5276]">
            EDUCATION
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                  <p className="text-[#555]">{edu.institution}, {edu.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px]">{edu.startDate} - {edu.endDate}</span>
                  {edu.gpa && <p className="text-[10px] font-semibold">GPA: {edu.gpa}</p>}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-[#1a5276] mb-2 pb-1 border-b-2 border-[#1a5276]">
            SKILLS
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {skills.map((category) => (
              <div key={category.id}>
                <span className="font-semibold">{category.name}: </span>
                <span>{category.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects - Important for freshers */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-[#1a5276] mb-2 pb-1 border-b-2 border-[#1a5276]">
            ACADEMIC PROJECTS
          </h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{project.name}</h3>
                {project.link && <span className="text-[9px] text-[#2874a6]">{project.link}</span>}
              </div>
              <p className="text-[#555] mb-1">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-[10px]">
                  <span className="font-semibold">Technologies:</span> {project.technologies.join(', ')}
                </p>
              )}
              {project.highlights.length > 0 && (
                <ul className="ml-4 list-disc">
                  {project.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-[#1a5276] mb-2 pb-1 border-b-2 border-[#1a5276]">
            INTERNSHIP / WORK EXPERIENCE
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{exp.position}</h3>
                  <p className="text-[#555]">{exp.company}, {exp.location}</p>
                </div>
                <span className="text-[10px]">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.description.length > 0 && (
                <ul className="mt-1 ml-4 list-disc">
                  {exp.description.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-[#1a5276] mb-2 pb-1 border-b-2 border-[#1a5276]">
            CERTIFICATIONS & ACHIEVEMENTS
          </h2>
          <ul className="ml-4 list-disc">
            {certifications.map((cert) => (
              <li key={cert.id}>
                <span className="font-semibold">{cert.name}</span> - {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
