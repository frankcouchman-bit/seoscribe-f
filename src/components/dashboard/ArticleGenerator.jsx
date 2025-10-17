import { useNavigate } from 'react-router-dom'

// Add at top of component:
const navigate = useNavigate()

// Update handleGenerate:
const handleGenerate = async (e) => {
  e.preventDefault()
  if (!topic.trim()) return
  
  try {
    const article = await generateArticle(topic, websiteUrl)
    // Navigate to article view
    navigate('/article/new')
  } catch (error) {
    console.error('Generation failed:', error)
  }
}
