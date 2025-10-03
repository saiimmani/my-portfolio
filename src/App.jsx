import React, { useState, useEffect, useRef } from 'react';
import { Mail, Linkedin, Github, Menu, X, Bot, Leaf, ScanFace, ArrowUpRight, Code, Database, GitBranch, TerminalSquare, Wind, Cpu, Layers, FunctionSquare, Sparkles, LoaderCircle, Copy, Briefcase, Wifi, WifiOff, HeartPulse } from 'lucide-react';

// This is a placeholder for your photo. 
// To use a local photo like 'sai_immani.jpg', place the image in the 'public' folder of your project
// and change the URL to just "/sai_immani.jpg".
const PHOTO_URL = "/sai_immani.jpg";


const callGeminiAPI = async (prompt) => {
    
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    if (!apiKey) {
        return { success: false, error: "API key is missing. Please create a .env file in your project root and add your key as REACT_APP_GEMINI_API_KEY=YOUR_KEY. Then, restart the server." };
    }

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const responseBody = await response.json();

        if (!response.ok) {
            console.error("API call failed:", response.status, responseBody);
            const errorDetails = responseBody?.error?.message || `HTTP status ${response.status}`;
            return { success: false, error: `API call failed. Details: ${errorDetails}. Check the developer console for the full response.` };
        }

        const text = responseBody.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
            return { success: true, data: text };
        } else {
            console.error("No content in response:", responseBody);
            const reason = responseBody.candidates?.[0]?.finishReason || "Unknown reason";
            return { success: false, error: `No content generated. The response may have been blocked. Reason: ${reason}.` };
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return { success: false, error: `An error occurred while contacting the API: ${error.message}. Check your network connection and the developer console.` };
    }
};


// Custom hook for observing intersection
const useIntersectionObserver = (options) => {
    const [entry, setEntry] = useState(null);
    const [node, setNode] = useState(null);
    const observer = useRef(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        observer.current = new window.IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setEntry(entry);
                if (observer.current) {
                    observer.current.unobserve(entry.target);
                }
            }
        }, options);
        const { current: currentObserver } = observer;
        if (node) currentObserver.observe(node);
        return () => {
            if (currentObserver) {
                currentObserver.disconnect();
            }
        };
    }, [node, options]);
    return [setNode, entry];
};

