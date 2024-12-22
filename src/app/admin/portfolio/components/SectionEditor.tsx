'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Loader2 } from 'lucide-react'
import type { Section } from '@/types/portfolio'
import ImageUpload from './ImageUpload'

interface SectionEditorProps {
  section: Section
  siteId: string
  onClose: () => void
  onUpdate: () => void
}

interface MenuItem {
  name: string
  description: string
  price: string
  image?: string
}

interface MenuCategory {
  name: string
  items: MenuItem[]
}

interface Testimonial {
  author: string
  role?: string
  content: string
  image?: string
  rating: number
}

interface TeamMember {
  name: string
  role: string
  bio?: string
  image?: string
  social?: {
    linkedin?: string
    twitter?: string
    email?: string
  }
}

interface BusinessHours {
  open: string
  close: string
}

interface DayHours {
  [key: string]: BusinessHours
}

function HeroEditor({ 
  content, 
  onChange 
}: { 
  content: Section['content']
  onChange: (content: Section['content']) => void 
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Enter a title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Subtitle
        </label>
        <input
          type="text"
          value={content.subtitle || ''}
          onChange={e => onChange({ ...content, subtitle: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Enter a subtitle"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Background Image
        </label>
        <ImageUpload
          value={content.backgroundImage}
          onChange={url => onChange({ ...content, backgroundImage: url })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Buttons
        </label>
        <div className="space-y-4">
          {(content.buttons || []).map((button, index) => (
            <div key={index} className="flex gap-4">
              <input
                type="text"
                value={button.text}
                onChange={e => {
                  const buttons = [...(content.buttons || [])]
                  buttons[index] = { ...button, text: e.target.value }
                  onChange({ ...content, buttons })
                }}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg"
                placeholder="Button text"
              />
              <input
                type="text"
                value={button.url}
                onChange={e => {
                  const buttons = [...(content.buttons || [])]
                  buttons[index] = { ...button, url: e.target.value }
                  onChange({ ...content, buttons })
                }}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg"
                placeholder="Button URL"
              />
              <select
                value={button.style}
                onChange={e => {
                  const buttons = [...(content.buttons || [])]
                  buttons[index] = { ...button, style: e.target.value as 'primary' | 'secondary' }
                  onChange({ ...content, buttons })
                }}
                className="px-4 py-2 border border-neutral-300 rounded-lg"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
              <button
                onClick={() => {
                  const buttons = [...(content.buttons || [])]
                  buttons.splice(index, 1)
                  onChange({ ...content, buttons })
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const buttons = [...(content.buttons || []), {
                text: '',
                url: '',
                style: 'primary' as const
              }]
              onChange({ ...content, buttons })
            }}
            className="w-full p-2 border border-dashed border-neutral-300
              hover:border-primary-ochre rounded-lg text-neutral-600
              hover:text-primary-ochre transition-colors"
          >
            Add Button
          </button>
        </div>
      </div>
    </div>
  )
}

function ContentEditor({ 
  content, 
  onChange 
}: { 
  content: Section['content']
  onChange: (content: Section['content']) => void 
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Enter a title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Subtitle
        </label>
        <input
          type="text"
          value={content.subtitle || ''}
          onChange={e => onChange({ ...content, subtitle: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Enter a subtitle"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Content
        </label>
        <textarea
          value={content.text || ''}
          onChange={e => onChange({ ...content, text: e.target.value })}
          className="w-full h-48 px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Enter your content here..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Images
        </label>
        <div className="grid grid-cols-2 gap-4">
          {(content.images || []).map((url, index) => (
            <div key={index} className="space-y-2">
              <ImageUpload
                value={url}
                onChange={newUrl => {
                  const images = [...(content.images || [])]
                  images[index] = newUrl
                  onChange({ ...content, images })
                }}
              />
            </div>
          ))}
          <button
            onClick={() => {
              const images = [...(content.images || []), '']
              onChange({ ...content, images })
            }}
            className="h-40 border-2 border-dashed border-neutral-300
              hover:border-primary-ochre rounded-lg flex items-center 
              justify-center text-neutral-500 hover:text-primary-ochre
              transition-colors"
          >
            Add Image
          </button>
        </div>
      </div>
    </div>
  )
}

function GalleryEditor({ 
  content, 
  onChange 
}: { 
  content: Section['content']
  onChange: (content: Section['content']) => void 
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Enter a title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Subtitle
        </label>
        <input
          type="text"
          value={content.subtitle || ''}
          onChange={e => onChange({ ...content, subtitle: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Enter a subtitle"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Gallery Images
        </label>
        <div className="grid grid-cols-2 gap-4">
          {(content.images || []).map((url, index) => (
            <div key={index} className="space-y-2">
              <ImageUpload
                value={url}
                onChange={newUrl => {
                  const images = [...(content.images || [])]
                  images[index] = newUrl
                  onChange({ ...content, images })
                }}
              />
              <button
                onClick={() => {
                  const images = [...(content.images || [])]
                  images.splice(index, 1)
                  onChange({ ...content, images })
                }}
                className="w-full p-2 text-red-500 hover:bg-red-50 rounded-lg
                  flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const images = [...(content.images || []), '']
              onChange({ ...content, images })
            }}
            className="h-40 border-2 border-dashed border-neutral-300
              hover:border-primary-ochre rounded-lg flex items-center 
              justify-center text-neutral-500 hover:text-primary-ochre
              transition-colors"
          >
            Add Image
          </button>
        </div>
      </div>
    </div>
  )
}

function MenuEditor({
  content,
  onChange
}: {
  content: Section['content']
  onChange: (content: Section['content']) => void
}) {
  const addCategory = () => {
    const categories = [...(content.categories || []), {
      name: 'New Category',
      items: []
    }]
    onChange({ ...content, categories })
  }

  const addMenuItem = (categoryIndex: number) => {
    const categories = [...(content.categories || [])]
    categories[categoryIndex].items.push({
      name: '',
      description: '',
      price: '',
      image: ''
    })
    onChange({ ...content, categories })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Our Menu"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Categories
        </label>
        <div className="space-y-6">
          {(content.categories || []).map((category, categoryIndex) => (
            <div key={categoryIndex} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={category.name}
                  onChange={e => {
                    const categories = [...(content.categories || [])]
                    categories[categoryIndex].name = e.target.value
                    onChange({ ...content, categories })
                  }}
                  className="text-lg font-medium px-4 py-2 border border-neutral-300 rounded-lg"
                  placeholder="Category Name"
                />
                <button
                  onClick={() => {
                    const categories = [...(content.categories || [])]
                    categories.splice(categoryIndex, 1)
                    onChange({ ...content, categories })
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => {
                          const categories = [...(content.categories || [])]
                          categories[categoryIndex].items[itemIndex].name = e.target.value
                          onChange({ ...content, categories })
                        }}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        placeholder="Item Name"
                      />
                      <textarea
                        value={item.description}
                        onChange={e => {
                          const categories = [...(content.categories || [])]
                          categories[categoryIndex].items[itemIndex].description = e.target.value
                          onChange({ ...content, categories })
                        }}
                        className="w-full h-24 px-4 py-2 border border-neutral-300 rounded-lg"
                        placeholder="Item Description"
                      />
                      <input
                        type="text"
                        value={item.price}
                        onChange={e => {
                          const categories = [...(content.categories || [])]
                          categories[categoryIndex].items[itemIndex].price = e.target.value
                          onChange({ ...content, categories })
                        }}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                        placeholder="Price"
                      />
                    </div>
                    <div>
                      <ImageUpload
                        value={item.image}
                        onChange={url => {
                          const categories = [...(content.categories || [])]
                          categories[categoryIndex].items[itemIndex].image = url
                          onChange({ ...content, categories })
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addMenuItem(categoryIndex)}
                  className="w-full p-2 border border-dashed border-neutral-300
                    hover:border-primary-ochre rounded-lg text-neutral-600
                    hover:text-primary-ochre transition-colors"
                >
                  Add Menu Item
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addCategory}
            className="w-full p-4 border-2 border-dashed border-neutral-300
              hover:border-primary-ochre rounded-lg text-neutral-600
              hover:text-primary-ochre transition-colors"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  )
}

function TestimonialsEditor({
  content,
  onChange
}: {
  content: Section['content']
  onChange: (content: Section['content']) => void
}) {
  const addTestimonial = () => {
    const testimonials = [...(content.testimonials || []), {
      author: '',
      role: '',
      content: '',
      image: '',
      rating: 5
    }]
    onChange({ ...content, testimonials })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="What Our Customers Say"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Testimonials
        </label>
        <div className="space-y-6">
          {(content.testimonials || []).map((testimonial, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <input
                    type="text"
                    value={testimonial.author}
                    onChange={e => {
                      const testimonials = [...(content.testimonials || [])]
                      testimonials[index] = { ...testimonial, author: e.target.value }
                      onChange({ ...content, testimonials })
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="Author Name"
                  />
                  <input
                    type="text"
                    value={testimonial.role}
                    onChange={e => {
                      const testimonials = [...(content.testimonials || [])]
                      testimonials[index] = { ...testimonial, role: e.target.value }
                      onChange({ ...content, testimonials })
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="Role or Company"
                  />
                  <textarea
                    value={testimonial.content}
                    onChange={e => {
                      const testimonials = [...(content.testimonials || [])]
                      testimonials[index] = { ...testimonial, content: e.target.value }
                      onChange({ ...content, testimonials })
                    }}
                    className="w-full h-32 px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="Testimonial Content"
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Rating
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={e => {
                        const testimonials = [...(content.testimonials || [])]
                        testimonials[index] = { ...testimonial, rating: parseInt(e.target.value) }
                        onChange({ ...content, testimonials })
                      }}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <ImageUpload
                    value={testimonial.image}
                    onChange={url => {
                      const testimonials = [...(content.testimonials || [])]
                      testimonials[index] = { ...testimonial, image: url }
                      onChange({ ...content, testimonials })
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    const testimonials = [...(content.testimonials || [])]
                    testimonials.splice(index, 1)
                    onChange({ ...content, testimonials })
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addTestimonial}
            className="w-full p-4 border-2 border-dashed border-neutral-300
              hover:border-primary-ochre rounded-lg text-neutral-600
              hover:text-primary-ochre transition-colors"
          >
            Add Testimonial
          </button>
        </div>
      </div>
    </div>
  )
}

function TeamEditor({
  content,
  onChange
}: {
  content: Section['content']
  onChange: (content: Section['content']) => void
}) {
  const addTeamMember = () => {
    const team = [...(content.team || []), {
      name: '',
      role: '',
      bio: '',
      image: '',
      social: {}
    }]
    onChange({ ...content, team })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Meet Our Team"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Team Members
        </label>
        <div className="space-y-6">
          {(content.team || []).map((member: TeamMember, index: number) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <input
                    type="text"
                    value={member.name}
                    onChange={e => {
                      const team = [...(content.team || [])]
                      team[index] = { ...member, name: e.target.value }
                      onChange({ ...content, team })
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="Member Name"
                  />
                  <input
                    type="text"
                    value={member.role}
                    onChange={e => {
                      const team = [...(content.team || [])]
                      team[index] = { ...member, role: e.target.value }
                      onChange({ ...content, team })
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="Role"
                  />
                  <textarea
                    value={member.bio}
                    onChange={e => {
                      const team = [...(content.team || [])]
                      team[index] = { ...member, bio: e.target.value }
                      onChange({ ...content, team })
                    }}
                    className="w-full h-32 px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="Bio"
                  />
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={member.social?.linkedin || ''}
                      onChange={e => {
                        const team = [...(content.team || [])]
                        team[index] = {
                          ...member,
                          social: { ...member.social, linkedin: e.target.value }
                        }
                        onChange({ ...content, team })
                      }}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                      placeholder="LinkedIn URL"
                    />
                    <input
                      type="text"
                      value={member.social?.twitter || ''}
                      onChange={e => {
                        const team = [...(content.team || [])]
                        team[index] = {
                          ...member,
                          social: { ...member.social, twitter: e.target.value }
                        }
                        onChange({ ...content, team })
                      }}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                      placeholder="Twitter URL"
                    />
                    <input
                      type="email"
                      value={member.social?.email || ''}
                      onChange={e => {
                        const team = [...(content.team || [])]
                        team[index] = {
                          ...member,
                          social: { ...member.social, email: e.target.value }
                        }
                        onChange({ ...content, team })
                      }}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div>
                  <ImageUpload
                    value={member.image}
                    onChange={url => {
                      const team = [...(content.team || [])]
                      team[index] = { ...member, image: url }
                      onChange({ ...content, team })
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    const team = [...(content.team || [])]
                    team.splice(index, 1)
                    onChange({ ...content, team })
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addTeamMember}
            className="w-full p-4 border-2 border-dashed border-neutral-300
              hover:border-primary-ochre rounded-lg text-neutral-600
              hover:text-primary-ochre transition-colors"
          >
            Add Team Member
          </button>
        </div>
      </div>
    </div>
  )
}

function HoursEditor({
  content,
  onChange
}: {
  content: Section['content']
  onChange: (content: Section['content']) => void
}) {
  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday',
    'friday', 'saturday', 'sunday'
  ]

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Opening Hours"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Business Hours
        </label>
        <div className="space-y-4">
          {days.map(day => (
            <div key={day} className="grid grid-cols-3 gap-4 items-center">
              <div className="font-medium capitalize">{day}</div>
              <input
                type="time"
                value={(content.hours as DayHours)?.[day]?.open || ''}
                onChange={e => onChange({
                  ...content,
                  hours: {
                    ...(content.hours || {}),
                    [day]: {
                      ...(content.hours?.[day] || {}),
                      open: e.target.value
                    }
                  }
                })}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg"
              />
              <input
                type="time"
                value={(content.hours as DayHours)?.[day]?.close || ''}
                onChange={e => onChange({
                  ...content,
                  hours: {
                    ...(content.hours || {}),
                    [day]: {
                      ...(content.hours?.[day] || {}),
                      close: e.target.value
                    }
                  }
                })}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LocationEditor({
  content,
  onChange
}: {
  content: Section['content']
  onChange: (content: Section['content']) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Our Location"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Address
        </label>
        <textarea
          value={content.address || ''}
          onChange={e => onChange({ ...content, address: e.target.value })}
          className="w-full h-32 px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Enter your full address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Google Maps Embed URL
        </label>
        <input
          type="text"
          value={content.mapUrl || ''}
          onChange={e => onChange({ ...content, mapUrl: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="https://www.google.com/maps/embed?..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={content.phone || ''}
          onChange={e => onChange({ ...content, phone: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="+1 234 567 8900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={content.email || ''}
          onChange={e => onChange({ ...content, email: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="contact@example.com"
        />
      </div>
    </div>
  )
}

function FaqEditor({
  content,
  onChange
}: {
  content: Section['content']
  onChange: (content: Section['content']) => void
}) {
  const addQuestion = () => {
    const faqs = [...(content.faqs || []), {
      question: '',
      answer: ''
    }]
    onChange({ ...content, faqs })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Frequently Asked Questions"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Questions
        </label>
        <div className="space-y-4">
          {(content.faqs || []).map((faq: { question: string; answer: string }, index: number) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="space-y-4">
                <input
                  type="text"
                  value={faq.question}
                  onChange={e => {
                    const faqs = [...(content.faqs || [])]
                    faqs[index] = { ...faq, question: e.target.value }
                    onChange({ ...content, faqs })
                  }}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                  placeholder="Question"
                />
                <textarea
                  value={faq.answer}
                  onChange={e => {
                    const faqs = [...(content.faqs || [])]
                    faqs[index] = { ...faq, answer: e.target.value }
                    onChange({ ...content, faqs })
                  }}
                  className="w-full h-32 px-4 py-2 border border-neutral-300 rounded-lg"
                  placeholder="Answer"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const faqs = [...(content.faqs || [])]
                      faqs.splice(index, 1)
                      onChange({ ...content, faqs })
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addQuestion}
            className="w-full p-4 border-2 border-dashed border-neutral-300
              hover:border-primary-ochre rounded-lg text-neutral-600
              hover:text-primary-ochre transition-colors"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  )
}

function ServicesEditor({
  content,
  onChange
}: {
  content: Section['content']
  onChange: (content: Section['content']) => void
}) {
  const addService = () => {
    const services = [...(content.services || []), {
      title: '',
      description: '',
      image: '',
      price: '',
      features: []
    }]
    onChange({ ...content, services })
  }

  const addFeature = (serviceIndex: number) => {
    const services = [...(content.services || [])]
    services[serviceIndex].features.push('')
    onChange({ ...content, services })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
          placeholder="Our Services"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Services
        </label>
        <div className="space-y-6">
          {(content.services || []).map((service: any, index: number) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <input
                    type="text"
                    value={service.title}
                    onChange={e => {
                      const services = [...(content.services || [])]
                      services[index] = { ...service, title: e.target.value }
                      onChange({ ...content, services })
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="Service Title"
                  />
                  <textarea
                    value={service.description}
                    onChange={e => {
                      const services = [...(content.services || [])]
                      services[index] = { ...service, description: e.target.value }
                      onChange({ ...content, services })
                    }}
                    className="w-full h-32 px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="Service Description"
                  />
                  <input
                    type="text"
                    value={service.price}
                    onChange={e => {
                      const services = [...(content.services || [])]
                      services[index] = { ...service, price: e.target.value }
                      onChange({ ...content, services })
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                    placeholder="Price (optional)"
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      Features
                    </label>
                    {service.features.map((feature: string, featureIndex: number) => (
                      <div key={featureIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={e => {
                            const services = [...(content.services || [])]
                            services[index].features[featureIndex] = e.target.value
                            onChange({ ...content, services })
                          }}
                          className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg"
                          placeholder="Feature"
                        />
                        <button
                          onClick={() => {
                            const services = [...(content.services || [])]
                            services[index].features.splice(featureIndex, 1)
                            onChange({ ...content, services })
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addFeature(index)}
                      className="w-full p-2 border border-dashed border-neutral-300
                        hover:border-primary-ochre rounded-lg text-neutral-600
                        hover:text-primary-ochre transition-colors"
                    >
                      Add Feature
                    </button>
                  </div>
                </div>
                <div>
                  <ImageUpload
                    value={service.image}
                    onChange={url => {
                      const services = [...(content.services || [])]
                      services[index] = { ...service, image: url }
                      onChange({ ...content, services })
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    const services = [...(content.services || [])]
                    services.splice(index, 1)
                    onChange({ ...content, services })
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addService}
            className="w-full p-4 border-2 border-dashed border-neutral-300
              hover:border-primary-ochre rounded-lg text-neutral-600
              hover:text-primary-ochre transition-colors"
          >
            Add Service
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SectionEditor({
  section,
  siteId,
  onClose,
  onUpdate
}: SectionEditorProps) {
  const [content, setContent] = useState(section.content)
  const [settings, setSettings] = useState(section.settings)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const response = await fetch(
        `/api/admin/portfolio/${siteId}/sections/${section.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content, settings }),
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update section')
      }

      onUpdate()
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update section')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="font-heading text-2xl">
            Edit {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-primary-ochre text-white rounded-lg
                hover:bg-primary-ochre/90 transition-colors flex items-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Section-specific editors */}
          {section.type === 'hero' && (
            <HeroEditor content={content} onChange={setContent} />
          )}
          {section.type === 'content' && (
            <ContentEditor content={content} onChange={setContent} />
          )}
          {section.type === 'gallery' && (
            <GalleryEditor content={content} onChange={setContent} />
          )}
          {section.type === 'menu' && (
            <MenuEditor content={content} onChange={setContent} />
          )}
          {section.type === 'testimonials' && (
            <TestimonialsEditor content={content} onChange={setContent} />
          )}
          {section.type === 'team' && (
            <TeamEditor content={content} onChange={setContent} />
          )}
          {section.type === 'hours' && (
            <HoursEditor content={content} onChange={setContent} />
          )}
          {section.type === 'location' && (
            <LocationEditor content={content} onChange={setContent} />
          )}
          {section.type === 'faq' && (
            <FaqEditor content={content} onChange={setContent} />
          )}
          {section.type === 'services' && (
            <ServicesEditor content={content} onChange={setContent} />
          )}

          {/* Common settings */}
          <div className="pt-6 border-t">
            <h3 className="font-medium mb-4">Section Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor || '#ffffff'}
                  onChange={e => setSettings({
                    ...settings,
                    backgroundColor: e.target.value
                  })}
                  className="w-full h-10 p-1 border border-neutral-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Text Color
                </label>
                <input
                  type="color"
                  value={settings.textColor || '#000000'}
                  onChange={e => setSettings({
                    ...settings,
                    textColor: e.target.value
                  })}
                  className="w-full h-10 p-1 border border-neutral-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Padding
                </label>
                <select
                  value={settings.padding || '4rem'}
                  onChange={e => setSettings({
                    ...settings,
                    padding: e.target.value
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                >
                  <option value="2rem">Small</option>
                  <option value="4rem">Medium</option>
                  <option value="6rem">Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Layout
                </label>
                <select
                  value={settings.layout || 'contained'}
                  onChange={e => setSettings({
                    ...settings,
                    layout: e.target.value as 'full' | 'contained'
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                >
                  <option value="contained">Contained</option>
                  <option value="full">Full Width</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 