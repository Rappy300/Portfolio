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

  const saveData = async () => {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

  const updateProfile = (field, value) => {
    setData({...data, profile: {...data.profile, [field]: value}})
    if (isAdmin) saveData()
  }

  const updateSkill = (i, field, value) => {
    const newSkills = [...data.skills]
    newSkills[i][field] = value
    setData({...data, skills: newSkills})
    if (isAdmin) saveData()
  }

  const updateProject = (i, field, value) => {
    const newProjects = [...data.projects]
    newProjects[i][field] = value
    setData({...data, projects: newProjects})
    if (isAdmin) saveData()
  }

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <header>
        <h1 contentEditable={isAdmin} onBlur={e => updateProfile('name', e.target.textContent)}>{data.profile.name}</h1>
        <p contentEditable={isAdmin} onBlur={e => updateProfile('title', e.target.textContent)}>{data.profile.title}</p>
        {isAdmin && <Link href="/dashboard">Dashboard</Link>}
      </header>
      <section>
        <h2>About Me</h2>
        <p contentEditable={isAdmin} onBlur={e => updateProfile('about', e.target.textContent)}>{data.profile.about}</p>
      </section>
      <section>
        <h2>Skills</h2>
        {data.skills.map((skill, i) => (
          <div key={skill.id}>
            <span contentEditable={isAdmin} onBlur={e => updateSkill(i, 'name', e.target.textContent)}>{skill.name}</span>
            <div style={{width: `${skill.percentage}%`, background: 'blue', height: '10px'}}></div>
          </div>
        ))}
      </section>
      <section>
        <h2>Projects</h2>
        {data.projects.map((project, i) => (
          <div key={project.id}>
            <h3 contentEditable={isAdmin} onBlur={e => updateProject(i, 'title', e.target.textContent)}>{project.title}</h3>
            <p contentEditable={isAdmin} onBlur={e => updateProject(i, 'description', e.target.textContent)}>{project.description}</p>
          </div>
        ))}
      </section>
      <section>
        <h2>Resume</h2>
        <Link href="/resume">View Resume</Link>
      </section>
    </div>
  )
}