import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { SITE, EMAIL, GITHUB, LINKEDIN, projects, skills, certs } from './data.js'

const NAME = 'Dodagatta Mahesh'
const LOC = 'Rayadurg, Andhra Pradesh, India'
const NAV = [['home', 'Home'], ['about', 'About'], ['stack', 'Tech Stack'], ['projects', 'Projects'], ['experience', 'Experience'], ['certs', 'Certifications'], ['contact', 'Contact']]
const HEADER_NAV = NAV.filter(([id]) => id !== 'contact')

function Seo({ title, desc, path, crumbs = [], extra, noindex }) {
  useEffect(() => {
    document.title = title
    const url = SITE + path
    const set = (sel, attrs) => { let el = document.head.querySelector(sel); if (!el) { el = document.createElement(sel.startsWith('link') ? 'link' : 'meta'); document.head.appendChild(el) } Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)) }
    set('meta[name="description"]', { name: 'description', content: desc })
    set('link[rel="canonical"]', { rel: 'canonical', href: url })
    set('meta[name="robots"]', { name: 'robots', content: noindex ? 'noindex' : 'index,follow' })
    const og = { 'og:title': title, 'og:description': desc, 'og:url': url, 'og:type': 'website', 'og:image': SITE + '/og.png', 'og:image:alt': NAME + ' – Data Analyst & AI Portfolio', 'og:site_name': 'Mahesh' }
    Object.entries(og).forEach(([p, c]) => set(`meta[property="${p}"]`, { property: p, content: c }))
    set('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    set('meta[name="twitter:image"]', { name: 'twitter:image', content: SITE + '/og.png' })
    const person = { '@type': 'Person', '@id': SITE + '/#person', name: NAME, jobTitle: 'Data Analyst', email: EMAIL, address: { '@type': 'PostalAddress', addressLocality: 'Rayadurg', addressRegion: 'Andhra Pradesh', addressCountry: 'IN' }, sameAs: [GITHUB, LINKEDIN], url: SITE }
    const graph = [person,
      { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE, name: NAME + ' Portfolio', publisher: { '@id': SITE + '/#person' } },
      { '@type': 'WebPage', '@id': url + '#webpage', url, name: title, description: desc, isPartOf: { '@id': SITE + '/#website' } },
      { '@type': 'BreadcrumbList', itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: SITE + c.path })) }]
    if (extra) graph.push(extra)
    let s = document.getElementById('ld'); if (!s) { s = document.createElement('script'); s.id = 'ld'; s.type = 'application/ld+json'; document.head.appendChild(s) }
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
    window.scrollTo(0, 0)
  }, [title, path])
  return null
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null); const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setOn(true); return }
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); o.disconnect() } }, { threshold: .12, rootMargin: '0px 0px -40px 0px' })
    o.observe(el); return () => o.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${on ? 'in' : ''} ${className}`}>{children}</div>
}
const Txt = ({ children }) => typeof children !== 'string' ? children : children.split(/(↗|←)/).map((t, i) => /[↗←]/.test(t) ? <span key={i} className={`arr ${t === '←' ? 'l' : ''}`}>{t}</span> : t)
const Head = ({ eyebrow, title, text }) => <Reveal><div className="head"><span className="pill">{eyebrow}</span><h2>{title}</h2>{text && <p className="muted">{text}</p>}</div></Reveal>
const Btn = ({ to, href, children, variant = 'dark' }) => href ? <a className={`btn ${variant}`} href={href} target="_blank" rel="noreferrer"><Txt>{children}</Txt></a> : <Link className={`btn ${variant}`} to={to}><Txt>{children}</Txt></Link>

function scrollToSection(id) {
  const target = document.getElementById(id)
  const header = document.querySelector('.nav-wrap')
  if (!target || !header) return
  const top = target.getBoundingClientRect().top + window.scrollY - header.getBoundingClientRect().height
  window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  dispatchEvent(new Event('navclick'))
}

function Header() {
  const [open, setOpen] = useState(false); const [spy, setSpy] = useState(''); const { pathname, hash } = useLocation(); const navigate = useNavigate(); const box = useRef(null)
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => { const h = e => setSpy(e.detail || ''), c = () => setOpen(false); addEventListener('spy', h); addEventListener('navclick', c); return () => { removeEventListener('spy', h); removeEventListener('navclick', c) } }, [])
  const cur = pathname === '/' ? (spy || 'home') : pathname.startsWith('/projects') ? 'projects' : ''
  const goToSection = id => event => {
    if (pathname !== '/') return
    event.preventDefault()
    if (hash !== `#${id}`) navigate('/#' + id)
    scrollToSection(id)
  }
  useEffect(() => {
    const m = () => { const b = box.current; if (!b) return; const a = b.querySelector('a.active'); b.style.setProperty('--iw', a ? a.offsetWidth + 'px' : '0px'); if (a) b.style.setProperty('--ix', a.offsetLeft + 'px') }
    m(); document.fonts?.ready.then(m); addEventListener('resize', m); return () => removeEventListener('resize', m)
  }, [cur, open])
  return <header className="nav-wrap"><nav className="nav" aria-label="Main">
    <Link to="/#home" className="brand"><span className="logo">DMS</span>Mahesh</Link>
    <div ref={box} className={`links ${open ? 'open' : ''}`}>{HEADER_NAV.map(([id, l]) => <Link key={id} to={'/#' + id} onClick={goToSection(id)} className={cur === id ? 'active' : ''} aria-current={cur === id ? 'true' : undefined}>{l}</Link>)}</div>
    <Link to="/#contact" onClick={goToSection('contact')} className={`btn dark sm cta ${cur === 'contact' ? 'active' : ''}`}><Txt>Contact me ↗</Txt></Link>
    <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
  </nav></header>
}

