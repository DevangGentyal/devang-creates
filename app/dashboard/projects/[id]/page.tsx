'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProjectForm } from '@/components/project-form'

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single()

        if (data) setProject(data)
      } catch (error) {
        console.error('[v0] Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProject()
  }, [id, supabase])

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id)

      if (error) throw error

      router.push('/dashboard/projects')
      router.refresh()
    } catch (error) {
      console.error('[v0] Error updating project:', error)
      alert('Error updating project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Project not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Edit Project</h1>
        <p className="text-foreground/60">Update {project.title}</p>
      </div>

      <ProjectForm initialData={project} onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  )
}
