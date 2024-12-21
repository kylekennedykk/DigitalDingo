import React from 'react'

interface Category {
  name: string
  items: Array<{
    title: string
    description: string
  }>
}

interface SectionEditorProps {
  content: {
    categories?: Category[]
  }
  onChange?: (categories: Category[]) => void
}

const SectionEditor: React.FC<SectionEditorProps> = ({ content, onChange }) => {
  return (
    <div className="space-y-4">
      {(content.categories || []).map((category: Category, categoryIndex: number) => (
        <div key={categoryIndex} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              value={category.name}
              onChange={(e) => {
                const newCategories = [...(content.categories || [])]
                newCategories[categoryIndex] = {
                  ...category,
                  name: e.target.value
                }
                onChange?.(newCategories)
              }}
              className="border rounded px-2 py-1"
              placeholder="Category Name"
            />
          </div>
          
          {/* Category items */}
          <div className="space-y-2">
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex gap-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const newCategories = [...(content.categories || [])]
                    newCategories[categoryIndex].items[itemIndex] = {
                      ...item,
                      title: e.target.value
                    }
                    onChange?.(newCategories)
                  }}
                  className="border rounded px-2 py-1"
                  placeholder="Item Title"
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => {
                    const newCategories = [...(content.categories || [])]
                    newCategories[categoryIndex].items[itemIndex] = {
                      ...item,
                      description: e.target.value
                    }
                    onChange?.(newCategories)
                  }}
                  className="border rounded px-2 py-1 flex-1"
                  placeholder="Item Description"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SectionEditor 