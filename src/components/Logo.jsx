export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-spotify text-black">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
          <path d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21Zm4.82 15.14a.8.8 0 0 1-1.1.27c-2.99-1.83-6.76-2.24-11.2-1.23a.8.8 0 1 1-.36-1.56c4.86-1.11 9.03-.63 12.4 1.43a.8.8 0 0 1 .26 1.09Zm1.56-3.48a1 1 0 0 1-1.37.33c-3.43-2.1-8.66-2.71-12.72-1.48a1 1 0 1 1-.58-1.92c4.64-1.4 10.4-.72 14.34 1.7a1 1 0 0 1 .33 1.37Zm.13-3.63c-4.11-2.44-10.9-2.67-14.83-1.48a1.2 1.2 0 1 1-.7-2.29c4.5-1.37 11.98-1.1 16.7 1.7a1.2 1.2 0 0 1-1.17 2.07Z" />
        </svg>
      </span>
      <span className="text-xl font-black tracking-tight">Spotify</span>
    </div>
  )
}
