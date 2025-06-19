
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Image, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CodeBlock from '@/components/CodeBlock';

interface ProjectFile {
  name: string;
  content: string;
  language: string;
}

interface ProjectData {
  id: string;
  title: string;
  description: string;
  files: ProjectFile[];
  hasImages: boolean;
  downloadUrl?: string;
}

const ProjectView = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [activeFile, setActiveFile] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = () => {
      const sampleProject: ProjectData = {
        id: id || '',
        title: 'React Todo App',
        description: 'A simple todo application built with React and TypeScript',
        hasImages: true,
        downloadUrl: '/downloads/react-todo-app.zip',
        files: [
          {
            name: 'App.tsx',
            language: 'typescript',
            content: `import React, { useState } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Todo App</h1>
        <AddTodo onAdd={addTodo} />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  );
};

export default App;`
          },
          {
            name: 'components/TodoList.tsx',
            language: 'typescript',
            content: `import React from 'react';
import TodoItem from './TodoItem';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No todos yet. Add one above!
      </div>
    );
  }

  return (
    <div className="mt-6">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;`
          },
          {
            name: 'styles.css',
            language: 'css',
            content: `/* Todo App Styles */
.todo-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e5e5e5;
  transition: background-color 0.2s ease;
}

.todo-item:hover {
  background-color: #f8f9fa;
}

.todo-checkbox {
  margin-right: 12px;
  width: 18px;
  height: 18px;
}

.todo-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.todo-text.completed {
  text-decoration: line-through;
  color: #999;
}

.delete-button {
  background: #ff4757;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.delete-button:hover {
  background: #ff3838;
}

.add-todo-form {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.add-todo-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.add-todo-button {
  background: #2ed573;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.add-todo-button:hover {
  background: #26d467;
}`
          }
        ]
      };
      
      setProject(sampleProject);
      setLoading(false);
    };

    loadProject();
  }, [id]);

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-300 mb-2">Project not found</h2>
          <p className="text-gray-500 mb-4">The requested project could not be loaded.</p>
          <Link to="/">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">{project.title}</h1>
                <p className="text-sm text-gray-400">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {project.hasImages && (
                <Link to={`/project/${project.id}/images`}>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Image className="w-4 h-4 mr-2" />
                    View Gallery
                  </Button>
                </Link>
              )}
              {project.downloadUrl && (
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Download className="w-4 h-4 mr-2" />
                  Download ZIP
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300">Files</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {project.files.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFile(index)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        activeFile === index
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                      }`}
                    >
                      {file.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {project.files[activeFile]?.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(project.files[activeFile]?.content || '')}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {project.files[activeFile] && (
                  <CodeBlock
                    code={project.files[activeFile].content}
                    language={project.files[activeFile].language}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
