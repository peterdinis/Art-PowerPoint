# Presentation Builder

A PowerPoint-like presentation application built with Next.js, TypeScript, and React.

## Features

- 📊 **Dashboard** - Overview of all presentations
- ✏️ **Editor** - Create and edit slides
- 🎨 **Elements** - Text, images, shapes
- 💾 **Auto-save** - Automatic saving to localStorage
- 🎯 **Drag & Drop** - Move elements on slides

## Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **React DnD** - Drag and drop
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Installation
```bash
npm install
```

## Running the App
```bash
npm run dev
```

The app will run on [http://localhost:3000](http://localhost:3000)

## Project Structure
```
presentation-builder/
├── app/
│   ├── page.tsx          # Dashboard
│   ├── editor/
│   │   └── page.tsx       # Editor page
│   └── layout.tsx
├── components/
│   ├── EditorCanvas.tsx   # Main canvas for editing
│   ├── SlideElement.tsx   # Slide element
│   ├── SlidePanel.tsx     # Slide panel
│   ├── Toolbar.tsx        # Toolbar
│   └── PropertiesPanel.tsx # Element properties panel
├── lib/
│   ├── types/
│   │   └── presentation.ts # Presentation types
│   └── store/
│       └── presentationStore.ts # Zustand store
└── components/
```

## Usage

1. **Create a presentation**: Click "Create New Presentation" on the dashboard
2. **Add elements**: Use the toolbar in the editor to add text, images, or shapes
3. **Edit elements**: Click on an element and modify it in the properties panel
4. **Manage slides**: Add, delete, and duplicate slides in the left panel
5. **Save**: Presentations are automatically saved to localStorage
