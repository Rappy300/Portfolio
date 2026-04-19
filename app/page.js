'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [data, setData] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)

    const admin = localStorage.getItem('admin')
    setIsAdmin(!!admin)
  }, [])

  const saveData = async (newData) => {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    })
  }

  const updateProfile = (field, value) => {
    const updated = { ...data, profile: { ...data.profile, [field]: value } }
    setData(updated)
    if (isAdmin) saveData(updated)
  }

  const updateItem = (list, index, field, value) => {
    const updatedList = [...data[list]]
    updatedList[index] = { ...updatedList[index], [field]: value }
    const updated = { ...data, [list]: updatedList }
    setData(updated)
    if (isAdmin) saveData(updated)
  }

  if (!data) return <div className="page-shell loading-shell">Loading...</div>

  return (
    <div className="page-shell">
      <header className="topbar fade-in">
        <div className="topbar-brand">
          <span>Hire me</span>
          <strong>@{data.profile.name.split(' ')[0].toLowerCase()}</strong>
        </div>
        <div className="topbar-actions">
          {Object.entries(data.profile.social).map(([key, value]) => value ? (
            <a key={key} href={value} target="_blank" rel="noreferrer">{key}</a>
          ) : null)}
          <Link href="/resume" className="button button-secondary">Contact</Link>
        </div>
      </header>

      <section className="hero hero-landing slide-up">
        <div className="hero-copy card-glow">
          <p className="eyebrow">Portfolio + Resume Builder</p>
          <h1 contentEditable={isAdmin} onBlur={e => updateProfile('title', e.target.textContent)}>{data.profile.title || `Designer, Developer & Director`}</h1>
          <p className="hero-subtitle" contentEditable={isAdmin} onBlur={e => updateProfile('about', e.target.textContent)}>{data.profile.about}</p>
          <div className="hero-actions">
            <Link href="/resume" className="button">View Resume</Link>
            {isAdmin ? <Link href="/dashboard" className="button button-secondary">Dashboard</Link> : <Link href="/login" className="button button-secondary">Admin Login</Link>}
          </div>
          <div className="hero-stats">
            <div className="stat-card"><strong>{data.projects.length}+</strong><span>Projects</span></div>
            <div className="stat-card"><strong>{data.skills.length}+</strong><span>Skills</span></div>
            <div className="stat-card"><strong>{data.resume.experience.length}+</strong><span>Experience</span></div>
          </div>
        </div>

        <div className="hero-panel hero-visual card-glow">
          <div className="avatar large">{data.profile.name.charAt(0)}</div>
          <div className="hero-profile">
            <p className="profile-name" contentEditable={isAdmin} onBlur={e => updateProfile('name', e.target.textContent)}>{data.profile.name}</p>
            <p className="profile-title">{data.profile.title}</p>
          </div>
          <div className="hero-overlay" />
        </div>
      </section>

      <main>
        <section className="section-card services-section fade-in">
          <div className="section-header">
            <div>
              <h2>What I can do to help you?</h2>
              <p className="section-copy">Create polished portfolios, modern interfaces, and resume systems that move your brand forward.</p>
            </div>
          </div>
          <div className="services-grid">
            {data.skills.slice(0, 3).map((skill, index) => (
              <div className="service-card" key={skill.id || index}>
                <div className="service-icon">?</div>
                <h3 contentEditable={isAdmin} onBlur={e => updateItem('skills', index, 'name', e.target.textContent)}>{skill.name}</h3>
                <p>{skill.percentage}% proficiency</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-card portfolio-section fade-in">
          <div className="section-header">
            <div>
              <h2>Latest Portfolio</h2>
              <p className="section-copy">A showcase of recent work tuned for modern branding and product launches.</p>
            </div>
          </div>
          <div className="portfolio-grid">
            {data.projects.map((project, index) => (
              <div className="portfolio-card" key={project.id || index}>
                <div className="portfolio-thumb" />
                <div className="portfolio-content">
                  <h3 contentEditable={isAdmin} onBlur={e => updateItem('projects', index, 'title', e.target.textContent)}>{project.title}</h3>
                  <p contentEditable={isAdmin} onBlur={e => updateItem('projects', index, 'description', e.target.textContent)}>{project.description}</p>
                  <div className="portfolio-meta">
                    {project.tech?.map((tech, idx) => <span key={idx}>{tech}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-card about-section fade-in">
          <div className="about-inner">
            <div>
              <p className="eyebrow">Bit about me</p>
              <h2>Designer, developer & director</h2>
              <p contentEditable={isAdmin} onBlur={e => updateProfile('about', e.target.textContent)}>{data.profile.about}</p>
              <Link href="/resume" className="button">Download CV</Link>
            </div>
            <div className="about-visual card-glow">
              <div className="about-chip">Latest Works</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
