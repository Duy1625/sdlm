'use client'

import { useState } from 'react'

const EMOJI_CATEGORIES = {
  'Gần đây': ['❤️', '👍', '😂', '😮', '😢', '😡'],
  'Cảm xúc': ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '😳', '🤪', '😵', '😡', '😠', '🤬'],
  'Biểu tượng': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '🦾', '🦿', '🦵', '🦶'],
  'Tim': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  'Vật phẩm': ['🎉', '🎊', '🎁', '🎈', '🎂', '🎀', '🏆', '🥇', '🥈', '🥉', '⭐', '🌟', '✨', '💫', '🔥', '💧', '💦', '☀️', '🌙', '⭐'],
}

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState('Gần đây')

  const handleEmojiClick = (emoji: string) => {
    onSelect(emoji)
    onClose()
  }

  return (
    <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-800">Biểu tượng cảm xúc</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-1 px-2 py-2 border-b bg-gray-50 overflow-x-auto">
        {Object.keys(EMOJI_CATEGORIES).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === category
                ? 'bg-emerald-600 text-white'
                : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="p-3 h-64 overflow-y-auto">
        <div className="grid grid-cols-8 gap-2">
          {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              className="text-2xl hover:bg-gray-100 rounded-lg p-2 transition-all hover:scale-125"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
