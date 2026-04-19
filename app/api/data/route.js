import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data.json')

export async function GET() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch {
    // Default data
    const defaultData = {
      profile: {
        name: 'Ralph R. Ociones',
        title: 'Web Designer / IT Student',
        about: 'Hi, I’m Ralph…',
        social: {}
      },
      skills: [],
      projects: [],
      resume: {
        summary: '',
        education: [],
        experience: [],
        skills: [],
        certifications: []
      }
    }
    fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2))
    return NextResponse.json(defaultData)
  }
}

export async function POST(request) {
  const newData = await request.json()
  fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2))
  return NextResponse.json({ success: true })
}