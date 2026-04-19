'use client'

import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'

export default function Resume() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])

  const downloadPDF = () => {
    const doc = new jsPDF()
    let y = 10
    doc.setFontSize(20)
    doc.text(data.profile.name, 10, y)
    y += 10
    doc.setFontSize(14)
    doc.text(data.profile.title, 10, y)
    y += 10
    doc.setFontSize(12)
    doc.text('Summary:', 10, y)
    y += 5
    const summaryLines = doc.splitTextToSize(data.resume.summary, 180)
    doc.text(summaryLines, 10, y)
    y += summaryLines.length * 5 + 5
    doc.text('Experience:', 10, y)
    y += 5
    data.resume.experience.forEach(exp => {
      doc.text(`${exp.title} at ${exp.company} (${exp.year})`, 10, y)
      y += 5
      const descLines = doc.splitTextToSize(exp.description, 180)
      doc.text(descLines, 10, y)
      y += descLines.length * 5 + 5
    })
    doc.save('resume.pdf')
  }

  if (!data) return <div>Loading...</div>

  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
      <h1>{data.profile.name}</h1>
      <p>{data.profile.title}</p>
      <h2>Summary</h2>
      <p>{data.resume.summary}</p>
      <h2>Experience</h2>
      {data.resume.experience.map((exp, i) => (
        <div key={i}>
          <h3>{exp.title} at {exp.company} ({exp.year})</h3>
          <p>{exp.description}</p>
        </div>
      ))}
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  )
}