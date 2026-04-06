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
  LoadingSpinner,
} from './components'

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
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to fetch agent data')
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  AI Agent Builder
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Design your custom AI personality by dragging blocks
                </p>
              </div>
              <button
                onClick={fetchAPI}
                disabled={loading}
                className={`btn-primary flex items-center justify-center gap-2 whitespace-nowrap ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reload Data
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {showSaveSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-3 animate-pulse">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Agent saved successfully!</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-0 border-b-2 border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('build')}
              className={`px-6 py-3 font-semibold text-sm sm:text-base border-b-2 transition-colors ${
                activeTab === 'build'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Build Agent
            </button>
            {savedAgents.length > 0 && (
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-6 py-3 font-semibold text-sm sm:text-base border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'saved'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Saved Agents
                <span className="badge bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
                  {savedAgents.length}
                </span>
              </button>
            )}
          </div>

          {/* Build Tab */}
          {activeTab === 'build' && (
            <div className="space-y-8">
              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : !data ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No data loaded.</p>
                </div>
              ) : (
                <>
                  {/* Available Items Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Skills */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Skills</h2>
                      <p className="text-sm text-gray-600 mb-4">
                        Drag skills to your agent configuration
                      </p>
                      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2">
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

                    {/* Personality Layers */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Personality Layers
                      </h2>
                      <p className="text-sm text-gray-600 mb-4">
                        Drag layers to customize behavior
                      </p>
                      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2">
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

                  {/* Configuration Section */}
                  <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Configuration</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Profile Selection */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Base Profile</h3>
                        <div className="space-y-2">
                          {data.agentProfiles.map((profile) => (
                            <button
                              key={profile.id}
                              onClick={() => setSelectedProfile(profile.id)}
                              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                selectedProfile === profile.id
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <p className="font-medium text-gray-900">{profile.name}</p>
                              <p className="text-xs text-gray-600 mt-1">{profile.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Middle: Selected Items */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Selected Skills</h3>
                          <div className="space-y-2 min-h-[100px]">
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
                              <p className="text-sm text-gray-400 italic">
                                Drag skills here or drop them below
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Selected Layers
                          </h3>
                          <div className="space-y-2 min-h-[100px]">
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
                              <p className="text-sm text-gray-400 italic">
                                Drag layers here or drop them below
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Provider & Summary */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-lg font-semibold text-gray-800 mb-3">
                            AI Provider
                          </label>
                          <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">-- Select a Provider --</option>
                            {['Gemini', 'ChatGPT', 'Kimi', 'Claude', 'DeepSeek'].map((provider) => (
                              <option key={provider} value={provider}>
                                {provider}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Configuration Summary</h4>
                          <dl className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Profile:</dt>
                              <dd className="font-medium text-gray-900">
                                {selectedProfileData?.name || 'None'}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Skills:</dt>
                              <dd className="font-medium text-gray-900">{selectedSkills.length}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Layers:</dt>
                              <dd className="font-medium text-gray-900">{selectedLayers.length}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Provider:</dt>
                              <dd className="font-medium text-gray-900">
                                {selectedProvider || 'None'}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        {/* Save Agent */}
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Enter agent name..."
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {agentName.trim() && (
                            <button
                              onClick={handleSaveAgent}
                              className="w-full btn-primary flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 10-1.414-1.414L11 12.586 7.707 9.293z" />
                              </svg>
                              Save Agent
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Saved Agents Tab */}
          {activeTab === 'saved' && savedAgents.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Saved Agents</h2>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all saved agents?')) {
                      setSavedAgents([])
                      localStorage.removeItem('savedAgents')
                      setActiveTab('build')
                    }
                  }}
                  className="btn-danger"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
