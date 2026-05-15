export default function SkillBadges({ skills, max = 100 }) {
  if (!skills || skills.length === 0) return (
    <span className="text-xs text-gray-400 italic">No skills listed</span>
  )

  const visible = skills.slice(0, max)
  const remaining = skills.length - max

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((skill, i) => (
        <span key={i} className="skill-tag">
          {skill}
        </span>
      ))}
      {remaining > 0 && (
        <span className="skill-tag bg-gray-50 text-gray-500 border-gray-200">
          +{remaining}
        </span>
      )}
    </div>
  )
}
