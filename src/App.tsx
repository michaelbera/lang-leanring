import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { DaisyUIShowcase } from './components/DaisyUIShowcase'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation Bar */}
      <div className="navbar bg-base-300 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Vite + React + DaisyUI</a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero min-h-[50vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="flex justify-center gap-8 mb-8">
              <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="h-24 w-24 hover:scale-110 transition-transform" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="h-24 w-24 hover:scale-110 transition-transform animate-spin" alt="React logo" />
              </a>
            </div>
            <h1 className="text-5xl font-bold">Vite + React</h1>
            <p className="py-6">A modern React development environment with Vite, React, TypeScript, Tailwind CSS, and DaisyUI.</p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Counter Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Interactive Counter</h2>
              <p>Test the React state management with this counter.</p>
              <div className="card-actions justify-center">
                <button 
                  className="btn btn-secondary btn-lg"
                  onClick={() => setCount((count) => count + 1)}
                >
                  Count: {count}
                </button>
              </div>
            </div>
          </div>

          {/* DaisyUI Components Showcase */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">DaisyUI Components</h2>
              <p>Explore beautiful UI components built with Tailwind CSS.</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-primary btn-sm">Primary</button>
                <button className="btn btn-secondary btn-sm">Secondary</button>
                <button className="btn btn-accent btn-sm">Accent</button>
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Theme Selector</h2>
              <p>DaisyUI comes with multiple themes out of the box.</p>
              <select className="select select-bordered w-full max-w-xs">
                <option>Light</option>
                <option>Dark</option>
                <option>Cupcake</option>
                <option>Bumblebee</option>
                <option>Emerald</option>
                <option>Corporate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="alert alert-info mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Edit <code>src/App.tsx</code> and save to test HMR (Hot Module Replacement)</span>
        </div>

        {/* DaisyUI Components Showcase */}
        <DaisyUIShowcase />
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded mt-16">
        <div className="grid grid-flow-col gap-4">
          <a href="https://vite.dev" className="link link-hover" target="_blank">Vite Documentation</a>
          <a href="https://react.dev" className="link link-hover" target="_blank">React Documentation</a>
          <a href="https://daisyui.com" className="link link-hover" target="_blank">DaisyUI Documentation</a>
        </div>
      </footer>
    </div>
  )
}

export default App
