import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Navigation, Video, Image as ImageIcon, X, Calendar, Maximize2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const profilePhoto = "https://i.ibb.co/N28XkJb4/182a4033-5d50-4809-8bb9-5e66e7d05dc4.jpg";

interface Project {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: string;
  date: string;
}

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(profilePhoto);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [secretClicks, setSecretClicks] = useState(0);

  const handleSecretClick = () => {
    setSecretClicks((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        navigate('/bello-elrufai-admin-portal');
        return 0;
      }
      return next;
    });
  };

  // Reset clicks after 1.5 seconds of inactivity to avoid accidental redirects
  useEffect(() => {
    if (secretClicks > 0) {
      const timer = setTimeout(() => {
        setSecretClicks(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [secretClicks]);

  const handleProfileImageError = () => {
    // Elegant fallback sequence if the primary image fails
    if (profileImage === profilePhoto) {
      setProfileImage("https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"); // High quality executive placeholder
    }
  };

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Half: Photo */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 h-[70vh] lg:h-screen relative bg-slate-950 overflow-hidden"
        >
          <img 
            src={profileImage} 
            alt="Hon. Bello El-Rufai" 
            referrerPolicy="no-referrer"
            onError={handleProfileImageError}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-100 contrast-[1.01]"
          />
          {/* Beautiful gradient vignette at the bottom and sides of the photo for dynamic lighting and absolute text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          {/* Bold Name & Aspiration Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 text-white w-full">
            <div className="backdrop-blur-md bg-slate-950/75 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Vibrant top line accent representing legislative duty */}
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500" />
              
              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2 text-white leading-none uppercase"
              >
                Hon. Bello El-Rufai
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col gap-1"
              >
                <p className="text-sm sm:text-base text-amber-500 font-extrabold tracking-widest uppercase font-display">
                  Aspiring for Re-election & Continuous Quality Representation
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-semibold font-sans">
                  House of Representatives • Kaduna North Federal Constituency
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Half: Achievements Summary */}
        <div className="lg:w-1/2 h-auto lg:h-screen flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-24 overflow-y-auto bg-white border-l border-slate-100">
          <div className="max-w-xl">
            {/* Elegant Header with Name and Legislative Title */}
            <div className="mb-10 relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-600 rounded-full" />
              <div className="pl-4">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center space-x-2 text-emerald-700 font-extrabold tracking-widest uppercase text-xs mb-3 font-display"
                >
                  <span>Federal House of Representatives</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4 leading-none"
                >
                  Hon. Bello El-Rufai
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-base sm:text-lg text-slate-600 font-bold font-display"
                >
                  Member representing Kaduna North Federal Constituency
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-sm sm:text-base text-slate-400 font-semibold font-sans mt-1"
                >
                  Kaduna State, Nigeria
                </motion.p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold mb-8 border border-emerald-100 uppercase tracking-widest font-display"
            >
              <CheckCircle2 size={16} />
              <span>Dedicated to Progress</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display text-4xl lg:text-5xl font-bold mb-6 text-slate-900 leading-tight tracking-tight"
            >
              Transforming Kaduna North Through <span className="text-emerald-600">Action.</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-slate-600 mb-10 leading-relaxed font-medium"
            >
              Committed to sustainable development, youth empowerment, and infrastructural advancement. Hon. Bello El-Rufai is actively working to deliver the dividends of democracy to the good people of Kaduna North.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6 mb-12"
            >
              <div className="flex items-start space-x-4 border-b border-slate-100 pb-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Navigation className="text-blue-600 flex-shrink-0" size={24} />
                </div>
                <p className="text-slate-800 font-semibold pt-1 text-lg">Advocating for policies that foster economic growth.</p>
              </div>
              <div className="flex items-start space-x-4 border-b border-slate-100 pb-4">
                <div className="bg-amber-50 p-3 rounded-xl">
                  <Navigation className="text-amber-600 flex-shrink-0" size={24} />
                </div>
                <p className="text-slate-800 font-semibold pt-1 text-lg">Driving community-centric infrastructural projects.</p>
              </div>
              <div className="flex items-start space-x-4 border-b border-slate-100 pb-4">
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <Navigation className="text-emerald-600 flex-shrink-0" size={24} />
                </div>
                <p className="text-slate-800 font-semibold pt-1 text-lg">Empowering the youth with education and skill acquisition.</p>
              </div>
            </motion.div>

            <motion.a 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              href="#projects" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-200/50 hover:-translate-y-1 font-display tracking-wide"
            >
              View Community Projects
              <ArrowRight className="ml-3" size={20} />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-8 lg:px-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 space-y-6 md:space-y-0"
          >
            <div>
              <h3 className="text-sm font-bold tracking-widest text-emerald-600 uppercase mb-3 flex items-center font-display">
                <span className="w-8 h-0.5 bg-emerald-600 mr-3"></span>
                Our Impact
              </h3>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                Political Achievements & <span className="text-emerald-600">Community Projects</span>
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-200/60 p-1.5 rounded-2xl border border-slate-300/30 self-start">
              {(['all', 'image', 'video'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide capitalize transition-all duration-300 font-display ${
                    filter === type
                      ? 'bg-white text-emerald-700 shadow-md'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {type === 'all' ? 'All Work' : type === 'image' ? 'Photos' : 'Videos'}
                </button>
              ))}
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {projects.filter(p => filter === 'all' || p.mediaType === filter).length > 0 ? (
                projects
                  .filter(p => filter === 'all' || p.mediaType === filter)
                  .map((project, index) => {
                    const ytId = project.mediaType === 'video' ? project.mediaUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)?.[2] : null;
                    const isYoutube = project.mediaType === 'video' && ytId && ytId.length === 11;
                    
                    return (
                      <motion.div 
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedProject(project)}
                        className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col h-full"
                      >
                        <div className="aspect-video w-full bg-slate-950 relative overflow-hidden flex-shrink-0">
                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                            <span className="bg-white/90 backdrop-blur-md p-3.5 rounded-full text-slate-900 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                              <Maximize2 size={20} className="text-emerald-600" />
                            </span>
                          </div>

                          {project.mediaType === 'video' ? (
                            isYoutube ? (
                              <div className="w-full h-full relative">
                                <img 
                                  src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} 
                                  alt={project.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
                                  <span className="bg-emerald-600 p-3.5 rounded-full text-white shadow-lg">
                                    <Video size={20} />
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full relative">
                                <video 
                                  src={project.mediaUrl} 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                                  <span className="bg-emerald-600 p-3.5 rounded-full text-white shadow-lg">
                                    <Video size={20} />
                                  </span>
                                </div>
                              </div>
                            )
                          ) : (
                            <img 
                              src={project.mediaUrl} 
                              alt={project.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 shadow-sm z-10 font-display">
                            {new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </div>
                        </div>

                        <div className="p-8 bg-white border-t border-slate-100 rounded-b-3xl flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 font-display">
                              {project.mediaType === 'video' ? <Video size={14} /> : <ImageIcon size={14} />}
                              <span>{project.mediaType === 'video' ? 'Video Report' : 'Photo Insight'}</span>
                            </div>
                            <h4 className="font-display text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-snug">{project.title}</h4>
                            <p className="text-slate-600 leading-relaxed text-base line-clamp-3">
                              {project.description}
                            </p>
                          </div>
                          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-slate-400 group-hover:text-emerald-700 transition-all font-display">
                            <span className="text-xs font-black tracking-widest uppercase">View full achievement details</span>
                            <ArrowRight size={16} className="transform group-hover:translate-x-1.5 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
              ) : (
                <div className="col-span-full text-center py-20 text-slate-500 bg-white rounded-3xl border border-dashed border-slate-300">
                  <p className="text-lg">No achievements uploaded yet under this category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox / Media Viewer Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-950/85 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-white/10 shadow-2xl overflow-hidden w-full max-w-4xl relative max-h-[90vh] flex flex-col"
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 hover:text-emerald-500 transition-colors border border-white/10 shadow-lg"
              title="Close viewer"
            >
              <X size={20} />
            </button>

            {/* Media Screen */}
            <div className="bg-slate-950 w-full relative flex items-center justify-center overflow-hidden flex-1 min-h-[300px] max-h-[480px]">
              {selectedProject.mediaType === 'video' ? (
                (() => {
                  const embedUrl = getYouTubeEmbedUrl(selectedProject.mediaUrl);
                  if (embedUrl) {
                    return (
                      <iframe 
                        src={`${embedUrl}?autoplay=1&rel=0`}
                        title={selectedProject.title}
                        className="w-full h-full aspect-video border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  } else {
                    return (
                      <video 
                        src={selectedProject.mediaUrl} 
                        controls 
                        autoPlay
                        className="max-w-full max-h-full object-contain"
                      />
                    );
                  }
                })()
              ) : (
                <img 
                  src={selectedProject.mediaUrl} 
                  alt={selectedProject.title} 
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Description Card info */}
            <div className="p-8 sm:p-10 overflow-y-auto border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-widest uppercase font-display border border-emerald-100 flex items-center gap-1.5">
                  {selectedProject.mediaType === 'video' ? <Video size={14} /> : <ImageIcon size={14} />}
                  {selectedProject.mediaType}
                </span>
                <span className="text-slate-400 text-sm font-semibold flex items-center gap-1.5 font-sans">
                  <Calendar size={14} />
                  {new Date(selectedProject.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mb-4">{selectedProject.title}</h3>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-sans">{selectedProject.description}</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 text-center border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-8">
          <p 
            onClick={handleSecretClick}
            className="text-slate-300 font-medium text-lg font-display select-none cursor-default active:text-slate-400 transition-colors"
          >
            &copy; {new Date().getFullYear()} Hon. Bello El-Rufai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
