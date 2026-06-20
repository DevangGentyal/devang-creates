'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProjectForm } from '@/components/project-form'
import { useState } from 'react'

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('projects').insert({
        ...data,
        user_id: user.id,
      })

      if (error) throw error

      router.push('/dashboard/projects')
      router.refresh()
    } catch (error) {
      console.error('[v0] Error creating project:', error)
      alert('Error creating project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Create Project</h1>
        <p className="text-foreground/60">Add a new project to your portfolio</p>
      </div>

      <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