function Footer() {
  return <footer className="footer"><Reveal><div className="container foot">
    <div><Link to="/" className="brand">Dodagatta Mahesh</Link><p className="muted">Data analytics, Python, and Agentic AI projects by Dodagatta Mahesh.</p></div>
    <div><h4>Pages</h4>{NAV.map(([id, l]) => <Link key={id} to={'/#' + id}>{l}</Link>)}</div>
    <div><h4>Social</h4><a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a><a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a><a href={'mailto:' + EMAIL}>Email</a></div>
  </div></Reveal></footer>
}

const ProjectCard = ({ p, i }) => <Reveal><Link to={'/projects/' + p.slug} className="pcard">
  <div className={`pthumb ${p.image ? 'img' : ''} t${i % 3}`}>{p.image ? <img src={p.image} alt={`${p.title} project screenshot`} loading="lazy" width="1600" height="900" /> : <><span className="pt">{p.title}</span><small>{p.sub}</small></>}</div>
  <div className="project-copy"><span className="eyebrow">{p.context}</span><div className="pbar"><h3>{p.title}</h3><span className="arrow" aria-hidden="true">↗</span></div>
    <p className="project-desc">{p.desc}</p><div className="tags">{p.tech.map(t => <span key={t}>{t}</span>)}</div><span className="project-action">View case study <span aria-hidden="true">↗</span></span></div>
  </Link></Reveal>

const CertificationCard = ({ certificate }) => <Reveal><Link to={`/certifications/${certificate.slug}`} className="cert-card">
  <span className="cert-card-mark" aria-hidden="true">↗</span>
  <strong>{certificate.title}</strong>
  <small>{certificate.issuer}</small>
  <span className="cert-card-action">View certificate</span>
</Link></Reveal>

function DetailNavigation({ title, items, getTo }) {
  if (!items.length) return null
  return <nav className="detail-navigation" aria-label={title}>
    <div className="detail-navigation-heading"><span className="eyebrow">Continue exploring</span><h2>{title}</h2></div>
    <div className="detail-navigation-grid">{items.map((item, index) => <Link key={item.slug} to={getTo(item)} className="detail-navigation-card">
      <small>{String(index + 1).padStart(2, '0')} / {title}</small>
      <strong>{item.title}</strong>
      <span>Explore <span aria-hidden="true">↗</span></span>
    </Link>)}</div>
  </nav>
}

