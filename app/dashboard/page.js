'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
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

  const saveData = async () => {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    alert('Saved!')
  }

  const onDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(data.resume.experience)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setData({...data, resume: {...data.resume, experience: items}})
  }

  if (!data) return <div>Loading...</div>

  return (
    <div style={{display: 'flex'}}>
      <nav style={{width: '200px', padding: '20px'}}>
        <button onClick={() => setActiveTab('profile')}>Profile</button>
        <button onClick={() => setActiveTab('skills')}>Skills</button>
        <button onClick={() => setActiveTab('projects')}>Projects</button>
        <button onClick={() => setActiveTab('resume')}>Resume</button>
        <button onClick={() => { localStorage.removeItem('admin'); router.push('/') }}>Logout</button>
      </nav>
      <main style={{flex: 1, padding: '20px'}}>
        {activeTab === 'profile' && (
          <section>
            <h2>Profile</h2>
            <input placeholder="Name" value={data.profile.name} onChange={e => setData({...data, profile: {...data.profile, name: e.target.value}})} />
            <input placeholder="Title" value={data.profile.title} onChange={e => setData({...data, profile: {...data.profile, title: e.target.value}})} />
            <textarea placeholder="About" value={data.profile.about} onChange={e => setData({...data, profile: {...data.profile, about: e.target.value}})} />
          </section>
        )}
        {activeTab === 'skills' && (
          <section>
            <h2>Skills</h2>
            {data.skills.map((skill, i) => (
              <div key={i}>
                <input placeholder="Skill Name" value={skill.name} onChange={e => {
                  const newSkills = [...data.skills]
                  newSkills[i].name = e.target.value
                  setData({...data, skills: newSkills})
                }} />
                <input type="number" placeholder="Percentage" value={skill.percentage} onChange={e => {
                  const newSkills = [...data.skills]
                  newSkills[i].percentage = parseInt(e.target.value)
                  setData({...data, skills: newSkills})
                }} />
                <button onClick={() => setData({...data, skills: data.skills.filter((_, idx) => idx !== i)})}>Delete</button>
              </div>
            ))}
            <button onClick={() => setData({...data, skills: [...data.skills, {name: '', percentage: 0}]})}>Add Skill</button>
          </section>
        )}
        {activeTab === 'projects' && (
          <section>
            <h2>Projects</h2>
            {data.projects.map((project, i) => (
              <div key={i}>
                <input placeholder="Title" value={project.title} onChange={e => {
                  const newProjects = [...data.projects]
                  newProjects[i].title = e.target.value
                  setData({...data, projects: newProjects})
                }} />
                <textarea placeholder="Description" value={project.description} onChange={e => {
                  const newProjects = [...data.projects]
                  newProjects[i].description = e.target.value
                  setData({...data, projects: newProjects})
                }} />
                <button onClick={() => setData({...data, projects: data.projects.filter((_, idx) => idx !== i)})}>Delete</button>
              </div>
            ))}
            <button onClick={() => setData({...data, projects: [...data.projects, {title: '', description: ''}]})}>Add Project</button>
          </section>
        )}
        {activeTab === 'resume' && (
          <section>
            <h2>Resume</h2>
            <textarea placeholder="Summary" value={data.resume.summary} onChange={e => setData({...data, resume: {...data.resume, summary: e.target.value}})} />
            <h3>Experience</h3>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="experience">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {data.resume.experience.map((exp, i) => (
                      <Draggable key={i} draggableId={`exp-${i}`} index={i}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <input placeholder="Title" value={exp.title} onChange={e => {
                              const newExp = [...data.resume.experience]
                              newExp[i].title = e.target.value
                              setData({...data, resume: {...data.resume, experience: newExp}})
                            }} />
                            <input placeholder="Company" value={exp.company} onChange={e => {
                              const newExp = [...data.resume.experience]
                              newExp[i].company = e.target.value
                              setData({...data, resume: {...data.resume, experience: newExp}})
                            }} />
                            <input placeholder="Year" value={exp.year} onChange={e => {
                              const newExp = [...data.resume.experience]
                              newExp[i].year = e.target.value
                              setData({...data, resume: {...data.resume, experience: newExp}})
                            }} />
                            <textarea placeholder="Description" value={exp.description} onChange={e => {
                              const newExp = [...data.resume.experience]
                              newExp[i].description = e.target.value
                              setData({...data, resume: {...data.resume, experience: newExp}})
                            }} />
                            <button onClick={() => setData({...data, resume: {...data.resume, experience: data.resume.experience.filter((_, idx) => idx !== i)}})}>Delete</button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <button onClick={() => setData({...data, resume: {...data.resume, experience: [...data.resume.experience, {title: '', company: '', year: '', description: ''}]}})}>Add Experience</button>
          </section>
        )}
      </main>
    </div>
  )
}