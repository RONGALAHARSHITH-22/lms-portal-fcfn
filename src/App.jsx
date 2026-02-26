
import { useMemo, useState } from 'react'
import './App.css'
import teelEdgeLogo from './assets/teel-edge-logo.svg'

const ADMIN_SIGNUP_KEY = 'FASD'

const COURSES = [
  {
    id: 'react-ops',
    title: 'Advanced React Ops',
    category: 'Frontend',
    description: 'Master hooks, performance, and scalable React architecture.',
    materials: [
      { id: 'm1', title: 'Hooks Deep Dive Notes', type: 'PDF' },
      { id: 'm2', title: 'Rendering Performance Checklist', type: 'Guide' },
    ],
    assignments: [
      { id: 'a1', title: 'Build reusable hooks library', dueDate: '2026-03-08' },
      { id: 'a2', title: 'Optimize dashboard render path', dueDate: '2026-03-15' },
    ],
  },
  {
    id: 'postgres-dive',
    title: 'PostgreSQL Deep Dive',
    category: 'Database',
    description: 'Query optimization, indexing strategy, and data modeling.',
    materials: [
      { id: 'm3', title: 'Indexing Patterns Handbook', type: 'PDF' },
      { id: 'm4', title: 'Explain Analyze Lab', type: 'Worksheet' },
    ],
    assignments: [
      { id: 'a3', title: 'Design optimized schema', dueDate: '2026-03-10' },
      { id: 'a4', title: 'Tune slow analytics query', dueDate: '2026-03-19' },
    ],
  },
  {
    id: 'node-nav',
    title: 'Node.js Navigation',
    category: 'Backend',
    description: 'Build secure APIs with auth, validation, and observability.',
    materials: [{ id: 'm5', title: 'API Security Playbook', type: 'Guide' }],
    assignments: [{ id: 'a5', title: 'Implement JWT auth flow', dueDate: '2026-03-12' }],
  },
]

const normalizeEmail = (email) => email.trim().toLowerCase()

