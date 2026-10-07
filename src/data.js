export const SITE = import.meta.env.VITE_SITE_URL || 'https://YOUR-DOMAIN'
export const EMAIL = 'maheshbubadodagatta414864@gmail.com'
export const GITHUB = 'https://github.com/' // TODO: add your real GitHub profile URL
export const LINKEDIN = 'https://www.linkedin.com/' // TODO: add your real LinkedIn profile URL
export const projects = [
 { slug:'accessai',image:'/projects/accessai.png', title:'AccessAI', sub:'AI-Powered Web Accessibility Audit Platform', context:'Indian Institute of Technology, Mandi · HIMSHIKHAR Residential Program',
  tech:['Python','FastAPI','JavaScript','Agentic AI','Google Gemini','Git'],
  desc:'Built an AI-powered accessibility auditing platform that automatically evaluates websites against WCAG 2.2 guidelines and generates comprehensive accessibility reports.',
  highlights:['Automated WCAG accessibility analysis','Multi-agent AI architecture','LLM-based reasoning','Backend automation','Automated accessibility reporting'] },
 { slug:'truthlensai',image:'/projects/truthlensai.png', title:'TruthLensAI', sub:'Multi-Agent Deepfake Detection System', context:'HCL-Conducted Hackathon',
  tech:['Python','FastAPI','Agentic AI','Google Gemini','LangChain'],
  desc:'Developed a multi-agent deepfake detection platform combining forensic feature extraction, Agentic AI, and LLM reasoning to identify manipulated media.',
  highlights:['Multi-agent architecture','Forensic feature extraction','LLM reasoning','AI-powered manipulated-media detection','Explainable detection workflow'] },
 { slug:'smart-farming',image:'/projects/smart-farming.png', title:'Smart Farming Monitoring', sub:'AI-Based Smart Farming Monitoring System', context:'Academic Major Project',
  tech:['Python','Machine Learning','IoT','ESP8266','Arduino','SQL','HTML','CSS'],
  desc:'Designed an IoT-enabled smart farming system combining real-time sensor monitoring with machine-learning-driven predictive analytics for precision agriculture.',
  highlights:['Soil moisture monitoring','Rainfall monitoring','AI-driven irrigation','Crop monitoring','Data-driven agricultural insights','IoT-based monitoring'] },
]
export const skills = [
 { name:'Programming', label:'PROGRAMMING', description:'Languages for scripting, querying, and application development.', technologies:['Python','SQL','C','Java'] },
 { name:'AI & Intelligent Systems', label:'AI & INTELLIGENT SYSTEMS', description:'Building agents, augmenting intelligence and solving real-world problems.', technologies:['Agentic AI','RAG','Prompt Engineering','LangChain','Google Gemini'] },
 { name:'Data Analytics', label:'DATA ANALYTICS', description:'Analysis, reporting, data preparation, and visual communication.', technologies:['Power BI','DAX','Microsoft Excel','Power Query','EDA (Exploratory Data Analysis)','Data Visualization'] },
 { name:'Machine Learning', label:'MACHINE LEARNING', description:'Machine-learning methods and libraries for predictive workflows.', technologies:['TensorFlow','Keras','Scikit-learn','Machine Learning'] },
 { name:'Development & Tools', label:'DEVELOPMENT & TOOLS', description:'APIs, development environments, and version-control tools.', technologies:['FastAPI','REST APIs','Git','GitHub','VS Code','Jupyter Notebook','Docker'] },
 { name:'Databases', label:'DATABASES', description:'Relational databases used to organize and query structured data.', technologies:['MySQL','Microsoft SQL Server'] },
]
export const certs = [
 { slug:'himshikhar-agentic-ai', title:'HIMSHIKHAR Residential Program – Agentic AI Systems', issuer:'Indian Institute of Technology, Mandi', image:'/certifications/himshikhar-agentic-ai.png',
  summary:' Completed the HIMSHIKHAR Residential Program at IIT Mandi, an immersive program focused on building practical expertise in Agentic AI systems and intelligent application development.',
  highlights:['An enriching three-month experience at IIT Mandi, set amidst the Himalayas, exploring the world of Agentic AI through hands-on learning, technical exploration and collaboration.','Engaged with multi-agent systems, intelligent workflows, agent orchestration while collaborating with fellow participants and learning from diverse perspectives.','A memorable chapter of technical growth, new connections and learning beyond the classroom.'] },
 { slug:'servicenow-cad', title:'ServiceNow Certified Application Developer (CAD)', issuer:'ServiceNow', image:'/certifications/servicenow-cad.jpg',
  summary:'Explored application development on the ServiceNow platform, focusing on custom applications, scripting, data management and application workflows.',
  highlights:['Developed an understanding of extending platform capabilities through structured application development.','Demonstrates knowledge of application configuration, automation, and development workflows.'] },
 { slug:'servicenow-csa', title:'ServiceNow Certified System Administrator (CSA)', issuer:'ServiceNow', image:'/certifications/servicenow-csa.jpg',
  summary:'Explored ServiceNow administration, platform configuration and IT service management fundamentals.',
  highlights:['Demonstrates knowledge of forms, lists, access controls, and workflow fundamentals.','Gained knowledge of user administration, tables, forms, access controls and workflow management.'] },
 { slug:'hp-life-data-science-analytics', title:'HP LIFE – Data Science & Analytics', issuer:'HP LIFE', image:'/certifications/hp-life-data-science-analytics.jpg',
  summary:'Strengthened my understanding of data analytics, from interpreting datasets and identifying trends to deriving insights that support decision-making.',
  highlights:['Studied core concepts for collecting, organizing, and interpreting data.','Explored how data analysis can support evidence-based decisions.'] },
]
