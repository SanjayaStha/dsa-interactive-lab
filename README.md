# DSA Interactive Lab

An interactive learning platform for Data Structures and Algorithms with visual animations, live data visualization, and step-by-step algorithm execution.

## Features

- 🎨 **Interactive Visualizations**: See algorithms come to life with real-time animations
- ⏯️ **Playback Controls**: Play, pause, step forward/backward through algorithm execution
- 📊 **Performance Metrics**: Track operations, comparisons, and memory usage
- 🎯 **Multi-Language Support**: View implementations in Python, Java, JavaScript, and C++
- 🧪 **Practice Sandbox**: Experiment with custom inputs
- 📈 **Progress Tracking**: Monitor your learning journey

## Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion, Canvas API, D3.js
- **Testing**: Vitest, fast-check (property-based testing)
- **Database**: PostgreSQL, Redis
- **Development**: Docker, ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose (for database)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dsa-interactive-lab
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the database:
```bash
docker-compose up -d
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
dsa-interactive-lab/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── controls/          # Playback controls
│   ├── ui/                # UI components
│   └── visualizers/       # Data structure visualizers
├── lib/                   # Core library code
│   ├── engines/           # Algorithm engines
│   ├── stores/            # Zustand stores
│   ├── utils/             # Utility functions
│   └── visualizers/       # Visualizer implementations
├── types/                 # TypeScript type definitions
├── db/                    # Database schemas and migrations
└── public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once

## Implemented Features

### Phase 1: Core Infrastructure ✅
- Next.js project setup with TypeScript
- Tailwind CSS configuration
- Vitest and fast-check setup
- PostgreSQL and Redis with Docker
- Project directory structure

### Phase 2: Core Data Models ✅
- TypeScript interfaces for algorithm engine
- Animation controller types
- Visualizer interfaces
- Session and progress types

### Phase 3: Algorithm Engine ✅
- Base AlgorithmEngine class
- Bubble Sort implementation
- Selection Sort implementation
- Insertion Sort implementation
- Merge Sort implementation ✨ NEW
- Quick Sort implementation ✨ NEW
- Step generation with metrics tracking
- Animation store with Zustand

### Phase 4: Searching Algorithms ✅ NEW
- Linear Search implementation
- Binary Search implementation
- Search target visualization

### Phase 5: Data Structures ✅ NEW
- Stack (LIFO) with push/pop operations
- Queue (FIFO) with enqueue/dequeue operations
- Stack visualizer component
- Queue visualizer component

### Phase 6: Visualization ✅
- Array visualizer with Canvas
- Stack visualizer with vertical layout ✨ NEW
- Queue visualizer with horizontal layout ✨ NEW
- Playback controls component
- Interactive demo page ✨ NEW

### Phase 7: User Interface ✅
- Interactive home page with bubble sort demo
- Algorithm library browser page
- Multi-algorithm demo page ✨ NEW
- Algorithm selector with categories
- Custom input for all algorithms
- Responsive design

## Roadmap

### Phase 8: Tree Data Structures ⏳
- Binary Tree visualization
- Binary Search Tree with insertion/deletion
- AVL Tree with rotation animations
- Heap with heapify operations

### Phase 9: Graph Algorithms ⏳
- Graph representation (adjacency list/matrix)
- BFS visualization
- DFS visualization
- Dijkstra's shortest path
- Topological sort

### Phase 10: Advanced Features ⏳
- Multi-language code display (Python, Java, JS, C++)
- Syntax highlighting with Prism.js
- Practice sandbox with custom inputs
- Guided exercises with hints
- Challenge problems with test cases
- Progress tracking and achievements

### Phase 11: AI Integration ⏳
- AI tutor chatbot for explanations
- Code explanation and analysis
- Mistake detection and suggestions
- Complexity analysis assistance
- Personalized learning paths

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built with modern web technologies and best practices for interactive learning.
