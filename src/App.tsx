import { useState, useEffect } from 'react'
import {
  DndContext,
  type DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  DraggableSkill,
  DraggableLayer,
  SelectedItem,
  AgentCard,
} from './components'
import { Wrench, Save, Sparkles, Bot, ChevronRight, Settings } from 'lucide-react'

// Define the types based on data.json
interface AgentProfile {
  id: string
  name: string
  description: string
}

interface Skill {
  id: string
  name: string
  category: string
  description: string
}

interface Layer {
  id: string
  name: string
  type: string
  description: string
}

interface AgentData {
  agentProfiles: AgentProfile[]
  skills: Skill[]
  layers: Layer[]
}

interface SavedAgent {
  name: string
  profileId: string
  skillIds: string[]
  layerIds: string[]
  provider?: string
}

function App() {
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Selection states
  const [selectedProfile, setSelectedProfile] = useState<string>('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])

  // Saving states
  const [agentName, setAgentName] = useState('')
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>('')

  // UI states
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'build' | 'saved'>('build')

  const handleDeleteAgent = (indexToRemove: number) => {
    const updatedAgents = savedAgents.filter((_, index) => index !== indexToRemove)
    setSavedAgents(updatedAgents)
    localStorage.setItem('savedAgents', JSON.stringify(updatedAgents))
  }

  useEffect(() => {
    // Load saved agents from local storage on component mount
    const saved = localStorage.getItem('savedAgents')
    if (saved) {
      try {
        setSavedAgents(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved agents', e)
      }
    }
  }, [])

  useEffect(() => {
    const analyticsInterval = setInterval(() => {
      if (agentName !== '') {
        console.log(`[Analytics Heartbeat] User is working on agent named: "${agentName}"`)
      } else {
        console.log(`[Analytics Heartbeat] User is working on an unnamed agent draft...`)
      }
    }, 8000)

    return () => clearInterval(analyticsInterval)
  }, [agentName])

  const fetchAPI = async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate network delay and randomness (1 to 3 seconds)
      const delay = Math.floor(Math.random() * 2000) + 1000
      await new Promise((resolve) => setTimeout(resolve, delay))

      const response = await fetch('/data.json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const jsonData: AgentData = await response.json()
      setData(jsonData)
    } catch (err: unknown) {
      console.error('Error fetching data:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch agent data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on initial component mount
  useEffect(() => {
    fetchAPI()
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event

    if (!active.id) return

    const id = active.id as string

    if (id.startsWith('skill-')) {
      const skillId = id.replace('skill-', '')
      if (!selectedSkills.includes(skillId)) {
        setSelectedSkills([...selectedSkills, skillId])
      }
    } else if (id.startsWith('layer-')) {
      const layerId = id.replace('layer-', '')
      if (!selectedLayers.includes(layerId)) {
        setSelectedLayers([...selectedLayers, layerId])
      }
    }
  }

  const handleSaveAgent = () => {
    if (!agentName.trim()) {
      alert('Please enter a name for your agent.')
      return
    }

    const newAgent: SavedAgent = {
      name: agentName,
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider: selectedProvider,
    }

    const updatedAgents = [...savedAgents, newAgent]
    setSavedAgents(updatedAgents)
    localStorage.setItem('savedAgents', JSON.stringify(updatedAgents))

    // Show success message
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)

    // Reset form
    setAgentName('')
    setSelectedProfile('')
    setSelectedSkills([])
    setSelectedLayers([])
    setSelectedProvider('')
  }

  const handleLoadAgent = (agent: SavedAgent) => {
    setSelectedProfile(agent.profileId || '')
    setSelectedSkills(agent.skillIds || [])
    setSelectedLayers([...(agent.layerIds || [])])
    setAgentName(agent.name)
    setSelectedProvider(agent.provider || '')
    setActiveTab('build')
  }

  const sensors = useSensors(
    useSensor(PointerSensor)
  )

  const selectedProfileData = data?.agentProfiles.find(p => p.id === selectedProfile)

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-transparent">
        {/* Professional Header */}
        <header className="professional-header mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    AI Agent Builder
                  </h1>
                  <p className="text-blue-100 text-lg mt-2 font-medium">
                    Create powerful AI agents with drag-and-drop simplicity
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-blue-100">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Professional AI Tools</span>
                </div>
                <button
                  onClick={fetchAPI}
                  disabled={loading}
                  className="colorful-button-primary flex items-center justify-center gap-3 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Reload Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {error && (
            <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800 rounded-2xl flex items-start gap-4 shadow-lg">
              <div className="p-2 bg-red-500 rounded-xl flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Error Loading Data</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {showSaveSuccess && (
            <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 rounded-2xl flex items-start gap-4 shadow-lg animate-pulse">
              <div className="p-2 bg-green-500 rounded-xl flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Success!</h3>
                <p className="text-green-700">Your AI agent has been saved successfully!</p>
              </div>
            </div>
          )}

          {/* Professional Tab Navigation */}
          <div className="professional-card p-2 mb-8">
            <div className="flex gap-0 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('build')}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold text-sm sm:text-base rounded-lg transition-all duration-300 ${
                  activeTab === 'build'
                    ? 'colorful-accent-blue shadow-xl transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Wrench className={`w-5 h-5 ${activeTab === 'build' ? 'animate-pulse' : ''}`} />
                Build Agent
                {activeTab === 'build' && (
                  <ChevronRight className="w-4 h-4 ml-auto animate-bounce" />
                )}
              </button>
              {savedAgents.length > 0 && (
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold text-sm sm:text-base rounded-lg transition-all duration-300 relative ${
                    activeTab === 'saved'
                      ? 'colorful-accent-purple shadow-xl transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Save className={`w-5 h-5 ${activeTab === 'saved' ? 'animate-pulse' : ''}`} />
                  Saved Agents
                  <span className={`badge text-xs px-3 py-1 ml-2 font-bold ${
                    activeTab === 'saved'
                      ? 'bg-white/20 text-white border-white/30'
                      : 'colorful-badge-purple'
                  }`}>
                    {savedAgents.length}
                  </span>
                  {activeTab === 'saved' && (
                    <ChevronRight className="w-4 h-4 ml-auto animate-bounce" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Build Tab */}
          {activeTab === 'build' && (
            <div className="space-y-8">
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="professional-card p-8 text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Loading AI Components</h3>
                    <p className="text-gray-600">Preparing your agent building tools...</p>
                  </div>
                </div>
              ) : !data ? (
                <div className="professional-card p-8 text-center">
                  <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Data Available</h3>
                  <p className="text-gray-600">Please reload the data to start building your AI agent.</p>
                </div>
              ) : (
                <>
                  {/* Professional Available Items Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Skills Section */}
                    <div className="professional-card p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 colorful-accent-blue rounded-2xl shadow-lg">
                          <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">AI Skills Library</h2>
                          <p className="text-gray-600 font-medium">Drag skills to empower your agent</p>
                        </div>
                      </div>
                      <div className="colorful-drop-zone mb-4">
                        <div className="text-center py-4">
                          <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                          <p className="text-purple-600 font-semibold">Drop Zone Active</p>
                          <p className="text-sm text-purple-500">Release to add skill</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                        {data.skills.map((skill) => (
                          <DraggableSkill
                            key={skill.id}
                            id={skill.id}
                            name={skill.name}
                            category={skill.category}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Personality Layers Section */}
                    <div className="professional-card p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 colorful-accent-purple rounded-2xl shadow-lg">
                          <Bot className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Personality Layers</h2>
                          <p className="text-gray-600 font-medium">Shape your agent's character</p>
                        </div>
                      </div>
                      <div className="colorful-drop-zone mb-4">
                        <div className="text-center py-4">
                          <Bot className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                          <p className="text-purple-600 font-semibold">Drop Zone Active</p>
                          <p className="text-sm text-purple-500">Release to add layer</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                        {data.layers.map((layer) => (
                          <DraggableLayer
                            key={layer.id}
                            id={layer.id}
                            name={layer.name}
                            type={layer.type}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Professional Configuration Section */}
                  <div className="professional-card p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 colorful-accent-green rounded-2xl shadow-lg">
                        <Wrench className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">Agent Configuration</h2>
                        <p className="text-gray-600 font-medium text-lg">Fine-tune your AI agent settings</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Professional Profile Selection */}
                      <div className="colorful-section">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">Base Profile</h3>
                        </div>
                        <div className="space-y-3">
                          {data.agentProfiles.map((profile) => (
                            <button
                              key={profile.id}
                              onClick={() => setSelectedProfile(profile.id)}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                                selectedProfile === profile.id
                                  ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg transform scale-105'
                                  : 'border-gray-200 hover:border-green-300 hover:bg-gradient-to-r hover:from-green-25 hover:to-emerald-25'
                              }`}
                            >
                              <p className="font-bold text-gray-900 text-lg">{profile.name}</p>
                              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{profile.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Professional Selected Items */}
                      <div className="space-y-6">
                        <div className="colorful-section">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 colorful-accent-blue rounded-xl">
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Selected Skills</h3>
                          </div>
                          <div className="space-y-3 min-h-[120px] colorful-drop-zone">
                            {selectedSkills.length > 0 ? (
                              selectedSkills.map((skillId) => {
                                const skill = data.skills.find(s => s.id === skillId)
                                return skill ? (
                                  <SelectedItem
                                    key={skillId}
                                    id={skillId}
                                    name={skill.name}
                                    type="skill"
                                    onRemove={() =>
                                      setSelectedSkills(
                                        selectedSkills.filter(id => id !== skillId)
                                      )
                                    }
                                  />
                                ) : null
                              })
                            ) : (
                              <div className="text-center py-6">
                                <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 font-medium">No skills selected</p>
                                <p className="text-sm text-gray-400">Drag skills here to add them</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="colorful-section">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 colorful-accent-purple rounded-xl">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Selected Layers</h3>
                          </div>
                          <div className="space-y-3 min-h-[120px] colorful-drop-zone">
                            {selectedLayers.length > 0 ? (
                              selectedLayers.map((layerId) => {
                                const layer = data.layers.find(l => l.id === layerId)
                                return layer ? (
                                  <SelectedItem
                                    key={layerId}
                                    id={layerId}
                                    name={layer.name}
                                    type="layer"
                                    onRemove={() =>
                                      setSelectedLayers(
                                        selectedLayers.filter(id => id !== layerId)
                                      )
                                    }
                                  />
                                ) : null
                              })
                            ) : (
                              <div className="text-center py-6">
                                <Bot className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 font-medium">No layers selected</p>
                                <p className="text-sm text-gray-400">Drag layers here to add them</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Professional Provider & Summary */}
                      <div className="space-y-6">
                        <div className="colorful-section">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 colorful-accent-orange rounded-xl">
                              <Settings className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">AI Provider</h3>
                          </div>
                          <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className="colorful-select"
                          >
                            <option value="">-- Choose AI Provider --</option>
                            {['Gemini', 'ChatGPT', 'Kimi', 'Claude', 'DeepSeek'].map((provider) => (
                              <option key={provider} value={provider}>
                                {provider}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="colorful-section">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 colorful-accent-teal rounded-xl">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Configuration Summary</h3>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                              <span className="text-gray-600 font-medium">Profile:</span>
                              <span className="font-bold text-gray-900 text-lg">
                                {selectedProfileData?.name || 'None'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                              <span className="text-gray-600 font-medium">Skills:</span>
                              <span className="font-bold text-blue-600 text-lg">{selectedSkills.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                              <span className="text-gray-600 font-medium">Layers:</span>
                              <span className="font-bold text-purple-600 text-lg">{selectedLayers.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                              <span className="text-gray-600 font-medium">Provider:</span>
                              <span className="font-bold text-orange-600 text-lg">
                                {selectedProvider || 'None'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Professional Save Agent */}
                        <div className="colorful-section">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 colorful-accent-green rounded-xl">
                              <Save className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Save Agent</h3>
                          </div>
                          <div className="space-y-4">
                            <input
                              type="text"
                              placeholder="Enter your agent name..."
                              value={agentName}
                              onChange={(e) => setAgentName(e.target.value)}
                              className="colorful-input text-lg"
                            />
                            {agentName.trim() && (
                              <button
                                onClick={handleSaveAgent}
                                className="colorful-button-success w-full flex items-center justify-center gap-3 text-lg py-4"
                              >
                                <Save className="w-6 h-6" />
                                Save AI Agent
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Professional Saved Agents Tab */}
          {activeTab === 'saved' && savedAgents.length > 0 && (
            <div className="space-y-8">
              <div className="professional-card p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 colorful-accent-purple rounded-2xl shadow-lg">
                      <Save className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Your Saved Agents</h2>
                      <p className="text-gray-600 font-medium text-lg">Manage and load your custom AI agents</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all saved agents? This action cannot be undone.')) {
                        setSavedAgents([])
                        localStorage.removeItem('savedAgents')
                        setActiveTab('build')
                      }
                    }}
                    className="colorful-button-danger flex items-center gap-3 px-6 py-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All Agents
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedAgents.map((agent, index) => (
                  <AgentCard
                    key={`${agent.name}-${index}`}
                    name={agent.name}
                    profileName={data?.agentProfiles.find(p => p.id === agent.profileId)?.name}
                    skillCount={agent.skillIds?.length || 0}
                    layerCount={agent.layerIds?.length || 0}
                    provider={agent.provider}
                    onLoad={() => handleLoadAgent(agent)}
                    onDelete={() => handleDeleteAgent(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </DndContext>
  )
}

export default App
