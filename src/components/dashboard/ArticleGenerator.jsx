import TemplateSelector from './TemplateSelector'

// Add state:
const [showTemplates, setShowTemplates] = useState(false)
const [selectedTemplate, setSelectedTemplate] = useState(null)

// Add button before the form:
<button
  onClick={() => setShowTemplates(!showTemplates)}
  className="mb-4 text-sm text-purple-400 hover:underline"
>
  {showTemplates ? 'Hide' : 'Show'} Article Templates
</button>

{showTemplates && (
  <div className="mb-6">
    <TemplateSelector onSelect={(template) => {
      setSelectedTemplate(template)
      setShowTemplates(false)
    }} />
  </div>
)}

{selectedTemplate && (
  <div className="mb-4 px-4 py-2 bg-purple-500/20 rounded-lg text-sm">
    Template: <strong>{selectedTemplate.name}</strong>
  </div>
)}
