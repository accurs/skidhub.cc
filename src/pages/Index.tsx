import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Image, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Project {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  leakedBy: string;
  hasImages: boolean;
  createdAt?: string;
  downloadUrl: string;
}

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/projects/index.json');
        if (!response.ok) {
          throw new Error('Failed to load projects index');
        }
        const projectList = await response.json();
        
        const projectsData: Project[] = [];
        
        for (const projectId of projectList.projects) {
          try {
            const projectResponse = await fetch(`/projects/${projectId}/project.json`);
            if (projectResponse.ok) {
              const projectData = await projectResponse.json();
              
              let hasImages = false;
              try {
                const imagesResponse = await fetch(`/api/projects?projectId=${projectId}`);
                hasImages = imagesResponse.ok;
              } catch {
                hasImages = false;
              }
              
              projectsData.push({
                id: projectId,
                title: projectData.title,
                description: projectData.description,
                createdBy: projectData.createdBy || 'Unknown',
                leakedBy: projectData.leakedBy || 'Unknown',
                hasImages,
                createdAt: projectData.createdAt,
                downloadUrl: `/projects/${projectId}/source.zip`
              });
            }
          } catch (error) {
            console.error(`Failed to load project ${projectId}:`, error);
          }
        }
        
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to load projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const getLanguageColor = (language?: string) => {
    if (!language) return 'bg-white/10 text-white/60 border-white/20';
    
    const colors: Record<string, string> = {
      typescript: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      javascript: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      python: 'bg-green-500/20 text-green-300 border-green-500/30',
      css: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      html: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      java: 'bg-red-500/20 text-red-300 border-red-500/30',
    };
    return colors[language] || 'bg-white/10 text-white/60 border-white/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4"></div>
          <p className="text-white/60">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <FolderOpen className="w-7 h-7 text-white" />
            <h1 className="text-2xl font-light">SkidHub</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-light mb-4">Source Archive</h2>
          <p className="text-white/60 text-lg">Since someone likes to falsely DMCA, everything will now be hosted here.</p>
          <p className="text-white/60 text-lg">Any questions? Contact: @comminate or me@alerinia.dev</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="bg-black/40 border-white/10 hover:border-white/20 transition-all duration-300 group backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <CardTitle className="text-xl text-white group-hover:text-white/90 transition-colors font-light">
                      {project.title}
                    </CardTitle>
                    <p className="text-sm text-white/60 mt-1">Created by {project.createdBy}</p>
                    <p className="text-sm text-white/60 mt-1">Leaked by {project.leakedBy}</p>
                  </div>
                </div>
                <CardDescription className="text-white/60 leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-6">
                    <a 
                      href={project.downloadUrl}
                      download
                      className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download</span>
                    </a>
                    {project.hasImages && (
                      <Link 
                        to={`/project/${project.id}/images`}
                        className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                      >
                        <Image className="w-4 h-4" />
                        <span className="text-sm">View Images</span>
                      </Link>
                    )}
                  </div>
                  {project.createdAt && (
                    <span className="text-xs text-white/40">{project.createdAt}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-24">
            <FolderOpen className="w-20 h-20 text-white/20 mx-auto mb-6" />
            <h3 className="text-2xl font-light text-white/60 mb-3">No projects found</h3>
            <p className="text-white/40">Add projects to the /public/projects directory</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
