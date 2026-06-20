'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit2, Trash2, LogOut, X, Check } from 'lucide-react'

export function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  // Profile state
  const [profile, setProfile] = useState<any>(null)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ full_name: '', email: '', bio: '', avatar_url: '/devang-pfp.webp' })

  // Videos state
  const [videos, setVideos] = useState<any[]>([])
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [videoForm, setVideoForm] = useState({ title: '', url: '', type: 'shortform', niche: '', video_source: 'youtube', thumbnail: '' })
  const [editingVideo, setEditingVideo] = useState<any>(null)

  // Experiences state
  const [experiences, setExperiences] = useState<any[]>([])
  const [showExpModal, setShowExpModal] = useState(false)
  const [expForm, setExpForm] = useState({ client_name: '', client_handle: '', metric_title: '', metric_value: '', description: '', niche: '' })
  const [editingExp, setEditingExp] = useState<any>(null)

  // Load data on mount
  useEffect(() => {
    const checkAuth = () => {
      const session = localStorage.getItem('admin_session')
      if (!session) {
        router.push('/admin/login')
        return
      }
      loadData()
    }

    checkAuth()
  }, [router])

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/portfolio')
      const data = await res.json()

      if (data.profile) setProfile(data.profile)
      if (data.videos) setVideos(data.videos)
      if (data.experiences) setExperiences(data.experiences)

      if (data.profile) {
        setProfileForm(data.profile)
      }
    } catch (error) {
      console.error('[v0] Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    router.push('/admin/login')
  }

  const showSuccessMessage = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(''), 3000)
  }

  // Profile handlers
  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profileForm, id: profile?.id }),
      })

      if (!res.ok) throw new Error('Failed to save profile')

      const updated = await res.json()
      setProfile(updated)
      setEditingProfile(false)
      showSuccessMessage('Profile updated successfully!')
    } catch (error) {
      console.error('[v0] Error saving profile:', error)
      showSuccessMessage('Error saving profile')
    }
  }

  // Video handlers
  const handleAddVideo = async () => {
    if (!videoForm.title || !videoForm.url) {
      showSuccessMessage('Please fill in title and URL')
      return
    }

    try {
      const res = await fetch('/api/videos', {
        method: editingVideo ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingVideo ? { ...videoForm, id: editingVideo.id } : videoForm),
      })

      if (!res.ok) throw new Error('Failed to save video')

      const result = await res.json()

      if (editingVideo) {
        setVideos(videos.map(v => v.id === result.id ? result : v))
        setEditingVideo(null)
      } else {
        setVideos([...videos, result])
      }

      setVideoForm({ title: '', url: '', type: 'shortform', niche: '', video_source: 'youtube', thumbnail: '' })
      setShowVideoModal(false)
      showSuccessMessage(editingVideo ? 'Video updated!' : 'Video added!')
    } catch (error) {
      console.error('[v0] Error saving video:', error)
      showSuccessMessage('Error saving video')
    }
  }

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Delete this video?')) return

    try {
      const res = await fetch(`/api/videos?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete video')

      setVideos(videos.filter(v => v.id !== id))
      showSuccessMessage('Video deleted!')
    } catch (error) {
      console.error('[v0] Error deleting video:', error)
      showSuccessMessage('Error deleting video')
    }
  }

  // Experience handlers
  const handleAddExperience = async () => {
    if (!expForm.client_name) {
      showSuccessMessage('Please fill in client name')
      return
    }

    try {
      const res = await fetch('/api/experiences', {
        method: editingExp ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingExp ? { ...expForm, id: editingExp.id } : expForm),
      })

      if (!res.ok) throw new Error('Failed to save experience')

      const result = await res.json()

      if (editingExp) {
        setExperiences(experiences.map(e => e.id === result.id ? result : e))
        setEditingExp(null)
      } else {
        setExperiences([...experiences, result])
      }

      setExpForm({ client_name: '', client_handle: '', metric_title: '', metric_value: '', description: '', niche: '' })
      setShowExpModal(false)
      showSuccessMessage(editingExp ? 'Experience updated!' : 'Experience added!')
    } catch (error) {
      console.error('[v0] Error saving experience:', error)
      showSuccessMessage('Error saving experience')
    }
  }

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Delete this experience?')) return

    try {
      const res = await fetch(`/api/experiences?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete experience')

      setExperiences(experiences.filter(e => e.id !== id))
      showSuccessMessage('Experience deleted!')
    } catch (error) {
      console.error('[v0] Error deleting experience:', error)
      showSuccessMessage('Error deleting experience')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 bg-primary/20 rounded-lg mx-auto mb-4 animate-pulse" />
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success Banner */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50 animate-in">
          {success}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          {['profile', 'videos', 'experiences', 'highlights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium capitalize transition-colors ${activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground/60 hover:text-foreground'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold">Profile Settings</h2>

            {editingProfile ? (
              <Card className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    value={profileForm.full_name || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={profileForm.email || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    value={profileForm.bio || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Your bio"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Check className="w-4 h-4" /> Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingProfile(false)}>
                    Cancel
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-foreground/60">Full Name</label>
                  <p className="text-lg font-medium">{profileForm.full_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-foreground/60">Email</label>
                  <p className="text-lg font-medium">{profileForm.email || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-foreground/60">Bio</label>
                  <p className="text-lg font-medium">{profileForm.bio || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-foreground/60">Profile Picture</label>
                  <p className="text-sm text-foreground/70">{profileForm.avatar_url || '/devang-pfp.webp'}</p>
                </div>
                <Button onClick={() => setEditingProfile(true)}>Edit Profile</Button>
              </Card>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manage Videos</h2>
              <Button onClick={() => { setEditingVideo(null); setShowVideoModal(true); }} className="gap-2">
                <Plus className="w-4 h-4" /> Add Video
              </Button>
            </div>

            {/* Video Modal */}
            {showVideoModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{editingVideo ? 'Edit' : 'Add'} Video</h3>
                    <button onClick={() => setShowVideoModal(false)} className="p-1 hover:bg-primary/10 rounded">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input
                        value={videoForm.title}
                        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                        placeholder="Video title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Video Source</label>
                      <select
                        value={videoForm.video_source || 'youtube'}
                        onChange={(e) => setVideoForm({ ...videoForm, video_source: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="google-drive">Google Drive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Video URL</label>
                      <Input
                        value={videoForm.url}
                        onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                        placeholder={videoForm.video_source === 'youtube' ? "https://youtube.com/embed/..." : "https://drive.google.com/file/d/..."}
                      />
                      <p className="text-xs text-foreground/50 mt-1">
                        {videoForm.video_source === 'youtube'
                          ? 'Use YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)'
                          : 'Use Google Drive share link or embed URL (e.g., https://drive.google.com/file/d/FILE_ID)'}
                      </p>
                    </div>
                    {videoForm.video_source === 'google-drive' ?
                      <div>
                        <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                        <Input
                          value={videoForm.thumbnail}
                          onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                          placeholder={"https://example.com/image.jpg"}
                        />
                      </div> : <></>}


                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select
                        value={videoForm.type}
                        onChange={(e) => setVideoForm({ ...videoForm, type: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                      >
                        <option value="shortform">Short-Form</option>
                        <option value="longform">Long-Form</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Niche</label>
                      <Input
                        value={videoForm.niche}
                        onChange={(e) => setVideoForm({ ...videoForm, niche: e.target.value })}
                        placeholder="e.g., Ad Reels, Documentary"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddVideo} className="flex-1 gap-2">
                        <Check className="w-4 h-4" /> Save
                      </Button>
                      <Button variant="outline" onClick={() => setShowVideoModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Short-Form Videos */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Short-Form Videos</h3>
              {videos.filter(v => v.type === 'shortform').length === 0 ? (
                <p className="text-foreground/60">No short-form videos yet</p>
              ) : (
                <div className="space-y-2">
                  {videos.filter(v => v.type === 'shortform').map((video) => (
                    <Card key={video.id} className="p-4 flex items-start justify-between">
                      <div>
                        <p className="font-medium">{video.title}</p>
                        <p className="text-sm text-foreground/60">{video.niche || 'No niche'}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setVideoForm(video)
                            setEditingVideo(video)
                            setShowVideoModal(true)
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteVideo(video.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Long-Form Videos */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Long-Form Videos</h3>
              {videos.filter(v => v.type === 'longform').length === 0 ? (
                <p className="text-foreground/60">No long-form videos yet</p>
              ) : (
                <div className="space-y-2">
                  {videos.filter(v => v.type === 'longform').map((video) => (
                    <Card key={video.id} className="p-4 flex items-start justify-between">
                      <div>
                        <p className="font-medium">{video.title}</p>
                        <p className="text-sm text-foreground/60">{video.niche || 'No niche'}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setVideoForm(video)
                            setEditingVideo(video)
                            setShowVideoModal(true)
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteVideo(video.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experiences Tab */}
        {activeTab === 'experiences' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Client Success Stories</h2>
              <Button onClick={() => { setEditingExp(null); setShowExpModal(true); }} className="gap-2">
                <Plus className="w-4 h-4" /> Add Experience
              </Button>
            </div>

            {/* Experience Modal */}
            {showExpModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{editingExp ? 'Edit' : 'Add'} Experience</h3>
                    <button onClick={() => setShowExpModal(false)} className="p-1 hover:bg-primary/10 rounded">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Client Name</label>
                      <Input
                        value={expForm.client_name}
                        onChange={(e) => setExpForm({ ...expForm, client_name: e.target.value })}
                        placeholder="Client name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Client Handle</label>
                      <Input
                        value={expForm.client_handle}
                        onChange={(e) => setExpForm({ ...expForm, client_handle: e.target.value })}
                        placeholder="@handle"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Metric Title</label>
                      <Input
                        value={expForm.metric_title}
                        onChange={(e) => setExpForm({ ...expForm, metric_title: e.target.value })}
                        placeholder="e.g., Subscribers Growth"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Metric Value</label>
                      <Input
                        value={expForm.metric_value}
                        onChange={(e) => setExpForm({ ...expForm, metric_value: e.target.value })}
                        placeholder="e.g., 50K to 500K"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Niche</label>
                      <Input
                        value={expForm.niche}
                        onChange={(e) => setExpForm({ ...expForm, niche: e.target.value })}
                        placeholder="Niche"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={expForm.description}
                        onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                        placeholder="Describe the project..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddExperience} className="flex-1 gap-2">
                        <Check className="w-4 h-4" /> Save
                      </Button>
                      <Button variant="outline" onClick={() => setShowExpModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Experiences List */}
            {experiences.length === 0 ? (
              <p className="text-foreground/60">No experiences yet</p>
            ) : (
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <Card key={exp.id} className="p-4 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{exp.client_name}</p>
                      <p className="text-sm text-foreground/60">{exp.metric_title}: {exp.metric_value}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setExpForm(exp)
                          setEditingExp(exp)
                          setShowExpModal(true)
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteExperience(exp.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Highlights Tab */}
        {activeTab === 'highlights' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Featured on Homepage</h2>
            <p className="text-foreground/60">Toggle which videos appear on the homepage</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4">Short-Form Videos</h3>
                {videos.filter(v => v.type === 'shortform').length === 0 ? (
                  <p className="text-foreground/60">No short-form videos</p>
                ) : (
                  <div className="space-y-2">
                    {videos.filter(v => v.type === 'shortform').map((video) => (
                      <Card key={video.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{video.title}</p>
                          <p className="text-sm text-foreground/60">{video.niche}</p>
                        </div>
                        <Button
                          size="sm"
                          variant={video.show_on_homepage ? 'default' : 'outline'}
                          onClick={async () => {
                            await fetch('/api/videos', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...video, show_on_homepage: !video.show_on_homepage }),
                            })
                            setVideos(videos.map(v => v.id === video.id ? { ...v, show_on_homepage: !v.show_on_homepage } : v))
                          }}
                        >
                          {video.show_on_homepage ? 'Visible' : 'Hidden'}
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Long-Form Videos</h3>
                {videos.filter(v => v.type === 'longform').length === 0 ? (
                  <p className="text-foreground/60">No long-form videos</p>
                ) : (
                  <div className="space-y-2">
                    {videos.filter(v => v.type === 'longform').map((video) => (
                      <Card key={video.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{video.title}</p>
                          <p className="text-sm text-foreground/60">{video.niche}</p>
                        </div>
                        <Button
                          size="sm"
                          variant={video.show_on_homepage ? 'default' : 'outline'}
                          onClick={async () => {
                            await fetch('/api/videos', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...video, show_on_homepage: !video.show_on_homepage }),
                            })
                            setVideos(videos.map(v => v.id === video.id ? { ...v, show_on_homepage: !v.show_on_homepage } : v))
                          }}
                        >
                          {video.show_on_homepage ? 'Visible' : 'Hidden'}
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