function ProjectsPage() {
  return <><Seo title="Projects | Dodagatta Mahesh" path="/projects" desc="Selected data analytics and AI projects by Dodagatta Mahesh." />
    <section className="pagehero lines"><div className="container"><Head eyebrow="Selected work" title="Projects" text="Data and AI projects built through programs, hackathons and academic work." /></div></section>
    <section className="section container"><div className="pgrid">{projects.map((project, index) => <ProjectCard key={project.slug} p={project} i={index} />)}</div></section>
  </>
}

function CertificationsPage() {
  return <><Seo title="Certifications | Dodagatta Mahesh" path="/certifications" desc="Professional certifications and learning completed by Dodagatta Mahesh." />
    <section className="pagehero lines"><div className="container"><Head eyebrow="Credentials" title="Certifications" text="Programs and credentials that shaped my work in AI and data." /></div></section>
    <section className="section container"><div className="certification-grid">{certs.map(certificate => <CertificationCard key={certificate.slug} certificate={certificate} />)}</div></section>
  </>
}

function Skills() {
  return <section className="section container tech-stack" id="stack" data-nav="stack" aria-label="Technology stack">
    <Head eyebrow="Skills & tools" title="Tech stack" text="Tools and technologies I use to build, analyze, and ship." />
    <div className="tech-stack-grid">
      {skills.map((category, categoryIndex) => <Reveal key={category.name} className="tech-card-reveal">
        <article className="tech-category-card" style={{ '--card-delay': `${categoryIndex * 75}ms` }}>
          <div className="tech-category-heading">
            <span className="tech-category-index">{String(categoryIndex + 1).padStart(2, '0')}</span>
            <h3>{category.name}</h3>
          </div>
          <p>{category.description}</p>
          <ul className="tech-item-grid" aria-label={`${category.name} technologies`}>
            {category.technologies.map((technology, technologyIndex) => <li key={technology} style={{ '--item-delay': `${technologyIndex * 45}ms` }}>{technology}</li>)}
          </ul>
        </article>
      </Reveal>)}
    </div>
  </section>
}

function Home() {
  useEffect(() => {
    const send = v => dispatchEvent(new CustomEvent('spy', { detail: v }))
    const o = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && send(e.target.dataset.nav)), { rootMargin: '-40% 0px -55% 0px' })
    document.querySelectorAll('[data-nav]').forEach(el => o.observe(el))
    return () => { o.disconnect(); send('') }
  }, [])
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return
    let f = 0; const r = document.documentElement
    const on = () => { cancelAnimationFrame(f); f = requestAnimationFrame(() => r.style.setProperty('--py', Math.min(scrollY * .02, 10) + 'px')) }
    addEventListener('scroll', on, { passive: true })
    return () => { removeEventListener('scroll', on); r.style.removeProperty('--py') }
  }, [])
  const strip = ['Power BI', 'SQL', 'Python', 'Excel', 'DAX', 'Power Query', 'Agentic AI', 'LangChain', 'FastAPI', 'Google Gemini', 'RAG', 'MySQL']
  return <><Seo title="Dodagatta Mahesh | Data Analyst & AI Portfolio" path="/" desc="Dodagatta Mahesh is a Data Analyst and AI & Agentic AI enthusiast skilled in SQL, Power BI, Excel, DAX, Python and LLM-based systems." />
