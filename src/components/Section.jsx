import { Link } from 'react-router-dom'

export default function Section({ title, subtitle, link, linkText = 'Show all', children }) {
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-sp-muted mt-1">{subtitle}</p>}
        </div>
        {link && (
          <Link to={link} className="text-sm font-semibold text-sp-muted hover:text-white hover:underline shrink-0">
            {linkText}
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
