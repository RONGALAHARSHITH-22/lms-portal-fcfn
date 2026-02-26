import { useState } from 'react'
import './App.css'
import teelEdgeLogo from './assets/teel-edge-logo.svg'

function App() {
  const [boarding, setBoarding] = useState(false)
  const [currentShip, setCurrentShip] = useState('')
  const [activePage, setActivePage] = useState('fleet')

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authView, setAuthView] = useState('login')
  const [authMessage, setAuthMessage] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  const boardShip = (shipName) => {
    setBoarding(true)

    window.setTimeout(() => {
      setCurrentShip(shipName)
      setBoarding(false)
    }, 1200)
  }

  const openFleetAdmin = () => {
    setActivePage('fleet')
    setCurrentShip('')
  }

  const openMyCabin = () => {
    setActivePage('cabin')
    setCurrentShip('')
  }

  const openNewShip = () => {
    setActivePage('new-ship')
    setCurrentShip('')
  }

  const updateLoginForm = (event) => {
    const { name, value } = event.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const updateSignupForm = (event) => {
    const { name, value } = event.target
    setSignupForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = (event) => {
    event.preventDefault()

    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setAuthMessage('Please enter both email and password.')
      return
    }

    setAuthMessage('')
    setIsAuthenticated(true)
    setActivePage('fleet')
    setCurrentShip('')
    setLoginForm({ email: '', password: '' })
  }

  const handleSignup = (event) => {
    event.preventDefault()

    if (!signupForm.name.trim() || !signupForm.email.trim() || !signupForm.password.trim()) {
      setAuthMessage('Please complete all required fields.')
      return
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthMessage('Password and confirm password must match.')
      return
    }

    setSignupForm({ name: '', email: '', password: '', confirmPassword: '' })
    setAuthView('login')
    setAuthMessage('Signup successful. Please log in to continue.')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAuthView('login')
    setAuthMessage('You have been logged out.')
    setLoginForm({ email: '', password: '' })
    setSignupForm({ name: '', email: '', password: '', confirmPassword: '' })
  }

  if (!isAuthenticated) {
    return (
      <div className="ocean text-white min-h-screen auth-layout">
        <main className="auth-shell">
          <div className="auth-brand">
            <div className="bg-white rounded-lg px-3 py-2 inline-flex">
              <img src={teelEdgeLogo} alt="TealEdge logo" className="h-14 w-auto" />
            </div>
            <h1 className="auth-title">TealEdge Fleet Portal</h1>
            <p className="auth-subtitle">Sign in to command your fleet or create a new captain account.</p>
          </div>

          <section className="ship-card p-8 rounded-3xl auth-card">
            <div className="auth-tabs" role="tablist" aria-label="Authentication tabs">
              <button
                type="button"
                className={`auth-tab ${authView === 'login' ? 'auth-tab-active' : ''}`}
                onClick={() => {
                  setAuthView('login')
                  setAuthMessage('')
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={`auth-tab ${authView === 'signup' ? 'auth-tab-active' : ''}`}
                onClick={() => {
                  setAuthView('signup')
                  setAuthMessage('')
                }}
              >
                Signup
              </button>
            </div>

            {authMessage ? <p className="auth-message">{authMessage}</p> : null}

            {authView === 'login' ? (
              <form className="auth-form" onSubmit={handleLogin}>
                <label className="block">
                  <span className="text-sm text-slate-300">Email</span>
                  <input
                    className="ship-input mt-2 w-full"
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={updateLoginForm}
                    placeholder="captain@tealedge.com"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-300">Password</span>
                  <input
                    className="ship-input mt-2 w-full"
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={updateLoginForm}
                    placeholder="Enter your password"
                  />
                </label>

                <button type="submit" className="auth-submit">
                  Login
                </button>

                <p className="auth-switch">
                  New here?{' '}
                  <button
                    type="button"
                    className="auth-switch-link"
                    onClick={() => {
                      setAuthView('signup')
                      setAuthMessage('')
                    }}
                  >
                    Create an account
                  </button>
                </p>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleSignup}>
                <label className="block">
                  <span className="text-sm text-slate-300">Full Name</span>
                  <input
                    className="ship-input mt-2 w-full"
                    type="text"
                    name="name"
                    value={signupForm.name}
                    onChange={updateSignupForm}
                    placeholder="Captain Name"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-300">Email</span>
                  <input
                    className="ship-input mt-2 w-full"
                    type="email"
                    name="email"
                    value={signupForm.email}
                    onChange={updateSignupForm}
                    placeholder="captain@tealedge.com"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-300">Password</span>
                  <input
                    className="ship-input mt-2 w-full"
                    type="password"
                    name="password"
                    value={signupForm.password}
                    onChange={updateSignupForm}
                    placeholder="Create a password"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-300">Confirm Password</span>
                  <input
                    className="ship-input mt-2 w-full"
                    type="password"
                    name="confirmPassword"
                    value={signupForm.confirmPassword}
                    onChange={updateSignupForm}
                    placeholder="Repeat your password"
                  />
                </label>

                <button type="submit" className="auth-submit">
                  Signup
                </button>

                <p className="auth-switch">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="auth-switch-link"
                    onClick={() => {
                      setAuthView('login')
                      setAuthMessage('')
                    }}
                  >
                    Login here
                  </button>
                </p>
              </form>
            )}
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="ocean text-white min-h-screen font-sans">
      <div
        id="boarding-overlay"
        className={`fixed inset-0 z-50 pointer-events-none transition-all duration-700 bg-slate-900/90 flex items-center justify-center ${
          boarding ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4" aria-hidden="true"></div>
          <h2 className="text-2xl font-bold tracking-widest animate-pulse">BOARDING VESSEL...</h2>
        </div>
      </div>

      <nav className="p-6 flex justify-between items-center border-b border-white/10">
        <div className="bg-white/95 rounded-lg px-3 py-2">
          <img src={teelEdgeLogo} alt="TealEdge logo" className="h-12 w-auto" />
        </div>
        <div className="space-x-8 flex items-center">
          <button
            onClick={openFleetAdmin}
            className={`nav-link ${activePage === 'fleet' ? 'nav-link-active' : ''}`}
          >
            Fleet Command (Admin)
          </button>
          <button
            onClick={openMyCabin}
            className={`nav-link ${activePage === 'cabin' ? 'nav-link-active' : ''}`}
          >
            My Cabin (Profile)
          </button>
          <button onClick={openNewShip} className="bg-blue-600 px-5 py-2 rounded-full hover:bg-blue-500 transition">
            Launch New Ship
          </button>
          <button onClick={handleLogout} className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-slate-200 transition">
            Logout
          </button>
        </div>
      </nav>

      {activePage === 'fleet' && !currentShip ? (
        <main id="fleet-dashboard" className="max-w-7xl mx-auto py-16 px-6">
          <header className="mb-12">
            <h2 className="text-4xl font-extrabold mb-2">Course Fleet</h2>
            <p className="text-slate-400">Select a vessel to manage your curriculum and students.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="ship-card p-8 rounded-3xl cursor-pointer group">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Full Stack</span>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center" aria-hidden="true"></div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Advanced React Ops</h3>
              <p className="text-slate-400 text-sm mb-6">
                Mastering hooks, performance, and fleet-scale architecture.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="text-sm">
                  <span className="block font-bold">42 Students</span>
                  <span className="text-slate-500 text-xs">On board</span>
                </div>
                <button
                  onClick={() => boardShip('Advanced React Ops')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black px-4 py-2 rounded-xl font-bold text-sm"
                >
                  Board Ship
                </button>
              </div>
            </div>

            <div className="ship-card p-8 rounded-3xl cursor-pointer group ship-delay-1">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Database</span>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center" aria-hidden="true"></div>
              </div>
              <h3 className="text-2xl font-bold mb-2">PostgreSQL Deep Dive</h3>
              <p className="text-slate-400 text-sm mb-6">Query optimization and relational data charting.</p>
              <div className="flex items-center justify-between mt-auto">
                <div className="text-sm">
                  <span className="block font-bold">128 Students</span>
                  <span className="text-slate-500 text-xs">On board</span>
                </div>
                <button
                  onClick={() => boardShip('PostgreSQL Deep Dive')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black px-4 py-2 rounded-xl font-bold text-sm"
                >
                  Board Ship
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : null}

      {activePage === 'fleet' && currentShip ? (
        <main id="course-interior" className="max-w-7xl mx-auto py-16 px-6">
          <header className="mb-12">
            <h2 id="current-ship-title" className="text-4xl font-extrabold mb-2">
              {currentShip}
            </h2>
            <p className="text-slate-400">You are now inside this vessel.</p>
          </header>
          <button onClick={openFleetAdmin} className="bg-white text-black px-4 py-2 rounded-xl font-bold text-sm">
            Return to Fleet
          </button>
        </main>
      ) : null}

      {activePage === 'cabin' ? (
        <main id="my-cabin-page" className="max-w-7xl mx-auto py-16 px-6">
          <header className="mb-12">
            <h2 className="text-4xl font-extrabold mb-2">My Cabin</h2>
            <p className="text-slate-400">Manage your captain profile, assignments, and voyage settings.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <section className="ship-card p-8 rounded-3xl md:col-span-1">
              <div className="w-20 h-20 rounded-full bg-cyan-400/30 flex items-center justify-center text-3xl mb-5">
                [Compass]
              </div>
              <h3 className="text-2xl font-bold">Captain Harsh</h3>
              <p className="text-slate-400 text-sm mt-1 mb-6">Fleet Admin - TealEdge Academy</p>
              <div className="text-sm space-y-2">
                <p>
                  <span className="text-slate-400">Email:</span> captain@tealedge.com
                </p>
                <p>
                  <span className="text-slate-400">Role:</span> Curriculum Commander
                </p>
              </div>
            </section>

            <section className="ship-card p-8 rounded-3xl md:col-span-2 ship-delay-1">
              <h3 className="text-2xl font-bold mb-4">Cabin Log</h3>
              <div className="space-y-4 text-sm">
                <div className="cabin-log">
                  <p className="font-semibold">Fleet review completed</p>
                  <p className="text-slate-400">2 minutes ago - Advanced React Ops has 4 pending submissions.</p>
                </div>
                <div className="cabin-log">
                  <p className="font-semibold">New cadet onboarded</p>
                  <p className="text-slate-400">25 minutes ago - PostgreSQL Deep Dive roster updated to 129.</p>
                </div>
                <div className="cabin-log">
                  <p className="font-semibold">Route configuration synced</p>
                  <p className="text-slate-400">1 hour ago - Notifications routed to cabin inbox.</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      ) : null}

      {activePage === 'new-ship' ? (
        <main id="new-ship-page" className="max-w-5xl mx-auto py-16 px-6">
          <header className="mb-10">
            <h2 className="text-4xl font-extrabold mb-2">Launch New Ship</h2>
            <p className="text-slate-400">Create a new course vessel and deploy it to your fleet.</p>
          </header>

          <section className="ship-card p-8 rounded-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm text-slate-300">Ship Name</span>
                <input className="ship-input mt-2 w-full" type="text" placeholder="e.g. Node.js Navigation" />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Category</span>
                <select className="ship-input mt-2 w-full" defaultValue="full-stack">
                  <option value="full-stack">Full Stack</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                </select>
              </label>

              <label className="block md:col-span-2">
                <span className="text-sm text-slate-300">Mission Brief</span>
                <textarea
                  className="ship-input mt-2 w-full min-h-28"
                  placeholder="Write the course objective and expected outcomes..."
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Capacity</span>
                <input className="ship-input mt-2 w-full" type="number" defaultValue="60" min="1" />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Launch Date</span>
                <input className="ship-input mt-2 w-full" type="date" />
              </label>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="bg-blue-600 px-5 py-2 rounded-xl hover:bg-blue-500 transition font-semibold">
                Create Ship
              </button>
              <button onClick={openFleetAdmin} className="bg-white text-black px-5 py-2 rounded-xl font-semibold">
                Back to Fleet
              </button>
            </div>
          </section>
        </main>
      ) : null}
    </div>
  )
}

export default App