<section id="home" className="hero2" data-nav="home"><div className="herocard">
      <div className="herotext"><h1 aria-label="Dodagatta Mahesh"><span className="w" aria-hidden="true" style={{ '--d': '.05s' }}><i>Dodagatta</i></span>{' '}<span className="w gray" aria-hidden="true" style={{ '--d': '.17s' }}><i>Mahesh</i></span></h1>
        <p className="role rise" style={{ '--d': '.4s' }}>Data Analyst | AI &amp; Agentic AI Enthusiast</p>
        <p className="lead rise" style={{ '--d': '.5s' }}>Transforming data into insights and building intelligent AI-powered solutions.</p>
        <p className="muted small rise" style={{ '--d': '.6s' }}>Data Analytics-focused candidate with hands-on experience in SQL, Power BI, Excel, DAX, Power Query, and Python, along with experience building AI-driven applications and Agentic AI systems.</p>
        <div className="btnrow rise" style={{ '--d': '.7s' }}><Btn to="/#projects">View projects</Btn><Btn to="/#contact" variant="light">Get in touch</Btn></div>
        <div className="hero-facts rise" style={{ '--d': '.8s' }} aria-label="Education, academic program, and location">
          <article className="fact-card"><b>B.Tech</b><span>CSE – Data Science</span><small>Ballari Institute of Technology &amp; Management</small></article>
          <article className="fact-card"><b>IIT Mandi</b><span>HIMSHIKHAR Program</span><small>Agentic AI Systems</small></article>
          <article className="fact-card"><b>Rayadurg</b><span>Andhra Pradesh, India</span></article>
        </div></div>
      <div className="portrait2 rise" style={{ '--d': '.25s' }}><img src="/profile.png" alt="Portrait of Dodagatta Mahesh" width="768" height="1024" /></div>
      <Link to="/#contact" className="glass rise" style={{ '--d': '.95s' }}><div><small>Get in touch</small><b>Open to opportunities</b><p>Share a few details, and I'll get back to you.</p></div><span className="go">↗</span></Link>
    </div>
    <div className="marquee" aria-hidden="true"><div className="track">{[...strip, ...strip].map((t, k) => <span key={k}>✦ {t}</span>)}</div></div></section>
    <section id="about" data-nav="about" className="section container"><Head eyebrow="About" title="Data, Automation and Intelligent Systems" />
      <div className="split"><Reveal><div className="portrait sm"><img src="/profile.png" alt="Portrait of Dodagatta Mahesh" width="768" height="1024" loading="lazy" /></div></Reveal>
        <Reveal><div className="prose"><p>I am a Computer Science and Engineering graduate specializing in Data Science, with hands-on experience in data analytics, artificial intelligence, and Agentic AI systems.</p>
          <p>My core strengths include SQL, Power BI, Excel, DAX, Power Query, Python, data analysis, visualization, and database technologies. I have also worked on AI-driven applications involving Agentic AI, LLMs, RAG, and multi-agent systems.</p>
          <p>During the HIMSHIKHAR Residential Program at IIT Mandi, I worked on practical Agentic AI projects involving AI-powered web accessibility auditing and multi-agent deepfake detection.</p>
          <p>I enjoy solving real-world problems by combining data, automation, and intelligent systems.</p></div></Reveal></div></section>
    <Skills />
    <section className="section container" id="projects" data-nav="projects"><Head eyebrow="Selected work" title="Projects" text="Data and AI projects built through programs, hackathons and academic work." />
      <div className="pgrid">{projects.map((p, i) => <ProjectCard key={p.slug} p={p} i={i} />)}</div></section>
    <section id="experience" data-nav="experience" className="section container"><Head eyebrow="Experience" title="Experience and Education" text="A residential AI program, hands-on training and my degree." />
      <Timeline items={[['HIMSHIKHAR Residential Program', 'Agentic AI Systems Cohort Member · Indian Institute of Technology, Mandi', 'Selected for an immersive residential program at IIT Mandi focused on Agentic AI Systems, hands-on projects, expert mentorship, and multidisciplinary collaboration.'],
        ['EZ Trainings and Technologies Pvt. Ltd.', 'Hyderabad, Remote', 'Completed hands-on training in Python programming, debugging, and application development using industry-standard software development practices.'],
        ['Ballari Institute of Technology & Management', 'Ballari, Karnataka · 2022 – 2026', 'Bachelor of Technology (B.Tech), Computer Science and Engineering – Data Science.']]} /></section>
    <section id="certs" data-nav="certs" className="section container certifications-section"><Head eyebrow="Credentials" title="Certifications" />
      <div className="certification-grid">{certs.map(certificate => <CertificationCard key={certificate.slug} certificate={certificate} />)}</div></section>
    <ContactSection standalone /><ContactJourney /><RadarSection /></>
}


function Timeline({ items }) {
  return <div className="timeline">{items.map(([t, s, d]) => <Reveal key={t}><div className="step"><div className="dot" /><div><h3>{t}</h3><span className="eyebrow">{s}</span><p className="muted">{d}</p></div></div></Reveal>)}</div>
}