function App() {
  const [activePage, setActivePage] = useState('home')
  const [selectedRole, setSelectedRole] = useState('student')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [authView, setAuthView] = useState('login')
  const [authMessage, setAuthMessage] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    adminKey: '',
  })

  const [accounts, setAccounts] = useState([])
  const [enrollments, setEnrollments] = useState([])

  const isAdmin = currentUser?.role === 'admin'

  const studentEnrollments = useMemo(() => {
    if (!currentUser || isAdmin) return []
    return enrollments.filter((e) => e.studentEmail === currentUser.email)
  }, [enrollments, currentUser, isAdmin])

  const studentStats = useMemo(() => {
    if (!currentUser || isAdmin) return { total: 0, completed: 0 }

    let total = 0
    let completed = 0

    for (const enr of studentEnrollments) {
      const course = COURSES.find((c) => c.id === enr.courseId)
      if (!course) continue
      total += course.assignments.length
      completed += enr.completedAssignmentIds.length
    }

    return { total, completed }
  }, [studentEnrollments, currentUser, isAdmin])

  const courseEnrollmentCounts = useMemo(() => {
    return COURSES.reduce((acc, course) => {
      acc[course.id] = enrollments.filter((e) => e.courseId === course.id).length
      return acc
    }, {})
  }, [enrollments])

  const totalStudents = accounts.filter((a) => a.role === 'student').length
  const totalCompletedAssignments = enrollments.reduce((acc, e) => acc + e.completedAssignmentIds.length, 0)

  const updateLoginForm = (event) => {
    const { name, value } = event.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const updateSignupForm = (event) => {
    const { name, value } = event.target
    setSignupForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = (event) => {
    event.preventDefault()

    const name = signupForm.name.trim()
    const email = normalizeEmail(signupForm.email)
    const password = signupForm.password.trim()
    const role = signupForm.role

    if (!name || !email || !password) {
      setAuthMessage('Please complete all required fields.')
      return
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthMessage('Password and confirm password must match.')
      return
    }

    const existing = accounts.find((account) => account.email === email)

    if (role === 'student' && existing?.role === 'student') {
      setAuthMessage('This student is already registered. Please login instead.')
      return
    }

    if (existing) {
      setAuthMessage(`An account with this email already exists as ${existing.role}.`)
      return
    }

    if (role === 'admin' && signupForm.adminKey !== ADMIN_SIGNUP_KEY) {
      setAuthMessage('Invalid admin signup key.')
      return
    }

    setAccounts((prev) => [...prev, { name, email, password, role }])
    setSignupForm({ name: '', email: '', password: '', confirmPassword: '', role: 'student', adminKey: '' })
    setAuthView('login')
    setSelectedRole(role)
    setAuthMessage(`${role === 'admin' ? 'Admin' : 'Student'} signup successful. Please login.`)
  }

  const handleLogin = (event) => {
    event.preventDefault()

    const email = normalizeEmail(loginForm.email)
    const password = loginForm.password.trim()

    if (!email || !password) {
      setAuthMessage('Please enter both email and password.')
      return
    }

    const account = accounts.find((a) => a.email === email)

    if (!account) {
      setAuthMessage('No account found with this email. Please signup first.')
      return
    }

    if (account.role !== selectedRole) {
      setAuthMessage(`This account is ${account.role}. Please pick ${account.role} role.`)
      return
    }

    if (account.password !== password) {
      setAuthMessage('Incorrect password.')
      return
    }

    setCurrentUser(account)
    setIsAuthenticated(true)
    setActivePage('home')
    setLoginForm({ email: '', password: '' })
    setAuthMessage('')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setAuthView('login')
    setActivePage('home')
    setAuthMessage('You have been logged out.')
  }

  const getEnrollment = (studentEmail, courseId) =>
    enrollments.find((e) => e.studentEmail === studentEmail && e.courseId === courseId)

  const handleEnroll = (courseId) => {
    if (!currentUser || isAdmin) return
    if (getEnrollment(currentUser.email, courseId)) return

    setEnrollments((prev) => [...prev, { studentEmail: currentUser.email, courseId, completedAssignmentIds: [] }])
  }

  const toggleAssignmentCompletion = (courseId, assignmentId) => {
    if (!currentUser || isAdmin) return

    setEnrollments((prev) =>
      prev.map((e) => {
        if (e.studentEmail !== currentUser.email || e.courseId !== courseId) return e

        const done = e.completedAssignmentIds.includes(assignmentId)
        return {
          ...e,
          completedAssignmentIds: done
            ? e.completedAssignmentIds.filter((id) => id !== assignmentId)
            : [...e.completedAssignmentIds, assignmentId],
        }
      }),
    )
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
            <p className="auth-subtitle">Login or signup to access the portal.</p>
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
                <div>
                  <p className="auth-field-label">Role</p>
                  <div className="role-switch" role="tablist" aria-label="Select role">
                    <button
                      type="button"
                      className={`role-switch-option ${selectedRole === 'admin' ? 'role-switch-option-active' : ''}`}
                      onClick={() => setSelectedRole('admin')}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      className={`role-switch-option ${selectedRole === 'student' ? 'role-switch-option-active' : ''}`}
                      onClick={() => setSelectedRole('student')}
                    >
                      Student
                    </button>
                  </div>
                </div>

                <input className="ship-input" type="email" name="email" value={loginForm.email} onChange={updateLoginForm} placeholder="Email" />
                <input className="ship-input" type="password" name="password" value={loginForm.password} onChange={updateLoginForm} placeholder="Password" />
                <button type="submit" className="auth-submit">Login</button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleSignup}>
                <div>
                  <p className="auth-field-label">Signup Role</p>
                  <div className="role-switch" role="tablist" aria-label="Select signup role">
                    <button
                      type="button"
                      className={`role-switch-option ${signupForm.role === 'student' ? 'role-switch-option-active' : ''}`}
                      onClick={() => setSignupForm((prev) => ({ ...prev, role: 'student', adminKey: '' }))}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      className={`role-switch-option ${signupForm.role === 'admin' ? 'role-switch-option-active' : ''}`}
                      onClick={() => setSignupForm((prev) => ({ ...prev, role: 'admin' }))}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <input className="ship-input" type="text" name="name" value={signupForm.name} onChange={updateSignupForm} placeholder="Full Name" />
                <input className="ship-input" type="email" name="email" value={signupForm.email} onChange={updateSignupForm} placeholder="Email" />
                <input className="ship-input" type="password" name="password" value={signupForm.password} onChange={updateSignupForm} placeholder="Password" />
                <input
                  className="ship-input"
                  type="password"
                  name="confirmPassword"
                  value={signupForm.confirmPassword}
                  onChange={updateSignupForm}
                  placeholder="Confirm Password"
                />

                {signupForm.role === 'admin' ? (
                  <input className="ship-input" type="password" name="adminKey" value={signupForm.adminKey} onChange={updateSignupForm} placeholder="Admin Signup Key" />
                ) : null}

                <button type="submit" className="auth-submit">Signup</button>
              </form>
            )}
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="ocean text-white min-h-screen font-sans">
      <nav className="p-6 flex justify-between items-center border-b border-white/10">
        <div className="bg-white/95 rounded-lg px-3 py-2">
          <img src={teelEdgeLogo} alt="TealEdge logo" className="h-12 w-auto" />
        </div>
        <div className="space-x-8 flex items-center">
          <button onClick={() => setActivePage('home')} className={`nav-link ${activePage === 'home' ? 'nav-link-active' : ''}`}>
            {isAdmin ? 'Admin Home' : 'Student Home'}
          </button>
          {isAdmin ? (
            <button onClick={() => setActivePage('fleet')} className={`nav-link ${activePage === 'fleet' ? 'nav-link-active' : ''}`}>
              Fleet Command
            </button>
          ) : null}
          <button onClick={() => setActivePage('cabin')} className={`nav-link ${activePage === 'cabin' ? 'nav-link-active' : ''}`}>
            Profile
          </button>
          <button onClick={handleLogout} className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-slate-200 transition">
            Logout
          </button>
        </div>
      </nav>

      {isAdmin && activePage === 'home' ? (
        <main className="max-w-7xl mx-auto py-16 px-6">
          <header className="mb-12">
            <h2 className="text-4xl font-extrabold mb-2">Admin Command Center</h2>
            <p className="text-slate-400">See who enrolled and assignment completion progress.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <section className="ship-card p-8 rounded-3xl">
              <p className="text-slate-400 text-sm">Active Courses</p>
              <h3 className="text-4xl font-extrabold mt-2">{COURSES.length}</h3>
            </section>
            <section className="ship-card p-8 rounded-3xl ship-delay-1">
              <p className="text-slate-400 text-sm">Total Students</p>
              <h3 className="text-4xl font-extrabold mt-2">{totalStudents}</h3>
            </section>
            <section className="ship-card p-8 rounded-3xl">
              <p className="text-slate-400 text-sm">Assignments Completed</p>
              <h3 className="text-4xl font-extrabold mt-2">{totalCompletedAssignments}</h3>
            </section>
          </div>
        </main>
      ) : null}

      {!isAdmin && activePage === 'home' ? (
        <main className="max-w-7xl mx-auto py-16 px-6">
          <header className="mb-12">
            <h2 className="text-4xl font-extrabold mb-2">Student Portal</h2>
            <p className="text-slate-400">Enroll in courses and complete assignments with study materials.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <section className="ship-card p-8 rounded-3xl">
              <p className="text-slate-400 text-sm">Enrolled Courses</p>
              <h3 className="text-4xl font-extrabold mt-2">{studentEnrollments.length}</h3>
            </section>
            <section className="ship-card p-8 rounded-3xl ship-delay-1">
              <p className="text-slate-400 text-sm">Assignments Due</p>
              <h3 className="text-4xl font-extrabold mt-2">{studentStats.total - studentStats.completed}</h3>
            </section>
            <section className="ship-card p-8 rounded-3xl">
              <p className="text-slate-400 text-sm">Progress</p>
              <h3 className="text-4xl font-extrabold mt-2">
                {studentStats.total ? `${Math.round((studentStats.completed / studentStats.total) * 100)}%` : '0%'}
              </h3>
            </section>
          </div>

          <section className="space-y-6">
            {COURSES.map((course) => {
              const enrollment = getEnrollment(currentUser.email, course.id)
              const enrolled = Boolean(enrollment)

              return (
                <article key={course.id} className="ship-card p-8 rounded-3xl">
                  <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wider">{course.category}</p>
                      <h3 className="text-2xl font-bold">{course.title}</h3>
                    </div>
                    <button type="button" className="auth-submit" onClick={() => handleEnroll(course.id)} disabled={enrolled}>
                      {enrolled ? 'Enrolled' : 'Enroll'}
                    </button>
                  </div>

                  <p className="text-slate-300 mb-5">{course.description}</p>

                  {enrolled ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Assignments</h4>
                        <div className="space-y-3">
                          {course.assignments.map((assignment) => {
                            const done = enrollment.completedAssignmentIds.includes(assignment.id)

                            return (
                              <div key={assignment.id} className="cabin-log assignment-row">
                                <div>
                                  <p className="font-semibold">{assignment.title}</p>
                                  <p className="text-slate-400 text-xs">Due: {assignment.dueDate}</p>
                                </div>
                                <button
                                  type="button"
                                  className={`assignment-toggle ${done ? 'assignment-toggle-done' : ''}`}
                                  onClick={() => toggleAssignmentCompletion(course.id, assignment.id)}
                                >
                                  {done ? 'Completed' : 'Mark Complete'}
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-3">Study Materials</h4>
                        <div className="space-y-3">
                          {course.materials.map((material) => (
                            <div key={material.id} className="cabin-log">
                              <p className="font-semibold">{material.title}</p>
                              <p className="text-slate-400 text-xs">Type: {material.type}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">Enroll to unlock assignments and study materials.</p>
                  )}
                </article>
              )
            })}
          </section>
        </main>
      ) : null}

      {isAdmin && activePage === 'fleet' ? (
        <main className="max-w-7xl mx-auto py-16 px-6">
          <header className="mb-12">
            <h2 className="text-4xl font-extrabold mb-2">Course Enrollment and Assignment Status</h2>
            <p className="text-slate-400">Admin visibility for each enrolled student.</p>
          </header>

          <div className="space-y-6">
            {COURSES.map((course) => {
              const courseEnrollments = enrollments.filter((e) => e.courseId === course.id)

              return (
                <section key={course.id} className="ship-card p-8 rounded-3xl">
                  <div className="flex justify-between items-center mb-5 gap-3 flex-wrap">
                    <h3 className="text-2xl font-bold">{course.title}</h3>
                    <p className="text-slate-300 text-sm">Enrolled: {courseEnrollmentCounts[course.id]}</p>
                  </div>

                  {courseEnrollments.length === 0 ? (
                    <p className="text-slate-400 text-sm">No students enrolled yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {courseEnrollments.map((enrollment) => {
                        const student = accounts.find((a) => a.email === enrollment.studentEmail)
                        return (
                          <div key={`${enrollment.studentEmail}-${course.id}`} className="admin-row">
                            <div>
                              <p className="font-semibold">{student?.name || enrollment.studentEmail}</p>
                              <p className="text-slate-400 text-xs">{enrollment.studentEmail}</p>
                            </div>
                            <p className="text-slate-200 text-sm">
                              Assignments completed: {enrollment.completedAssignmentIds.length}/{course.assignments.length}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </main>
      ) : null}

      {activePage === 'cabin' ? (
        <main className="max-w-7xl mx-auto py-16 px-6">
          <header className="mb-12">
            <h2 className="text-4xl font-extrabold mb-2">{isAdmin ? 'Admin Profile' : 'Student Profile'}</h2>
          </header>

          <section className="ship-card p-8 rounded-3xl">
            <p className="mb-2"><span className="text-slate-400">Name:</span> {currentUser?.name}</p>
            <p className="mb-2"><span className="text-slate-400">Email:</span> {currentUser?.email}</p>
            <p className="mb-2"><span className="text-slate-400">Role:</span> {currentUser?.role}</p>
            {!isAdmin ? (
              <p><span className="text-slate-400">Assignments:</span> {studentStats.completed}/{studentStats.total || 0} completed</p>
            ) : null}
          </section>
        </main>
      ) : null}
    </div>
  )
}

export default App
