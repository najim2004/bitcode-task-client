# Client (React + Vite)

This project is a React application bootstrapped with Vite. It provides a modern development environment with features like hot module replacement (HMR) and fast build times. The application is a roadmap application that allows users to view and manage roadmap items.

## Technologies Used

- React
- Vite

- @tailwindcss/vite
- Axios
- clsx
- lucide-react
- react-router-dom
- tailwind-merge
- Tailwind CSS

## Project Structure

- `index.html`: The main HTML file.
- `src/`: Contains the React application source code.
  - `App.jsx`: The main application component, responsible for routing and layout.
  - `index.css`: Global styles for the application.
  - `main.jsx`: Entry point for the React application.
  - `assets/`: Contains static assets such as images and SVGs.
  - `components/`: Reusable React components.
    - `AuthModal.jsx`: Authentication modal component.
    - `CommentSection.jsx`: Component for displaying and managing comments.
    - `Filters.jsx`: Component for filtering roadmap items.
    - `Footer.jsx`: Footer component.
    - `Navbar.jsx`: Navigation bar component.
    - `RoadmapItem.jsx`: Component for displaying a single roadmap item.
    - `RoadmapList.jsx`: Component for displaying a list of roadmap items.
  - `context/`: React Context providers.
    - `AuthContext.jsx`: Authentication context.
- `public/`: Static assets.
- `vite.config.js`: Vite configuration file.
- `eslint.config.js`: ESLint configuration file.
- `package.json`: Project dependencies and scripts.

## Getting Started

### Prerequisites

- Node.js (>=18)
- npm or yarn

### Installation

```bash
npm install
```

or

```bash
yarn install
```

### Environment Variables

Create a `.env` file in the root of the `client` directory and add the following variable:

```env
VITE_API_URL=<your-backend-api-url>
```
Replace `<your-backend-api-url>` with the actual URL of your backend API.

### Backend

Backend repository: [https://github.com/najim2004/bitcode-task-server](https://github.com/najim2004/bitcode-task-server)


### Development

To run the application in development mode with hot module replacement:

```bash
npm run dev
```

or

```bash
yarn dev
```

This will start a development server at `http://localhost:5173`.

### Production Build

To build the application for production:

```bash
npm run build
```

or

```bash
yarn build
```

This will create an optimized build in the `dist` directory.

### Linter

To run the linter:

```bash
npm run lint
```

or

```bash
yarn lint
```

## ESLint Configuration

The project uses ESLint for code linting. The configuration is defined in `eslint.config.js` and includes the following:

- `eslint:recommended` rules
- `react-hooks/rules`
- `react-refresh/only-export-components`
- Ignores the `dist` directory

## Contributing

Contributions are welcome! Please submit a pull request with your changes.
