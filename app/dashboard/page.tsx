'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileText, Image, Users, BookOpen } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    media: 0,
    testimonials: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const [projectsRes, mediaRes, testimonialsRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('media').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ])

      setStats({
        projects: projectsRes.count || 0,
        media: mediaRes.count || 0,
        testimonials: testimonialsRes.count || 0,
      })
    }

    fetchStats()
  }, [supabase])

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Welcome to Your Dashboard</h1>
        <p className="text-foreground/60">Manage your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <Link href="/dashboard/profile">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="space-y-4">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-bold text-foreground">Profile</h3>
                <p className="text-sm text-foreground/60">Edit your information</p>
              </div>
            </div>
          </Card>
        </Link>

        {/* Projects Card */}
        <Link href="/dashboard/projects">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="space-y-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-bold text-foreground">Projects</h3>
                <p className="text-2xl font-bold text-primary">{stats.projects}</p>
                <p className="text-sm text-foreground/60">projects created</p>
              </div>
            </div>
          </Card>
        </Link>

        {/* Media Card */}
        <Link href="/dashboard/media">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="space-y-4">
              <Image className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-bold text-foreground">Media</h3>
                <p className="text-2xl font-bold text-primary">{stats.media}</p>
                <p className="text-sm text-foreground/60">media items</p>
              </div>
            </div>
          </Card>
        </Link>

        {/* Testimonials Card */}
        <Link href="/dashboard/testimonials">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="space-y-4">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-bold text-foreground">Testimonials</h3>
                <p className="text-2xl font-bold text-primary">{stats.testimonials}</p>
                <p className="text-sm text-foreground/60">testimonials</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/projects/new">
            <Button size="sm">Add Project</Button>
          </Link>
          <Link href="/dashboard/media/new">
            <Button variant="outline" size="sm">Add Media</Button>
          </Link>
          <Link href="/dashboard/testimonials/new">
            <Button variant="outline" size="sm">Add Testimonial</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