function ProjectPage() {
  const { slug } = useParams(); const p = projects.find(x => x.slug === slug)
  if (!p) return <NotFound />
  const path = '/projects/' + p.slug
  return <><Seo title={`${p.title} | Dodagatta Mahesh`} path={path} crumbs={[{ name: 'Projects', path: '/projects' }, { name: p.title, path }]} desc={p.desc}
    extra={{ '@type': 'CreativeWork', name: p.sub, description: p.desc, author: { '@id': SITE + '/#person' }, url: SITE + path, keywords: p.tech.join(', ') }} />
    <section className="pagehero lines"><div className="container"><Head eyebrow={p.context} title={p.sub} text={p.desc} /></div></section>
    <section className="section container project-detail-section"><div className={`pthumb big ${p.image ? 'img' : ''} t${projects.indexOf(p) % 3}`}>{p.image ? <img src={p.image} alt={`${p.title} project screenshot`} width="1600" height="900" /> : <span>{p.title}</span>}</div>
      <div className="split detail"><div><h3>Technologies</h3><div className="tags">{p.tech.map(t => <span key={t}>{t}</span>)}</div></div>
        <div><h3>Highlights</h3><ul className="list">{p.highlights.map(h => <li key={h}>{h}</li>)}</ul></div></div>
      <DetailNavigation title="More projects" items={projects.filter(item => item.slug !== p.slug)} getTo={item => `/projects/${item.slug}`} />
    </section></>
}

function CertificateImage({ certificate }) {
  const [available, setAvailable] = useState(true)
  return <div className="certificate-image">
    {available ? <img src={certificate.image} alt={`${certificate.title} certificate`} onError={() => setAvailable(false)} /> :
      <div className="certificate-image-placeholder"><span>Certificate image</span><small>Add your image at</small><code>public{certificate.image}</code></div>}
  </div>
}

function CertificatePage() {
  const { slug } = useParams()
  const certificate = certs.find(item => item.slug === slug)
  if (!certificate) return <NotFound />
  const path = '/certifications/' + certificate.slug
  return <><Seo title={`${certificate.title} | Dodagatta Mahesh`} path={path}
    crumbs={[{ name: 'Certifications', path: '/certifications' }, { name: certificate.title, path }]}
    desc={certificate.summary} />
    <section className="pagehero lines"><div className="container"><Head eyebrow={certificate.issuer} title={certificate.title} text={certificate.summary} /></div></section>
    <section className="section container certificate-detail">
      <CertificateImage certificate={certificate} />
      <div className="certificate-story">
        <h2>What I did</h2>
        <ul className="list">{certificate.highlights.map(item => <li key={item}>{item}</li>)}</ul>
      </div>
      <DetailNavigation title="More certifications" items={certs.filter(item => item.slug !== certificate.slug)} getTo={item => `/certifications/${item.slug}`} />
    </section>
  </>
}


const IlluMagnify = () => (
  <svg className="journey-illus" viewBox="0 0 54 54" fill="none" aria-hidden="true">
    <circle cx="22" cy="22" r="13.5" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="31.5" y1="31.5" x2="46" y2="46" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="18" y1="22" x2="26" y2="22" stroke="var(--brand)" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="22" y1="18" x2="22" y2="26" stroke="var(--brand)" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M14 16c1.5-2.8 4.5-4.5 8-4.5" stroke="var(--brand)" strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
  </svg>
)
const IlluLaptop = () => (
  <svg className="journey-illus" viewBox="0 0 54 54" fill="none" aria-hidden="true">
    <rect x="9" y="13" width="36" height="24" rx="2.5" stroke="var(--brand)" strokeWidth="1.5"/>
    <path d="M4 37h46" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 37l-2 4h14l-2-4" stroke="var(--brand)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 20l4 4 8-8" stroke="var(--brand)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    <path d="M30 20h5M30 25h3" stroke="var(--brand)" strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
  </svg>
)
const IlluMountain = () => (
  <svg className="journey-illus" viewBox="0 0 54 54" fill="none" aria-hidden="true">
    <path d="M4 44 L18 18 L27 30 L34 20 L50 44 Z" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 44 L26 25 L32 33 L39 24 L48 44" stroke="var(--brand)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
    <path d="M15 22 L18 18 L21 22" stroke="var(--brand)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    <path d="M31 24 L34 20 L37 24" stroke="var(--brand)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    <line x1="4" y1="44" x2="50" y2="44" stroke="var(--brand)" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
  </svg>
)
const IlluPlant = () => (
  <svg className="journey-illus" viewBox="0 0 54 54" fill="none" aria-hidden="true">
    <line x1="27" y1="44" x2="27" y2="18" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M27 32 Q20 28 16 20 Q24 18 27 26" stroke="var(--brand)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M27 26 Q34 22 38 14 Q30 12 27 20" stroke="var(--brand)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 44 Q27 42 32 44" stroke="var(--brand)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    <circle cx="27" cy="16" r="1.5" fill="var(--brand)" opacity="0.5"/>
  </svg>
)

