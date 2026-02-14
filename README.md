# 🎨 Art Powerpoint

**Art Powerpoint** is a premium, high-performance presentation builder designed for professional creators. Built with Next.js and Framer Motion, it offers a smooth, desktop-like experience entirely in the browser.

## ✨ Core Features

### 🎬 Advanced Animations
- **Motion Engine**: Powered by `framer-motion` for fluid, hardware-accelerated transitions.
- **Animation Types**: Select from `Fade In`, `Slide In`, `Zoom In`, `Bounce`, `Rotate`, `Rotate 3D`, `Floating`, `Glitch`, and `Pulse`.
- **Entrance Effects**: Configure duration, delay, and easing for every element.

### 🛠️ Professional Editor
- **3D Hover Effects**: Elements respond dynamically to your cursor with depth and tilt effects.
- **Layering Controls**: Precise "Bring to Front" and "Send to Back" layering (Z-Index).
- **Alignment Tools**: Instant Left, Center, and Right alignment relative to the slide.
- **Floating Context Bar**: Quickly access animations and layer controls for selected elements.

### 🤝 Collaboration & Sharing
- **Public Links**: Generate shareable links for anyone to view.
- **Permissions System**: Granular role control (Viewer vs. Editor) for public links and private invites.
- **Email Invites**: Invite collaborators directly via email.

### 📁 Management & Workflow
- **History & Restore**: View version history and restore previous states.
- **Trash System**: Safety-first deletion with a dedicated Trash bin for restoring deleted presentations.
- **Drag & Drop Reordering**: Organize your presentations on the dashboard with intuitive drag-and-drop.
- **PPTX Import**: Import existing PowerPoint files directly into the editor.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag & Drop**: [React DnD](https://react-dnd.github.io/react-dnd/)

## 🛠️ Installation

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components and element-specific logic.
- `lib/store/`: Zustand stores for global state (presentation, selection, etc.).
- `lib/types/`: TypeScript definitions and schemas.
- `lib/templates/`: Pre-designed presentation templates.

## 📝 License

This project is licensed under the MIT License.
