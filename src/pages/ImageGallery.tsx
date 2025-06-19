import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectImage {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail: string;
  type: 'image' | 'video';
}

interface ProjectData {
  id: string;
  title: string;
  images: ProjectImage[];
}

const ImageGallery = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjectImages = async () => {
      try {
        setError(null);

        const projectResponse = await fetch(`/projects/${id}/project.json`);
        if (!projectResponse.ok) {
          throw new Error('Project not found');
        }
        const projectData = await projectResponse.json();

        const imagesResponse = await fetch(`/api/projects?projectId=${id}`);
        if (!imagesResponse.ok) {
          const errorData = await imagesResponse.json();
          throw new Error(errorData.error || 'Failed to load images');
        }

        const { images } = await imagesResponse.json();

        if (!images || images.length === 0) {
          setError('No images found in this project');
        }

        setProject({
          id: id || '',
          title: projectData.title,
          images: images || []
        });
      } catch (error) {
        console.error('Failed to load project images:', error);
        setError(error instanceof Error ? error.message : 'Failed to load project images');
        setProject({
          id: id || '',
          title: id?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Project',
          images: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadProjectImages();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4"></div>
          <p className="text-white/60">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-light text-white/80 mb-4">Error</h2>
          <p className="text-white/50 mb-8">{error}</p>
          <Link to="/">
            <Button variant="outline" className="border-white/20 text-white/80 hover:bg-white/10 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!project || project.images.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-light text-white/80 mb-4">No images found</h2>
          <p className="text-white/50 mb-8">This project doesn't have any images yet.</p>
          <Link to="/">
            <Button variant="outline" className="border-white/20 text-white/80 hover:bg-white/10 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-light">{project.title}</h1>
                <p className="text-sm text-white/50">{project.images.length} items</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {project.images.map((item) => (
            <Card key={item.id} className="bg-black/40 border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {item.type === 'video' ? (
                    <video
                      src={item.thumbnail}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      muted
                      loop
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                  ) : (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedImage(item)}
                      className="bg-black/60 border-white/20 text-white hover:bg-black/80 backdrop-blur-sm"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-black/60 border-white/20 text-white hover:bg-black/80 backdrop-blur-sm"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-light text-white mb-2 text-lg">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-white/60">{item.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Image/Video Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-6">
          <div className="max-w-6xl max-h-full w-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-light text-white">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-white/60 mt-1">{selectedImage.description}</p>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="border-white/20 text-white/80 hover:bg-white/10 bg-black/40 backdrop-blur-sm"
                  onClick={() => window.open(selectedImage.url, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="border-white/20 text-white/80 hover:bg-white/10 bg-black/40 backdrop-blur-sm"
                  onClick={() => window.open(selectedImage.url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedImage(null)}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              {selectedImage.type === 'video' ? (
                <video
                  src={selectedImage.url}
                  controls
                  className="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg"
                />
              ) : (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
