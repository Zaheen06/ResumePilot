import { ResumeContent } from '@/types/resume';

interface TemplateProps {
  content: ResumeContent;
}

export const MinimalProfessionalTemplate: React.FC<TemplateProps> = ({ content }) => {
  const { personalDetails, summary, skills, experience, education, projects, certifications } = content;

  return (
    <div className="p-10 text-[#1a1a1a]" style={{ fontSize: '11px', lineHeight: '1.5' }}>
      {/* Header */}
      <header className="text-center mb-6 pb-4 border-b-2 border-[#1a1a1a]">
        <h1 className="text-2xl font-bold mb-2 tracking-wide">
          {personalDetails.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-3 text-[10px]">
          {personalDetails.email && <span>{personalDetails.email}</span>}
          {personalDetails.phone && <span>•</span>}
          {personalDetails.phone && <span>{personalDetails.phone}</span>}
          {personalDetails.location && <span>•</span>}
          {personalDetails.location && <span>{personalDetails.location}</span>}
        </div>
        {(personalDetails.linkedin || personalDetails.website) && (
          <div className="flex justify-center gap-3 text-[10px] mt-1">
            {personalDetails.linkedin && <span>{personalDetails.linkedin}</span>}
            {personalDetails.website && <span>•</span>}
            {personalDetails.website && <span>{personalDetails.website}</span>}
          </div>
        )}
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-[#ccc] pb-1">
            Professional Summary
          </h2>
          <p className="text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-[#ccc] pb-1">
            Work Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{exp.position}</h3>
                  <p className="italic">{exp.company}{exp.location && `, ${exp.location}`}</p>
                </div>
                <span className="text-[10px] whitespace-nowrap">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.description.length > 0 && (
                <ul className="mt-2 ml-4 list-disc">
                  {exp.description.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-[#ccc] pb-1">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                  <p className="italic">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                </div>
                <span className="text-[10px] whitespace-nowrap">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              {edu.gpa && <p className="text-[10px]">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-[#ccc] pb-1">
            Skills
          </h2>
          {skills.map((category) => (
            <div key={category.id} className="mb-2">
              <span className="font-bold">{category.name}: </span>
              <span>{category.skills.join(', ')}</span>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-[#ccc] pb-1">
            Projects
          </h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="font-bold">
                {project.name}
                {project.link && <span className="font-normal text-[10px]"> ({project.link})</span>}
              </h3>
              <p>{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-[10px]">Technologies: {project.technologies.join(', ')}</p>
              )}
              {project.highlights.length > 0 && (
                <ul className="mt-1 ml-4 list-disc">
                  {project.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
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
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-[#ccc] pb-1">
            Certifications
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <span className="font-bold">{cert.name}</span>
              <span> - {cert.issuer}</span>
              <span className="text-[10px]"> ({cert.date})</span>
              {cert.credentialId && <span className="text-[10px]"> • ID: {cert.credentialId}</span>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
