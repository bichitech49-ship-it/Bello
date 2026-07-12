import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link as LinkIcon, LogOut, Image as ImageIcon, Video, FolderPlus, Upload, Globe, Youtube, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface Project {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: string;
  date: string;
}

export default function Admin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaSource, setMediaSource] = useState<'upload' | 'url'>('upload');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [date, setDate] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setMediaType('image');
        setMediaFile(file);
      } else if (file.type.startsWith('video/')) {
        setMediaType('video');
        setMediaFile(file);
      } else {
        setErrorMessage('Unsupported file type. Please drop an image or a video.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!title || !description) {
      setErrorMessage('Please enter project name and description.');
      return;
    }
    
    if (mediaSource === 'upload' && !mediaFile) {
      setErrorMessage('Please upload or drag an image or video file.');
      return;
    }
    
    if (mediaSource === 'url' && !mediaUrlInput) {
      setErrorMessage('Please provide a valid media URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('mediaType', mediaType);
      formData.append('date', date || new Date().toISOString().split('T')[0]);

      if (mediaSource === 'upload' && mediaFile) {
        formData.append('mediaFile', mediaFile);
      } else {
        formData.append('mediaUrl', mediaUrlInput);
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setMediaFile(null);
        setMediaUrlInput('');
        setDate('');
        setSuccessMessage('Achievement successfully published!');
        fetchProjects();
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        let errMsg = 'Failed to publish achievement.';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errMsg = errorData.error || errMsg;
          } else {
            const text = await res.text();
            // Check if it looks like a Payload Too Large or standard Nginx error
            if (res.status === 413) {
              errMsg = 'File size is too large. Please select a smaller image or video file (recommended under 20MB).';
            } else {
              errMsg = `Server error (${res.status}): ${text.substring(0, 100) || res.statusText || 'Unknown issue'}`;
            }
          }
        } catch (jsonErr) {
          errMsg = `HTTP Error ${res.status}: ${res.statusText || 'Failed to parse error description'}`;
        }
        setErrorMessage(errMsg);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'A network error occurred. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const performDelete = async (id: string) => {
    setIsDeleting(id);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMessage('Achievement successfully deleted!');
        fetchProjects();
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Failed to delete achievement.');
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'An error occurred while deleting the achievement.');
    } finally {
      setIsDeleting(null);
      setDeleteConfirmId(null);
    }
  };

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-red-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-5 px-8 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-display text-slate-900 font-extrabold text-2xl tracking-tight flex items-center">
            <span className="bg-red-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">BE</span>
            Bello El-Rufai
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-medium flex items-center font-display">
            <FolderPlus className="w-5 h-5 mr-2 text-red-600" />
            Admin Dashboard
          </span>
        </div>
        <Link to="/" className="flex items-center text-sm font-bold text-slate-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-display">
          <LogOut size={18} className="mr-2" />
          Back to Site
        </Link>
      </header>

      <main className="flex-1 p-8 max-w-7xl w-full mx-auto grid grid-cols-1 xl:grid-cols-3 gap-10 relative">
        
        {/* Left Column: Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="xl:col-span-1 xl:sticky xl:top-28 h-fit"
        >
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-red-50 text-red-600 p-2 rounded-xl mr-3">
                <Plus size={24} />
              </span>
              Publish Achievement
            </h2>

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-sm font-medium"
              >
                <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={18} />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center space-x-2 text-sm font-medium"
              >
                <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 font-display">Achievement / Project Title</label>
                <input 
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                  placeholder="e.g. Free Laptop Distribution to Students"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 font-display">Description & Key Highlights</label>
                <textarea 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white outline-none transition-all h-28 resize-none font-medium text-slate-900"
                  placeholder="Summarize the project activities, target group, and development impact..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 font-display">Date of Execution</label>
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white outline-none transition-all font-medium text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 font-display">Media Format</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setMediaType('image')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${mediaType === 'image' ? 'bg-white text-red-600 shadow' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      <ImageIcon size={14} />
                      <span>Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('video')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${mediaType === 'video' ? 'bg-white text-red-600 shadow' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      <Video size={14} />
                      <span>Video</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Source Select */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2.5 font-display">Media Upload Source</label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => { setMediaSource('upload'); setMediaUrlInput(''); }}
                    className={`flex-1 py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center space-x-2 transition-all ${mediaSource === 'upload' ? 'border-red-600 bg-red-50/50 text-red-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'}`}
                  >
                    <Upload size={16} />
                    <span>Upload File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMediaSource('url'); setMediaFile(null); }}
                    className={`flex-1 py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center space-x-2 transition-all ${mediaSource === 'url' ? 'border-red-600 bg-red-50/50 text-red-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'}`}
                  >
                    <Globe size={16} />
                    <span>Web URL</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Media Inputs */}
              {mediaSource === 'upload' ? (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 font-display">Select Image/Video File</label>
                  <div 
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative ${
                      dragActive 
                        ? 'border-red-500 bg-red-50/40' 
                        : mediaFile 
                          ? 'border-emerald-400 bg-emerald-50/10' 
                          : 'border-slate-300 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-400'
                    }`}
                  >
                    <input 
                      type="file"
                      accept={mediaType === 'image' ? "image/*" : "video/*"}
                      onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                      <div className={`p-3 rounded-xl ${mediaFile ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Upload size={22} />
                      </div>
                      {mediaFile ? (
                        <div>
                          <p className="text-sm font-bold text-emerald-800 line-clamp-1">{mediaFile.name}</p>
                          <p className="text-xs text-emerald-600 mt-1 font-medium">
                            {(mediaFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Drag & drop file here or <span className="text-red-600">browse</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Supports any {mediaType} files
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 font-display">Media Web Link / URL</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-slate-400">
                      {getYouTubeId(mediaUrlInput) ? <Youtube className="text-red-600" size={18} /> : <Globe size={18} />}
                    </div>
                    <input 
                      type="url"
                      value={mediaUrlInput}
                      onChange={(e) => setMediaUrlInput(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white outline-none transition-all font-medium text-slate-950 text-sm"
                      placeholder={mediaType === 'image' ? "e.g. https://images.unsplash.com/...jpg" : "e.g. YouTube video URL"}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                    Paste any live image URL or a YouTube/Vimeo video link directly.
                  </p>
                </div>
              )}

              {/* Dynamic Live Media Preview */}
              {((mediaSource === 'upload' && mediaFile) || (mediaSource === 'url' && mediaUrlInput)) && (
                <div className="bg-slate-100 p-4.5 rounded-2xl border border-slate-200/60">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-display flex items-center justify-between">
                    <span>Live Preview</span>
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-black">Ready</span>
                  </div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 relative">
                    {mediaSource === 'upload' && mediaFile ? (
                      mediaType === 'image' ? (
                        <img 
                          src={URL.createObjectURL(mediaFile)} 
                          className="w-full h-full object-cover" 
                          alt="preview" 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
                          <Video size={28} className="text-red-500 mb-2 animate-pulse" />
                          <p className="text-xs font-bold text-center line-clamp-1">{mediaFile.name}</p>
                          <span className="text-[10px] text-slate-400 mt-1">Video file upload selected</span>
                        </div>
                      )
                    ) : (
                      (() => {
                        const ytId = getYouTubeId(mediaUrlInput);
                        if (ytId) {
                          return (
                            <iframe 
                              src={`https://www.youtube.com/embed/${ytId}`}
                              title="Youtube preview"
                              className="w-full h-full border-0"
                            />
                          );
                        } else {
                          return mediaType === 'image' ? (
                            <img 
                              src={mediaUrlInput} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=400&q=80';
                              }}
                              alt="preview" 
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
                              <Video size={28} className="text-red-500 mb-2" />
                              <p className="text-xs font-bold text-center break-all line-clamp-2">{mediaUrlInput}</p>
                              <span className="text-[10px] text-slate-400 mt-1">External video reference link</span>
                            </div>
                          );
                        }
                      })()
                    )}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold text-lg py-4 rounded-xl hover:from-red-700 hover:to-rose-800 transition-all disabled:from-slate-400 disabled:to-slate-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex justify-center items-center mt-4 font-display tracking-wide"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Uploading & Publishing...</span>
                  </span>
                ) : (
                  'Publish Achievement'
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Right Column: Projects List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="xl:col-span-2"
        >
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 min-h-full">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-8 flex items-center">
              Manage Executed Projects
              <span className="ml-4 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
                {projects.length} Total
              </span>
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <motion.div 
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 border border-slate-100 bg-slate-50 hover:bg-white rounded-2xl hover:shadow-lg transition-all group"
                    >
                      <div className="w-full sm:w-40 h-40 sm:h-28 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 relative flex items-center justify-center">
                        {project.mediaType === 'video' ? (
                          (() => {
                            const ytId = getYouTubeId(project.mediaUrl);
                            if (ytId) {
                              return (
                                <img 
                                  src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} 
                                  className="w-full h-full object-cover" 
                                  alt={project.title}
                                />
                              );
                            }
                            return <video src={project.mediaUrl} className="w-full h-full object-cover" />;
                          })()
                        ) : (
                          <img src={project.mediaUrl} alt={project.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                          {project.mediaType}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-red-600 mb-1">{new Date(project.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        <h4 className="font-display text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-red-600 transition-colors">{project.title}</h4>
                        <p className="text-slate-600 line-clamp-2 leading-relaxed">{project.description}</p>
                      </div>
                      <div className="pt-2 sm:pt-0 flex items-center">
                        {deleteConfirmId === project.id ? (
                          <div className="flex items-center space-x-2 bg-red-50 border border-red-100 p-2 rounded-2xl shadow-sm">
                            <span className="text-[11px] font-bold text-red-700 px-1.5 whitespace-nowrap">Confirm delete?</span>
                            <button
                              onClick={() => performDelete(project.id)}
                              disabled={isDeleting === project.id}
                              className="px-2.5 py-1.5 bg-red-600 text-white text-xs font-black rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:bg-slate-400 whitespace-nowrap"
                            >
                              {isDeleting === project.id ? "..." : "Delete"}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              disabled={isDeleting === project.id}
                              className="px-2.5 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-300 transition-colors whitespace-nowrap"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setDeleteConfirmId(project.id)}
                            className="p-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors focus:ring-4 focus:ring-red-100"
                            title="Delete project"
                          >
                            <Trash2 size={24} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <FolderPlus size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-xl font-bold text-slate-700 mb-2">No projects found</p>
                    <p className="text-slate-500">Use the form to add a new project.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
