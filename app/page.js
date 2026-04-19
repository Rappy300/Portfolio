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

  if (!data) return <div className="page-shell">Loading...</div>

  return (
    <div className="page-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Portfolio + Resume Builder</p>
          <h1 contentEditable={isAdmin} onBlur={e => updateProfile('name', e.target.textContent)}>{data.profile.name}</h1>
          <p className="hero-subtitle" contentEditable={isAdmin} onBlur={e => updateProfile('title', e.target.textContent)}>{data.profile.title}</p>
          <p className="hero-copy" contentEditable={isAdmin} onBlur={e => updateProfile('about', e.target.textContent)}>{data.profile.about}</p>
          <div className="hero-actions">
            <Link href="/resume" className="button">View Resume</Link>
            {isAdmin ? <Link href="/dashboard" className="button button-secondary">Edit Dashboard</Link> : <Link href="/login" className="button button-secondary">Admin Login</Link>}
          </div>
        </div>
        <div className="hero-panel">
          <div className="profile-card">
            <div className="avatar">R</div>
            <p className="profile-name">{data.profile.name}</p>
            <p className="profile-title">{data.profile.title}</p>
            <div className="social-links">
              {Object.entries(data.profile.social).map(([key, value]) => value ? (
                <a key={key} href={value} target="_blank" rel="noreferrer">{key}</a>
              ) : null)}
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section-card">
          <h2>Skills</h2>
          <div className="skills-grid">
            {data.skills.map((skill, index) => (
              <div className="skill-card" key={skill.id || index}>
                <strong contentEditable={isAdmin} onBlur={e => updateItem('skills', index, 'name', e.target.textContent)}>{skill.name}</strong>
                <div className="skill-bar">
                  <div className="skill-fill" style={{ width: `${skill.percentage}%` }} />
                </div>
                <span>{skill.percentage}%</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section-card">
          <div className="section-header">
            <h2>Projects</h2>
            {isAdmin && <span className="hint">Edit project title or description directly</span>}
          </div>
          <div className="project-grid">
            {data.projects.map((project, index) => (
              <div className="project-card" key={project.id || index}>
                <h3 contentEditable={isAdmin} onBlur={e => updateItem('projects', index, 'title', e.target.textContent)}>{project.title}</h3>
                <p contentEditable={isAdmin} onBlur={e => updateItem('projects', index, 'description', e.target.textContent)}>{project.description}</p>
                {project.tech?.length > 0 && <p className="project-tech">{project.tech.join(' • ')}</p>}
                <div className="project-links">
                  {project.link && <a href={project.link} target="_blank" rel="noreferrer">Live</a>}
                  {project.github && <a href={project.github} target="_blank" rel="noreferrer">GitHub</a>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-card">
          <h2>Resume</h2>
          <p>{data.resume.summary}</p>
          <div className="resume-grid">
            {data.resume.experience.map((exp, index) => (
              <div key={index} className="resume-card">
                <h3>{exp.title}</h3>
                <p>{exp.company} · {exp.year}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}