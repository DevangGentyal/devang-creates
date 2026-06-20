'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Edit, Trash2, Eye } from 'lucide-react'

export default function ProjectsDashboardPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [supabase])

  const fetchProjects = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setProjects(data)
    } catch (error) {
      console.error('[v0] Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    setDeleting(id)
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)

      if (error) throw error

      setProjects(projects.filter((p) => p.id !== id))
    } catch (error) {
      console.error('[v0] Error deleting project:', error)
      alert('Error deleting project')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Projects</h1>
          <p className="text-foreground/60">Manage your portfolio projects</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>New Project</Button>
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground truncate">{project.title}</h3>
                    {project.featured && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full whitespace-nowrap">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/60 mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.slice(0, 3).map((tech: string) => (
                      <span key={tech} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </a>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    disabled={deleting === project.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4">
          <p className="text-foreground/60 text-lg">No projects yet</p>
          <Link href="/dashboard/projects/new">
            <Button>Create Your First Project</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
