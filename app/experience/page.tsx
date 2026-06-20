'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export default function ExperiencePage() {
  const [profile, setProfile] = useState<any>(null)
  const [experiences, setExperiences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile for metrics
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .single()

        if (profiles) setProfile(profiles)

        // Fetch experiences
        const { data: exp } = await supabase
          .from('experiences')
          .select('*')
          .order('order_index')

        if (exp) setExperiences(exp)
      } catch (error) {
        console.error('[v0] Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Experience & Metrics</h1>
            <p className="text-foreground/60">Results I've achieved for my clients</p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 text-center">
              <p className="text-4xl font-bold text-primary mb-2">{experiences.length}+</p>
              <p className="text-foreground/60">Clients Worked With</p>
            </Card>
            <Card className="p-8 text-center">
              <p className="text-4xl font-bold text-primary mb-2">5M+</p>
              <p className="text-foreground/60">Total Views Generated</p>
            </Card>
            <Card className="p-8 text-center">
              <p className="text-4xl font-bold text-primary mb-2">50K+</p>
              <p className="text-foreground/60">Combined Growth</p>
            </Card>
          </div>

          {/* Client Success Stories */}
          {experiences.length > 0 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Client Success Stories</h2>
                <p className="text-foreground/60">How I've helped creators and brands grow</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experiences.map((experience) => (
                  <Card key={experience.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      {experience.client_image && (
                        <img
                          src={experience.client_image}
                          alt={experience.client_name}
                          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-lg">{experience.client_name}</h3>
                        {experience.client_handle && (
                          <p className="text-sm text-foreground/60">@{experience.client_handle}</p>
                        )}
                        {experience.niche && (
                          <p className="text-xs text-primary mt-1">{experience.niche}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-primary/80 mb-1">{experience.metric_title}</p>
                      <p className="text-xl font-bold text-foreground">{experience.metric_value}</p>
                    </div>

                    {experience.description && (
                      <p className="text-sm text-foreground/70 leading-relaxed">{experience.description}</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 text-center space-y-6 mt-16">
            <h2 className="text-3xl font-bold text-foreground">Want to grow together?</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              I help creators and brands scale their presence through professional video editing and content strategy.
            </p>
            <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Let&apos;s Talk <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-foreground/60 text-sm">
          <p>© 2024 Devang Creates. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