// ─── Web3Forms access key ───────────────────────────────────────────────────
// 1. Go to https://web3forms.com  2. Enter your email  3. Copy the key here
const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'

function ContactSection({ standalone = false }) {
  const [f, setF] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const send = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: f.name,
          email: f.email,
          message: f.message,
          subject: `Portfolio enquiry from ${f.name}`,
          from_name: 'Mahesh Portfolio',
          replyto: f.email,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setF({ name: '', email: '', message: '' })
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 4000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const on = k => e => setF({ ...f, [k]: e.target.value })

  return <section id="contact" data-nav="contact" className={`contact-section ${standalone ? 'contact-section-page' : 'contact-section-home'}`}>
    <div className="contact-layout container">
      <div className="contact-copy">
        <p className="contact-kicker"><span aria-hidden="true">●</span> Open to opportunities &amp; collaborations</p>
        <h1>Good things start with a conversation.</h1>
        <p className="contact-intro">I'm a curious mind with an interest in data, AI and building things that solve real problems.</p>
        <p className="contact-intro" style={{marginTop:'10px'}}>Always excited to connect with fellow learners, developers, mentors and people with interesting ideas.</p>
        <p className="contact-intro" style={{marginTop:'10px'}}>Have an opportunity, an idea to share or simply want to connect? My inbox is open.</p>
        <div className="contact-info-groups">
          <div className="contact-info-group">
            <span className="contact-fact-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </span>
            <div>
              <span className="contact-info-label">Location</span>
              <span className="contact-info-value">Andhra Pradesh, India</span>
            </div>
          </div>
          <div className="contact-info-group">
            <span className="contact-fact-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v1a10 10 0 1 1-5.93-9.14"/>
                <path d="M22 4 12 14.01l-3-3"/>
              </svg>
            </span>
            <div>
              <span className="contact-info-label">Currently Exploring</span>
              <span className="contact-info-value">Data Analytics · Generative AI · Agentic Systems</span>
            </div>
          </div>
          <div className="contact-info-group">
            <span className="contact-fact-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
            </span>
            <div>
              <span className="contact-info-label">Usually Fueled By</span>
              <span className="contact-info-value">Ideas, code &amp; coffee</span>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-form-column">
        <p className="contact-form-kicker">Have something in mind? I'd love to hear about it.</p>
        <form className="contact-form-card" onSubmit={send} noValidate>
          <label className="cf-label">Name<input className="cf-input" required placeholder="Your name" value={f.name} onChange={on('name')} autoComplete="name" disabled={status === 'loading'} /></label>
          <label className="cf-label">Email<input className="cf-input" required type="email" placeholder="your@email.com" value={f.email} onChange={on('email')} autoComplete="email" disabled={status === 'loading'} /></label>
          <label className="cf-label">Message<textarea className="cf-input cf-textarea" required rows="5" placeholder="Let's build something amazing..." value={f.message} onChange={on('message')} disabled={status === 'loading'} /></label>
          {status === 'success' && (
            <div className="cf-feedback cf-success" role="alert">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="10" cy="10" r="9"/><path d="m6.5 10 2.5 2.5 4.5-4.5"/></svg>
              Message sent! I'll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className="cf-feedback cf-error" role="alert">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="10" cy="10" r="9"/><line x1="10" y1="6" x2="10" y2="11"/><circle cx="10" cy="14" r=".5" fill="currentColor"/></svg>
              Something went wrong. Please try again or email me directly at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </div>
          )}
          <button className={`cf-submit btn dark${status === 'loading' ? ' cf-loading' : ''}`} type="submit" disabled={status === 'loading' || status === 'success'}>
            {status === 'loading' ? <><span className="cf-spinner" aria-hidden="true"/>Sending...</> : status === 'success' ? <>✓ Sent</> : <Txt>Send message ↗</Txt>}
          </button>
        </form>
      </div>
    </div>
  </section>
}

