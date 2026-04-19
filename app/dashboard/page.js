'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [autoSave, setAutoSave] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const admin = localStorage.getItem('admin')
    if (!admin) {
      router.push('/login')
      return
    }
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])

  const saveData = async (updatedData = data) => {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
    if (!autoSave) {
      alert('Saved!')
    }
  }

  const updateData = (path, value) => {
    const updated = { ...data }
    const keys = path.split('.')
    let current = updated
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value
      } else {
        current[key] = { ...current[key] }
        current = current[key]
      }
    })
    setData(updated)
    if (autoSave) saveData(updated)
  }

  const updateListItem = (path, index, field, value) => {
    const updated = { ...data }
    const keys = path.split('.')
    let current = updated

    keys.forEach((key, idx) => {
      if (idx === keys.length - 1) {
        current[key] = [...current[key]]
      } else {
        current[key] = { ...current[key] }
        current = current[key]
      }
    })

    const list = current[keys[keys.length - 1]]
    list[index] = { ...list[index], [field]: value }
    setData(updated)
    if (autoSave) saveData(updated)
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(data.resume.experience)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    const updated = { ...data, resume: { ...data.resume, experience: items } }
    setData(updated)
    if (autoSave) saveData(updated)
  }

  if (!data) return <div className="page-shell">Loading...</div>

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-nav">
        <div className="dashboard-brand">
          <h2>Admin Dashboard</h2>
          <p>Edit everything in one place</p>
        </div>
        <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>Profile</button>
        <button onClick={() => setActiveTab('skills')} className={activeTab === 'skills' ? 'active' : ''}>Skills</button>
        <button onClick={() => setActiveTab('projects')} className={activeTab === 'projects' ? 'active' : ''}>Projects</button>
        <button onClick={() => setActiveTab('resume')} className={activeTab === 'resume' ? 'active' : ''}>Resume</button>
        <div className="dashboard-actions">
          <button onClick={() => saveData()}>Save Changes</button>
          <label className="toggle-row">
            <input type="checkbox" checked={autoSave} onChange={e => setAutoSave(e.target.checked)} />
            Auto-save
          </label>
          <button className="button-ghost" onClick={() => { localStorage.removeItem('admin'); router.push('/') }}>Logout</button>
        </div>
      </aside>

      <div className="dashboard-panel">
        <div className="dashboard-edit">
          {activeTab === 'profile' && (
            <section className="section-card">
              <h2>Profile</h2>
              <input value={data.profile.name} onChange={e => updateData('profile.name', e.target.value)} placeholder="Name" />
              <input value={data.profile.title} onChange={e => updateData('profile.title', e.target.value)} placeholder="Title" />
              <textarea value={data.profile.about} onChange={e => updateData('profile.about', e.target.value)} placeholder="About Me" />
              <h3>Social Links</h3>
              {Object.entries(data.profile.social).map(([key, value]) => (
                <input key={key} value={value} onChange={e => updateData(`profile.social.${key}`, e.target.value)} placeholder={`${key} URL`} />
              ))}
            </section>
          )}

          {activeTab === 'skills' && (
            <section className="section-card">
              <h2>Skills</h2>
              {data.skills.map((skill, index) => (
                <div className="field-row" key={index}>
                  <input value={skill.name} onChange={e => updateListItem('skills', index, 'name', e.target.value)} placeholder="Skill" />
                  <input type="number" value={skill.percentage} onChange={e => updateListItem('skills', index, 'percentage', Number(e.target.value))} placeholder="%" />
                  <button onClick={() => setData({ ...data, skills: data.skills.filter((_, idx) => idx !== index) })}>Delete</button>
                </div>
              ))}
              <button onClick={() => setData({ ...data, skills: [...data.skills, { id: Date.now(), name: '', percentage: 0 }] })}>Add Skill</button>
            </section>
          )}

          {activeTab === 'projects' && (
            <section className="section-card">
              <h2>Projects</h2>
              {data.projects.map((project, index) => (
                <div key={index} className="project-edit-card">
                  <input value={project.title} onChange={e => updateListItem('projects', index, 'title', e.target.value)} placeholder="Title" />
                  <textarea value={project.description} onChange={e => updateListItem('projects', index, 'description', e.target.value)} placeholder="Description" />
                  <input value={project.link || ''} onChange={e => updateListItem('projects', index, 'link', e.target.value)} placeholder="Live link" />
                  <input value={project.github || ''} onChange={e => updateListItem('projects', index, 'github', e.target.value)} placeholder="GitHub link" />
                  <input value={(project.tech || []).join(', ')} onChange={e => updateListItem('projects', index, 'tech', e.target.value.split(',').map(item => item.trim()))} placeholder="Tech stack (comma separated)" />
                  <button onClick={() => setData({ ...data, projects: data.projects.filter((_, idx) => idx !== index) })}>Delete</button>
                </div>
              ))}
              <button onClick={() => setData({ ...data, projects: [...data.projects, { id: Date.now(), title: '', description: '', tech: [], link: '', github: '' }] })}>Add Project</button>
            </section>
          )}

          {activeTab === 'resume' && (
            <section className="section-card">
              <h2>Resume</h2>
              <textarea value={data.resume.summary} onChange={e => updateData('resume.summary', e.target.value)} placeholder="Resume Summary" />
              <h3>Education</h3>
              {data.resume.education.map((item, index) => (
                <div className="field-row" key={index}>
                  <input value={item.degree} onChange={e => updateListItem('resume.education', index, 'degree', e.target.value)} placeholder="Degree" />
                  <input value={item.school} onChange={e => updateListItem('resume.education', index, 'school', e.target.value)} placeholder="School" />
                  <input value={item.year} onChange={e => updateListItem('resume.education', index, 'year', e.target.value)} placeholder="Year" />
                </div>
              ))}
              <button onClick={() => setData({ ...data, resume: { ...data.resume, education: [...data.resume.education, { degree: '', school: '', year: '' }] } })}>Add Education</button>

              <h3>Experience</h3>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="experience">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {data.resume.experience.map((exp, index) => (
                        <Draggable key={index} draggableId={`exp-${index}`} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} className="drag-card">
                              <div {...provided.dragHandleProps} className="drag-handle">☰</div>
                              <input value={exp.title} onChange={e => updateListItem('resume.experience', index, 'title', e.target.value)} placeholder="Role" />
                              <input value={exp.company} onChange={e => updateListItem('resume.experience', index, 'company', e.target.value)} placeholder="Company" />
                              <input value={exp.year} onChange={e => updateListItem('resume.experience', index, 'year', e.target.value)} placeholder="Year" />
                              <textarea value={exp.description} onChange={e => updateListItem('resume.experience', index, 'description', e.target.value)} placeholder="Description" />
                              <button onClick={() => setData({ ...data, resume: { ...data.resume, experience: data.resume.experience.filter((_, idx) => idx !== index) } })}>Delete</button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <button onClick={() => setData({ ...data, resume: { ...data.resume, experience: [...data.resume.experience, { title: '', company: '', year: '', description: '' }] } })}>Add Experience</button>

              <h3>Certifications</h3>
              {data.resume.certifications.map((item, index) => (
                <div className="field-row" key={index}>
                  <input value={item.name} onChange={e => updateListItem('resume.certifications', index, 'name', e.target.value)} placeholder="Certificate" />
                  <input value={item.issuer} onChange={e => updateListItem('resume.certifications', index, 'issuer', e.target.value)} placeholder="Issuer" />
                  <input value={item.year} onChange={e => updateListItem('resume.certifications', index, 'year', e.target.value)} placeholder="Year" />
                </div>
              ))}
              <button onClick={() => setData({ ...data, resume: { ...data.resume, certifications: [...data.resume.certifications, { name: '', issuer: '', year: '' }] } })}>Add Certification</button>
            </section>
          )}
        </div>

        <aside className="dashboard-preview">
          <h3>Live Preview</h3>
          <div className="preview-card">
            <h4>{data.profile.name}</h4>
            <p>{data.profile.title}</p>
            <p>{data.profile.about}</p>
            <div>
              <strong>Skills:</strong>
              <div className="skill-list-preview">{data.skills.map(skill => <span key={skill.id || skill.name}>{skill.name}</span>)}</div>
            </div>
            <div>
              <strong>Projects:</strong>
              <ul>{data.projects.map(project => <li key={project.id || project.title}>{project.title}</li>)}</ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}