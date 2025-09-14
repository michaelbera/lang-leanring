import { useState } from 'react'

export const DaisyUIShowcase = () => {
  const [selectedTheme, setSelectedTheme] = useState('light')
  const [modalOpen, setModalOpen] = useState(false)

  const themes = [
    'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
    'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden'
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">DaisyUI Components Showcase</h2>
        <p className="text-base-content/70">Explore the beautiful components available in DaisyUI</p>
      </div>

      {/* Theme Selector */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Theme Selector</h3>
          <p>Choose a theme to see DaisyUI in action:</p>
          <select 
            className="select select-bordered w-full max-w-xs" 
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
          >
            {themes.map(theme => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons Showcase */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Buttons</h3>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-accent">Accent</button>
            <button className="btn btn-success">Success</button>
            <button className="btn btn-warning">Warning</button>
            <button className="btn btn-error">Error</button>
            <button className="btn btn-ghost">Ghost</button>
            <button className="btn btn-link">Link</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button className="btn btn-outline btn-primary">Outline</button>
            <button className="btn btn-sm">Small</button>
            <button className="btn btn-lg">Large</button>
            <button className="btn btn-wide">Wide</button>
            <button className="btn btn-square">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Form Elements */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Form Elements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="email@example.com" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" placeholder="Password" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Country</span>
              </label>
              <select className="select select-bordered">
                <option disabled selected>Select country</option>
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Message</span>
              </label>
              <textarea className="textarea textarea-bordered" placeholder="Your message"></textarea>
            </div>
          </div>
          <div className="form-control mt-4">
            <label className="label cursor-pointer">
              <span className="label-text">Remember me</span>
              <input type="checkbox" className="checkbox checkbox-primary" />
            </label>
          </div>
        </div>
      </div>

      {/* Modal Example */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Modal</h3>
          <p>Click the button to open a modal dialog.</p>
          <button className="btn btn-primary w-fit" onClick={() => setModalOpen(true)}>
            Open Modal
          </button>
        </div>
      </div>

      {/* Modal */}
      <dialog className={`modal ${modalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">This is a DaisyUI modal. Press ESC key or click outside to close.</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setModalOpen(false)}>Close</button>
            <button className="btn btn-primary" onClick={() => setModalOpen(false)}>Accept</button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <button>close</button>
        </div>
      </dialog>

      {/* Progress and Loading */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Progress & Loading</h3>
          <div className="space-y-4">
            <div>
              <span className="text-sm">Progress Bar</span>
              <progress className="progress progress-primary w-full" value={70} max="100"></progress>
            </div>
            <div>
              <span className="text-sm">Loading Spinner</span>
              <div className="flex gap-2 mt-2">
                <span className="loading loading-spinner loading-sm"></span>
                <span className="loading loading-dots loading-md"></span>
                <span className="loading loading-ring loading-lg"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges and Indicators */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Badges & Indicators</h3>
          <div className="flex flex-wrap gap-2">
            <div className="badge badge-primary">Primary</div>
            <div className="badge badge-secondary">Secondary</div>
            <div className="badge badge-accent">Accent</div>
            <div className="badge badge-ghost">Ghost</div>
            <div className="badge badge-outline">Outline</div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="indicator">
              <span className="indicator-item badge badge-secondary">new</span>
              <button className="btn">Notifications</button>
            </div>
            <div className="avatar online">
              <div className="w-12 rounded-full">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" alt="Avatar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}