// Section Component with scroll-triggered animation
const Section = ({ id, children, className = '' }) => {
    const [ref, entry] = useIntersectionObserver({ threshold: 0.1 });
    const isVisible = !!entry;
    return (
        <section
            ref={ref}
            id={id}
            className={`w-full max-w-6xl mx-auto py-20 md:py-28 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
        >
            {children}
        </section>
    );
};

// Header Component
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navLinks = [
        { href: '#about', label: 'About' },
        { href: '#skills', label: 'Skills' },
        { href: '#experience', label: 'Experience' },
        { href: '#projects', label: 'Projects' },
        { href: '#contact', label: 'Contact' },
    ];
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const toggleMenu = () => setIsOpen(!isOpen);
    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-gray-800' : 'bg-transparent'}`}>
            <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#home" className="text-2xl font-bold text-white tracking-tighter hover:text-cyan-400 transition-colors font-mono">IS</a>
                <div className="hidden md:flex items-center space-x-6">
                    {navLinks.map(link => (
                        <a key={link.href} href={link.href} className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">{link.label}</a>
                    ))}
                    <div className="h-6 w-px bg-gray-700"></div>
                    <a href="https://github.com/saiimmani" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 transition-colors"><Github size={20}/></a>
                    <a href="https://www.linkedin.com/in/sai-immani" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 transition-colors"><Linkedin size={20}/></a>
                </div>
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white p-2">{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
                </div>
            </nav>
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-black/90 backdrop-blur-xl`}>
                <div className="flex flex-col items-center py-4 space-y-4">
                    {navLinks.map(link => (<a key={link.href} href={link.href} onClick={toggleMenu} className="text-gray-200 hover:text-cyan-400 transition-colors duration-300 text-lg py-2">{link.label}</a>))}
                </div>
            </div>
        </header>
    );
};

// Hero Component
const Hero = () => (
    <section id="home" className="min-h-screen flex items-center justify-start relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-black"></div>
        <div className="max-w-7xl mx-auto px-6 z-10">
            <p className="text-lg text-cyan-400 mb-4 font-mono animate-fade-in-down" style={{animationDelay: '0.2s'}}>Hi, my name is</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-4 animate-fade-in-down">Immani Sai.</h1>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-400 tracking-tight mb-8 animate-fade-in-down" style={{animationDelay: '0.4s'}}>I build intelligent systems.</h2>
            <p className="text-lg text-gray-400 max-w-xl mb-12 font-light animate-fade-in-down" style={{animationDelay: '0.6s'}}>I'm an AI/ML Engineer specializing in building robust machine learning models and deploying them as impactful applications. I turn complex data into intelligent solutions.</p>
            <a href="#contact" className="group inline-flex items-center bg-cyan-500 text-black font-semibold py-3 px-8 rounded-lg hover:bg-cyan-400 transition-all duration-300 animate-fade-in-down" style={{animationDelay: '0.8s'}}>
                Get In Touch <ArrowUpRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
            </a>
        </div>
    </section>
);

// About Component
const About = () => {
    const [modalContent, setModalContent] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCareerCoach = async () => {
        setIsLoading(true);
        setIsError(false);
        setModalContent("Analyzing profile...");
        const prompt = `Based on a portfolio with skills like Python, TensorFlow, PyTorch and projects like 'AI Study Buddy' and 'Crop Disease Prediction', act as an AI career coach. What are two advanced skills this person should learn next to advance their career in AI/ML? Also, suggest one niche industry where these skills are in high demand. Provide a concise, encouraging response formatted with markdown.`;
        const result = await callGeminiAPI(prompt);
        if (result.success) {
            setModalContent(result.data);
        } else {
            setModalContent(result.error);
            setIsError(true);
        }
        setIsLoading(false);
    };

    return (
        <>
        <Section id="about">
            <div className="grid md:grid-cols-5 gap-16 items-center">
                <div className="md:col-span-3 text-gray-300">
                    <h2 className="text-3xl font-bold text-white mb-6 tracking-tight flex items-center">
                        <span className="text-cyan-400 font-mono mr-3 text-2xl">01.</span> About Me
                    </h2>
                    <div className="space-y-4 font-light text-gray-400 text-lg glass-card p-8">
                        <p>Hello! I'm Sai, a passionate Computer Science student at SRM Institute of Science and Technology with a deep-seated interest in Artificial Intelligence and Machine Learning. My academic journey is complemented by hands-on experience in building and deploying ML models.</p>
                        <p>From developing a customer churn prediction model to creating projects like crop disease detection and face recognition systems, I thrive on solving real-world problems with code.</p>
                         <button onClick={handleCareerCoach} disabled={isLoading} className="mt-4 group/button inline-flex items-center justify-center text-sm font-medium text-cyan-300 border border-cyan-400/30 rounded-lg px-4 py-2 hover:bg-cyan-400/10 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Sparkles className="mr-2 h-4 w-4 transition-transform duration-500 group-hover/button:rotate-180" />
                            Ask AI Career Coach
                        </button>
                    </div>
                </div>
                <div className="md:col-span-2">
                     <div className="relative w-full max-w-xs mx-auto group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                        <img src={PHOTO_URL} alt="Immani Sai" className="relative rounded-lg w-full h-auto z-10" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/000000/FFFFFF?text=Image+Error'; }}/>
                     </div>
                </div>
            </div>
        </Section>
        {modalContent && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => !isLoading && setModalContent('')}>
                    <div className="bg-slate-900 border border-cyan-400/20 rounded-2xl p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                           <h3 className={`text-xl font-bold ${isError ? 'text-red-400' : 'text-cyan-400'} flex items-center`}><Briefcase className="mr-2"/> AI Career Coach</h3>
                            <button onClick={() => setModalContent('')} className="text-gray-400 hover:text-white"><X size={24}/></button>
                        </div>
                        <div className="overflow-y-auto pr-4 -mr-4" style={{maxHeight: '70vh'}}>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-24">
                                    <LoaderCircle className="animate-spin text-cyan-400" size={32} />
                                </div>
                            ) : (
                               <div className="text-gray-300 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: modalContent.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<li>$1</li>') }}></div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Skills Component
const Skills = () => {
    const skills = [
        { name: 'Python', icon: <Code size={24} /> },
        { name: 'TensorFlow', icon: <Cpu size={24} /> },
        { name: 'PyTorch', icon: <Layers size={24} /> },
        { name: 'Scikit-learn', icon: <FunctionSquare size={24} /> },
        { name: 'SQL', icon: <Database size={24} /> },
        { name: 'Streamlit', icon: <Wind size={24} /> },
        { name: 'Flask', icon: <TerminalSquare size={24} /> },
        { name: 'Git', icon: <GitBranch size={24} /> },
    ];
    return (
        <Section id="skills">
            <h2 className="text-3xl font-bold text-white text-center mb-12 tracking-tight"><span className="text-cyan-400 font-mono mr-3 text-2xl">02.</span> My Tech Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {skills.map(skill => (<div key={skill.name} className="glass-card p-6 flex flex-col items-center justify-center text-center"><div className="text-cyan-400 mb-3">{skill.icon}</div><h3 className="text-lg font-semibold text-white">{skill.name}</h3></div>))}
            </div>
        </Section>
    );
};

// Experience Component
const Experience = () => (
    <Section id="experience">
        <h2 className="text-3xl font-bold text-white mb-12 tracking-tight flex items-center"><span className="text-cyan-400 font-mono mr-3 text-2xl">03.</span> Where I've Worked</h2>
        <div className="glass-card p-8">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white">AI & Cloud Intern</h3>
                <p className="text-cyan-400 font-mono">Edunet Foundation</p>
                <p className="text-gray-400 text-sm">Sept 2025 - Present</p>
            </div>
            <ul className="list-disc list-inside space-y-3 text-gray-400 font-light">
                <li>Built and validated a customer churn prediction model using Python & Scikit-learn to identify key retention risk factors.</li>
                <li>Developed an interactive Streamlit application to visualize model predictions, feature importances, and evaluation metrics.</li>
                <li>Improved ML workflow by creating reproducible scripts, data pipelines using Pandas, and documenting experiments.</li>
            </ul>
        </div>
    </Section>
);

// Projects Component
const Projects = () => {
    const [modalContent, setModalContent] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAInsights = async (title, description) => {
        setIsLoading(true);
        setIsError(false);
        setModalContent("Generating insights...");
        const prompt = `You are an expert AI/ML engineering manager reviewing a portfolio project. Based on the following project, generate a detailed analysis in two parts. Use markdown for formatting (e.g., use '**' for bold and '*' for list items).
        
        Project Title: ${title}
        Project Description: ${description}
        
        **Technical Breakdown**
        - Provide a plausible technical architecture.
        - Explain the role of key technologies.
        - Mention one potential technical challenge and how to solve it.
        
        **Future Enhancements**
        - Suggest two concrete, innovative features to improve this project.
        - Briefly explain the business or user value of each suggestion.`;
        const result = await callGeminiAPI(prompt);
        if(result.success) {
            setModalContent(result.data);
        } else {
            setModalContent(result.error);
            setIsError(true);
        }
        setIsLoading(false);
    };

    const projectsData = [
        { title: 'AI Study Buddy', description: 'An interactive AI-powered study assistant built with Python and Streamlit to provide users with instant academic support.', tags: ['Python', 'Streamlit', 'NLP', 'AI/ML'], githubLink: 'https://github.com/saiimmani/ai-study-buddy.git', icon: <Bot size={36}/> },
        { title: 'Crop Disease Prediction Model', description: 'Trained a CNN to distinguish common crop diseases with 95% validation accuracy. Implemented robust image preprocessing with OpenCV.', tags: ['Python', 'TensorFlow', 'OpenCV', 'CNN'], githubLink: 'https://github.com/saiimmani/LeafDiseasePredictionModel.git', icon: <Leaf size={36}/> },
        { title: 'Face Recognition Attendance System', description: 'A prototype for real-time attendance automation from a webcam feed, using an ML pipeline for face embedding and matching.', tags: ['Python', 'OpenCV', 'Scikit-learn', 'Tkinter'], githubLink: 'https://github.com/saiimmani/FaceRecognitionAttendanceSystem.git', icon: <ScanFace size={36}/> },
        { title: 'Intelligent Fitness Tracker', description: "An intelligent fitness tracker desktop application built using Python's Tkinter GUI toolkit and Scikit-learn. It allows users to register/login, calculate BMI, receive personalized workout recommendations, log daily workout data, predict calorie burn trends using Linear Regression, and get expert fitness advice.", tags: ['Python', 'Tkinter', 'Scikit-learn', 'ML'], githubLink: 'https://github.com/saiimmani/Fitness-Tracker.git', icon: <HeartPulse size={36}/> },
    ];

    return (
        <>
            <Section id="projects">
                <h2 className="text-3xl font-bold text-white mb-12 tracking-tight flex items-center"><span className="text-cyan-400 font-mono mr-3 text-2xl">04.</span> Things I've Built</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectsData.map((project, index) => (
                        <div key={index} className="glass-card p-6 flex flex-col group">
                            <div className="flex justify-between items-center mb-4">
                               <div className="text-cyan-400">{project.icon}</div>
                               <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><Github size={20}/></a>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                            <p className="text-gray-400 font-light mb-6 flex-grow">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tags.map((tag, i) => (<span key={i} className="text-cyan-300 text-xs font-mono bg-cyan-900/50 px-3 py-1 rounded-full">{tag}</span>))}
                            </div>
                             <button onClick={() => handleAInsights(project.title, project.description)} disabled={isLoading} className="mt-auto group/button inline-flex items-center justify-center text-sm font-medium text-cyan-300 border border-cyan-400/30 rounded-lg px-4 py-2 hover:bg-cyan-400/10 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Sparkles className="mr-2 h-4 w-4 transition-transform duration-500 group-hover/button:rotate-180" />
                                Get AI Insights
                            </button>
                        </div>
                    ))}
                </div>
            </Section>

            {modalContent && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => !isLoading && setModalContent('')}>
                    <div className="bg-slate-900 border border-cyan-400/20 rounded-2xl p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                           <h3 className={`text-xl font-bold ${isError ? 'text-red-400' : 'text-cyan-400'}`}>✨ AI Project Insights</h3>
                            <button onClick={() => setModalContent('')} className="text-gray-400 hover:text-white"><X size={24}/></button>
                        </div>
                        <div className="overflow-y-auto pr-4 -mr-4" style={{maxHeight: '70vh'}}>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-48">
                                    <LoaderCircle className="animate-spin text-cyan-400" size={32} />
                                </div>
                            ) : (
                               <div className="text-gray-300 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: modalContent.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<li>$1</li>') }}></div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Contact Component
const Contact = () => {
    const [topic, setTopic] = useState('');
    const [draft, setDraft] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    const handleDraftMessage = async () => {
        if (!topic) return;
        setIsLoading(true);
        setDraft("Generating draft...");
        const result = await callGeminiAPI(`You are a software engineer interested in connecting with a fellow AI/ML engineer named Sai. Draft a short, professional, and friendly email to 'saichowdaryimmani@gmail.com' starting a conversation about the topic: "${topic}". Keep it brief and encouraging a response. Start with "Subject: Connecting to chat about ${topic}" and then the body of the email.`);
        if(result.success) {
            setDraft(result.data);
        } else {
            setDraft(result.error);
        }
        setIsLoading(false);
    };

    const handleCopy = () => {
        if (draft) {
            const textArea = document.createElement("textarea");
            textArea.value = draft;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };


    return (
        <Section id="contact" className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight"><span className="text-cyan-400 font-mono mr-3 text-2xl block mb-4">05.</span> Get In Touch</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-10 font-light text-lg">I'm currently seeking new opportunities and am open to collaboration. My inbox is always open, whether you have a question or just want to connect, you can reach out to me on LinkedIn.</p>
            
            <div className="glass-card max-w-2xl mx-auto p-8">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">AI Message Draft ✨</h3>
                <p className="text-gray-400 mb-6">Enter a topic and let AI draft a conversation starter for you.</p>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Natural Language Processing" className="flex-grow bg-slate-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                    <button onClick={handleDraftMessage} disabled={isLoading || !topic} className="group/button inline-flex items-center justify-center bg-cyan-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? <LoaderCircle className="animate-spin" size={20} /> : 'Generate Draft'}
                    </button>
                </div>
                {draft && (
                    <div className="mt-6 text-left relative">
                        <textarea readOnly value={draft} className="w-full h-48 bg-slate-900 border border-gray-700 rounded-lg p-4 text-gray-300 font-mono text-sm" />
                        <button onClick={handleCopy} className="absolute top-2 right-2 text-gray-400 hover:text-white">
                            {copySuccess ? <span className="text-xs text-cyan-400">{copySuccess}</span> : <Copy size={18} />}
                        </button>
                    </div>
                )}
            </div>
        </Section>
    );
};

// AI Service Status Checker Component
const AIServiceStatus = () => {
    const [status, setStatus] = useState({ message: 'Unknown', color: 'text-gray-500', icon: <WifiOff size={14} /> });
    const [isLoading, setIsLoading] = useState(false);

    const checkStatus = async () => {
        setIsLoading(true);
        setStatus({ message: 'Checking...', color: 'text-yellow-400', icon: <LoaderCircle size={14} className="animate-spin"/> });
        const result = await callGeminiAPI("hello");
        if (result.success) {
            setStatus({ message: 'AI Services Operational', color: 'text-green-400', icon: <Wifi size={14} /> });
        } else {
            setStatus({ message: 'API Connection Failed', color: 'text-red-400', icon: <WifiOff size={14} /> });
        }
        setIsLoading(false);
    };

    return (
        <div className="text-center mt-8">
            <button onClick={checkStatus} disabled={isLoading} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto">
                AI Service Status: 
                <span className={`font-mono flex items-center gap-1.5 ${status.color}`}>
                    {status.icon} {status.message}
                </span>
            </button>
        </div>
    );
};

// Footer Component
const Footer = () => (
    <footer className="py-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-gray-500 flex flex-col items-center">
            <AIServiceStatus />
            <div className="w-full flex flex-col md:flex-row justify-between items-center mt-6">
                <p className="text-sm font-mono">&copy; {new Date().getFullYear()} Immani Sai</p>
                 <div className="flex items-center space-x-6 mt-4 md:mt-0">
                       <a href="https://github.com/saiimmani" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><Github size={20}/></a>
                       <a href="https://www.linkedin.com/in/sai-immani" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><Linkedin size={20}/></a>
                 </div>
            </div>
        </div>
    </footer>
);

// Main App Component
export default function App() {
  return (
    <div className="bg-black min-h-screen font-sans text-white antialiased">
        <div className="fixed inset-0 -z-10 h-full w-full bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
        <div className="relative z-10">
            <Header />
            <main>
                <Hero />
                <About />
                <Skills />
                <Experience />
                <Projects />
                <Contact />
            </main>
            <Footer />
        </div>
        
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');
            html { scroll-behavior: smooth; }
            body { font-family: 'Inter', sans-serif; background-color: #000; }
            .glass-card { background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(16px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.5rem; transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s; }
            .glass-card:hover { transform: translateY(-5px); border-color: rgba(0, 255, 255, 0.4); box-shadow: 0 0 25px rgba(0, 255, 255, 0.1); }
            @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
            .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; opacity: 0; }
            .prose { color: #d1d5db; }
            .prose strong { color: #e5e7eb; }
            .prose li { list-style-position: inside; }
            .prose-invert { color: #d1d5db; }
            .prose-invert strong { color: #f9fafb; }
        `}</style>
    </div>
  )
}

