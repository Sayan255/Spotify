import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function Card({ to, image, title, subtitle, round = false }) {
  const shape = round ? 'rounded-full' : 'rounded-md'
  return (
    <div className="group min-w-0 bg-sp-elev hover:bg-sp-high rounded-lg p-2.5 sm:p-4 transition-colors">
      <Link to={to} className="block">
        <div className={`relative aspect-square mb-3 sm:mb-4 shadow-lg ${shape} overflow-hidden`}>
          {image ? (
            <img src={image} alt="" loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-sp-high grid place-items-center text-sp-muted">
              <Icon name="music" className="w-12 h-12" />
            </div>
          )}
        </div>
        <p className={`font-bold truncate ${round ? 'text-center' : ''}`}>{title}</p>
        <p className={`text-sm text-sp-muted line-clamp-2 mt-1 ${round ? 'text-center' : ''}`}>{subtitle}</p>
      </Link>
    </div>
  )
}