const JOURNEY = [
  { Illus: IlluMagnify, number: '01', title: 'The Curious Mind', text: 'Always asking questions, exploring new ideas and understanding how things work.' },
  { Illus: IlluLaptop,  number: '02', title: 'The Builder',      text: 'Learning by creating, experimenting and turning ideas into real projects.' },
  { Illus: IlluMountain,number: '03', title: 'The Explorer',     text: 'Finding inspiration in new places, ideas and experiences.' },
  { Illus: IlluPlant,   number: '04', title: 'The Learner',      text: 'Growing one concept, one challenge and one project at a time.' },
]

function ContactJourney() {
  return <section className="contact-journey">
    <div className="container">
      <div className="contact-journey-top">
        <p className="contact-kicker"><span aria-hidden="true">●</span> A few things about me</p>
        <h2 className="contact-journey-heading">The journey in small pieces.</h2>
      </div>
      <div className="journey-grid">
        {JOURNEY.map(({ Illus, number, title, text }) => (
          <article className="journey-item" key={number}>
            <div className="journey-illus-wrap"><Illus /></div>
            <small className="journey-num">{number}</small>
            <h3 className="journey-title">{title}</h3>
            <p className="journey-desc">{text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
}

function RadarSection() {
  const topics = ['Data Analytics', 'Generative AI', 'Agentic Systems', 'Python', 'Building Projects']
  return <section className="radar-section">
    <div className="container">
      <div className="radar-inner">
        <div className="radar-copy">
          <p className="contact-kicker"><span aria-hidden="true">●</span> Currently on my radar</p>
          <h2 className="radar-heading">Currently on my radar.</h2>
          <p className="radar-sub">Things I'm learning, exploring and looking forward to.</p>
        </div>
        <div className="radar-topics">
          {topics.map((t, i) => (
            <span key={t} className="radar-topic">
              {t}
              {i < topics.length - 1 && <span className="radar-sep" aria-hidden="true">·</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
}

const GithubIcon = () => (
  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.021C22 6.484 17.522 2 12 2Z"/>
  </svg>
)
const LinkedinIcon = () => (
  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/>
  </svg>
)
const EmailIcon = () => (
  <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m2 7 10 7 10-7"/>
  </svg>
)

const HimalayanIllus = () => (
  <svg className="himalaya-illus" viewBox="0 0 240 130" fill="none" aria-hidden="true">
    {/* Background ridge */}
    <path d="M0 105 Q15 88 28 82 Q38 78 45 90 Q52 78 62 60 Q70 48 78 62 Q84 72 90 60 Q98 44 110 52 Q118 58 124 48 Q132 32 142 42 Q150 50 158 38 Q168 22 180 35 Q190 48 198 42 Q208 36 220 52 Q230 62 240 58 L240 130 L0 130 Z" stroke="var(--brand)" strokeWidth="1" strokeLinejoin="round" opacity="0.22" fill="rgba(29,4,4,0.04)"/>
    {/* Main peaks */}
    <path d="M5 110 L25 72 L42 92 L60 54 L74 74 L88 46 L102 66 L118 30 L132 55 L148 18 L162 48 L178 28 L194 55 L210 38 L228 68 L240 58 L240 110 Z" stroke="var(--brand)" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
    {/* Snow caps */}
    <path d="M116 36 L118 30 L120 36" stroke="var(--brand)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    <path d="M145 24 L148 18 L151 24" stroke="var(--brand)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    <path d="M175 34 L178 28 L181 34" stroke="var(--brand)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    <path d="M57 60 L60 54 L63 60" stroke="var(--brand)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    <path d="M85 52 L88 46 L91 52" stroke="var(--brand)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    {/* Foreground ridge */}
    <path d="M0 118 Q20 108 35 112 Q55 116 70 104 Q85 94 100 108 Q115 116 132 100 Q148 88 165 104 Q180 114 200 106 Q215 100 240 108 L240 130 L0 130 Z" stroke="var(--brand)" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(29,4,4,0.03)"/>
    {/* Baseline */}
    <line x1="0" y1="120" x2="240" y2="120" stroke="var(--brand)" strokeWidth="0.8" opacity="0.25"/>
  </svg>
)

function ContactFooter() {
  return <footer className="contact-footer">
    <div className="contact-footer-main container">
      <div className="contact-footer-brand">
        <h2>Dodagatta Mahesh</h2>
        <p>The story is still unfolding.</p>
        <small>A student passionate about data, AI and building intelligent systems.</small>
        <span>Data Analytics · Generative AI · Agentic Systems</span>
      </div>
      <div className="contact-footer-links">
        <h3>Pages</h3>
        {NAV.map(([id, label]) => <Link key={id} to={'/#' + id}>{label}</Link>)}
      </div>
      <div className="contact-footer-links contact-footer-connect">
        <h3>Connect</h3>
        <a href={GITHUB} target="_blank" rel="noreferrer" className="social-link"><GithubIcon /><span>GitHub</span></a>
        <a href={LINKEDIN} target="_blank" rel="noreferrer" className="social-link"><LinkedinIcon /><span>LinkedIn</span></a>
        <a href={`mailto:${EMAIL}`} className="social-link"><EmailIcon /><span>Email</span></a>
      </div>
      <div className="contact-footer-art" aria-label="Himalayan mountain illustration with handwritten text">
        <HimalayanIllus />
        <span className="himalaya-text">Learning<br />Building<br />Exploring<br />and<br />More to come...</span>
      </div>
    </div>
    <div className="contact-footer-bottom"><div className="container">
      <span>© {new Date().getFullYear()} Dodagatta Mahesh. All rights reserved.</span>
      <span>Made with curiosity.</span>
      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button>
    </div></div>
  </footer>
}

function ContactPage() {
  return <><Seo title="Contact | Dodagatta Mahesh" path="/contact" desc="Contact Dodagatta Mahesh about opportunities in data analytics, business intelligence, AI, and Agentic AI." />
    <ContactSection standalone />
    <ContactJourney />
    <RadarSection />
  </>
}

function NotFound() {
  return <><Seo title="404 | Page not found | Dodagatta Mahesh" path="/404" noindex />
    <section className="pagehero lines nf"><div className="container"><span className="big404">404</span><h2>Page not found.</h2><p className="muted">The page you're looking for doesn't exist or may have moved.</p><Btn to="/">Back to home</Btn></div></section></>
}

export default function App() {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const isReload = useRef(performance.getEntriesByType('navigation')[0]?.type === 'reload')
  useEffect(() => {
    if (!isReload.current) return
    isReload.current = false
    navigate('/', { replace: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [navigate])
  useEffect(() => {
    if (pathname !== '/' || !hash) return
    const id = hash.slice(1)
    let frame1
    let frame2
    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        scrollToSection(id)
      })
    })
    return () => {
      cancelAnimationFrame(frame1)
      cancelAnimationFrame(frame2)
    }
  }, [pathname, hash])
  return <><Header /><main key={pathname} className="page"><Routes>
    <Route path="/" element={<Home />} /><Route path="/projects/:slug" element={<ProjectPage />} />
    <Route path="/projects" element={<ProjectsPage />} />
    <Route path="/certifications" element={<CertificationsPage />} /><Route path="/certifications/:slug" element={<CertificatePage />} />
    <Route path="/contact" element={<Navigate to="/#contact" replace />} />
    {['about', 'projects'].map(r => <Route key={r} path={'/' + r} element={<Navigate to={'/#' + r} replace />} />)}
    <Route path="*" element={<NotFound />} /></Routes></main>{pathname === '/' ? <ContactFooter /> : <Footer />}</>
}
