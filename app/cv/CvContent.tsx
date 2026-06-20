import styles from "./cv.module.css";

function MapPinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0f1f3d"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0f1f3d"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0f1f3d"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0f1f3d"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="4" />
      <line x1="7" y1="10" x2="7" y2="17" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
      <path d="M11 10v7M11 13a3 3 0 0 1 6 0v4" />
    </svg>
  );
}

export default function CvContent() {
  return (
    <div className={styles.cvRoot}>
      <div className={styles.page}>
        <div className={styles.name}>Dinh Tien Do</div>
        <div className={styles.contact}>
          <span>
            <MapPinIcon />
            Hanoi, Vietnam
          </span>
          <span>
            <MailIcon />
            do.dinhtien227@gmail.com
          </span>
          <span>
            <PhoneIcon />
            0987566386
          </span>
          <span>
            <LinkedInIcon />
            /in/dinh-tien-do
          </span>
        </div>

        <div className={styles.section}>
          <div className={styles.secTitle}>Summary</div>
          <p className={styles.summary}>
            Front-end Developer with 5 years of experience building scalable and
            high-performance web applications across multiple domains.
            Specialized in React/Next.js and modern frontend architecture, with
            strong focus on performance optimization and data-intensive systems.
            Experienced in developing real-time features, improving user
            experience, and delivering production-ready solutions in fast-paced
            environments.
          </p>
        </div>

        <div className={styles.section}>
          <div className={styles.secTitle}>Technical Skills</div>
          <div className={styles.skillsGrid}>
            <span className={styles.skLabel}>Core</span>
            <span className={styles.skVal}>
              React.js, Next.js, TypeScript, JavaScript
            </span>
            <span className={styles.skLabel}>State</span>
            <span className={styles.skVal}>
              TanStack Query, Redux Toolkit, Zustand, Pinia
            </span>
            <span className={styles.skLabel}>UI & Styling</span>
            <span className={styles.skVal}>
              Tailwind CSS, Radix UI, Shadcn/UI, Material UI, PrimeVue
            </span>
            <span className={styles.skLabel}>Real-time</span>
            <span className={styles.skVal}>
              WebSocket, Socket.io, TradingView Charting Library
            </span>
            <span className={styles.skLabel}>Performance</span>
            <span className={styles.skVal}>
              SSR/SSG, Code Splitting, Lazy Loading, Core Web Vitals
            </span>
            <span className={styles.skLabel}>Backend</span>
            <span className={styles.skVal}>
              Node.js, Express.js, Java, Spring Boot, REST APIs, MySQL
            </span>
            <span className={styles.skLabel}>Tools & CI</span>
            <span className={styles.skVal}>
              Git, GitHub Actions, GitLab CI, Docker, Nginx, Vercel
            </span>
            <span className={styles.skLabel}>Other</span>
            <span className={styles.skVal}>
              Angular, Vue.js, Node.js, Web3, AWS (EC2, S3)
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.secTitle}>Experience</div>

          <div className={styles.job}>
            <div className={styles.jobHeader}>
              <span className={styles.jobTitle}>Front-end Developer</span>
              <span className={styles.jobDate}>Apr 2025 – May 2026</span>
            </div>
            <div className={styles.jobCompany}>ONUS Labs</div>
            <ul>
              <li>
                Contributed to a{" "}
                <strong>high-traffic crypto trading platform</strong> serving
                7M+ users, focusing on performance and scalability.
              </li>
              <li>
                Developed trading interfaces handling real-time market data
                (price feeds, order books) via <strong>Socket.io</strong>.
              </li>
              <li>
                Refactored data fetching using React Query, reducing redundant
                API calls by <strong>20–30%</strong> through caching and
                deduplication.
              </li>
              <li>
                Improved application performance by applying{" "}
                <strong>SSR/SSG, code splitting</strong>, and lazy loading.
              </li>
              <li>
                Collaborated with SEO team to implement metadata, sitemaps, and
                structured data.
              </li>
              <li>
                Contributed to frontend architecture decisions to improve{" "}
                <strong>scalability and maintainability</strong>.
              </li>
              <li>
                Took ownership of key features from development to production
                deployment.
              </li>
            </ul>
          </div>

          <div className={styles.job}>
            <div className={styles.jobHeader}>
              <span className={styles.jobTitle}>Front-end Developer</span>
              <span className={styles.jobDate}>Aug 2023 – Mar 2025</span>
            </div>
            <div className={styles.jobCompany}>FPT Software</div>
            <ul>
              <li>
                Developed <strong>real-time dashboards</strong> for an energy
                platform (Korean client) with live charting and table components
                using ApexCharts and Material UI.
              </li>
              <li>
                Developed and maintained <strong>Spring Boot REST APIs</strong>{" "}
                for energy trading modules.
              </li>
              <li>
                Integrated React frontend with Java backend services for
                real-time power system data; maintained stable UI under{" "}
                <strong>continuous data updates</strong>.
              </li>
              <li>
                Built and maintained frontend modules across projects using{" "}
                <strong>Angular and Vue.js</strong>.
              </li>
              <li>
                Led code reviews for key modules and{" "}
                <strong>mentored junior team members</strong>, ensuring code
                quality through PR reviews.
              </li>
            </ul>
          </div>

          <div className={styles.job}>
            <div className={styles.jobHeader}>
              <span className={styles.jobTitle}>Front-end Developer</span>
              <span className={styles.jobDate}>Feb 2022 – Aug 2023</span>
            </div>
            <div className={styles.jobCompany}>VNEXT Software</div>
            <ul>
              <li>
                Developed <strong>financial and analytics platforms</strong> for
                Vietnamese clients (FiinGroup) with reusable UI components and
                improved rendering performance.
              </li>
              <li>
                Built reusable UI components and improved performance for{" "}
                <strong>data-intensive dashboards</strong>.
              </li>
              <li>
                Worked with both <strong>React and Vue.js</strong> depending on
                project requirements.
              </li>
            </ul>
          </div>

          {/* <div className={`${styles.job} ${styles.pageBreak}`}> */}
          <div className={`${styles.job}`}>
            <div className={styles.jobHeader}>
              <span className={styles.jobTitle}>Fullstack Developer</span>
              <span className={styles.jobDate}>Jan 2021 – Feb 2022</span>
            </div>
            <div className={styles.jobCompany}>AMELA Technology</div>
            <ul>
              <li>
                Developed full-stack features using{" "}
                <strong>React, Node.js, and MySQL</strong> for web applications.
              </li>
              <li>
                Designed REST APIs and deployed applications on{" "}
                <strong>AWS (EC2, S3)</strong> with CI/CD pipelines.
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.secTitle}>Key Projects</div>
          <div className={styles.twoCol}>
            <div>
              <div className={styles.proj}>
                <div className={styles.projHeader}>
                  <span className={styles.projName}>Goonus</span>
                  <span className={styles.projDate}>Apr 2025 – May 2026</span>
                </div>
                <div className={styles.projSub}>ONUS Labs</div>
                <ul>
                  <li>
                    High-traffic crypto exchange platform serving 7M+ users with
                    real-time market data and trading features.
                  </li>
                  <li>
                    Built and optimized trading interfaces handling
                    high-frequency updates via WebSocket, improving data
                    consistency and UI responsiveness.
                  </li>
                </ul>
                <div className={styles.tech}>
                  Next.js · Tailwind CSS · Socket.io · TanStack Query · Zustand
                </div>
              </div>

              <div className={styles.proj}>
                <div className={styles.projHeader}>
                  <span className={styles.projName}>
                    Power Brokerage Platform
                  </span>
                  <span className={styles.projDate}>Jun 2024 – Mar 2025</span>
                </div>
                <div className={styles.projSub}>FPT Software</div>
                <ul>
                  <li>
                    Energy trading and monitoring platform providing real-time
                    insights for power systems.
                  </li>
                  <li>
                    Developed scalable dashboards and data visualization
                    components, ensuring stable UI under continuous real-time
                    data streams.
                  </li>
                  <li>
                    Built REST endpoints with Spring Boot for energy data
                    services; integrated with React dashboards for real-time
                    monitoring.
                  </li>
                </ul>
                <div className={styles.tech}>
                  React.js · Spring Boot · Redux · Material UI · ApexCharts
                </div>
              </div>

              <div className={styles.proj}>
                <div className={styles.projHeader}>
                  <span className={styles.projName}>Label Management</span>
                  <span className={styles.projDate}>Feb 2024 – May 2024</span>
                </div>
                <div className={styles.projSub}>FPT Software</div>
                <ul>
                  <li>
                    Developed frontend features using Vue.js, integrating APIs
                    to ensure seamless data flow and application stability.
                  </li>
                  <li>
                    Built reusable UI components with PrimeVue and managed state
                    using Pinia to improve maintainability.
                  </li>
                </ul>
                <div className={styles.tech}>Vue.js · Pinia · PrimeVue</div>
              </div>

              <div className={styles.proj}>
                <div className={styles.projHeader}>
                  <span className={styles.projName}>Newton – Nagase</span>
                  <span className={styles.projDate}>Aug 2023 – Jan 2024</span>
                </div>
                <div className={styles.projSub}>FPT Software</div>
                <ul>
                  <li>
                    Analyzed legacy WinForm code and translated complex business
                    logic into an Angular-based frontend.
                  </li>
                  <li>
                    Developed frontend features using Angular and NgRx to ensure
                    accurate data flow and system consistency.
                  </li>
                </ul>
                <div className={styles.tech}>Angular · NgRx</div>
              </div>
            </div>

            <div>
              <div className={styles.proj}>
                <div className={styles.projHeader}>
                  <span className={styles.projName}>FiinGate</span>
                  <span className={styles.projDate}>Jan 2023 – Jul 2023</span>
                </div>
                <div className={styles.projSub}>VNEXT Software</div>
                <ul>
                  <li>
                    Business intelligence platform for financial data analytics
                    and reporting.
                  </li>
                  <li>
                    Built reusable UI components and optimized rendering
                    performance for large-scale datasets and complex charts.
                  </li>
                </ul>
                <div className={styles.tech}>
                  React.js · Redux Toolkit · Sass · Recharts
                </div>
              </div>

              <div className={styles.proj}>
                <div className={styles.projHeader}>
                  <span className={styles.projName}>Tag Album</span>
                  <span className={styles.projDate}>Sep 2022 – Dec 2022</span>
                </div>
                <div className={styles.projSub}>VNEXT Software</div>
                <ul>
                  <li>
                    Collaborated with business and backend teams to create
                    user-friendly front-end interfaces.
                  </li>
                  <li>
                    Built and deployed the application with a focus on usability
                    and component reuse.
                  </li>
                </ul>
                <div className={styles.tech}>
                  Vue.js · Vuex · Vue Router · Bootstrap
                </div>
              </div>

              <div className={styles.proj}>
                <div className={styles.projHeader}>
                  <span className={styles.projName}>FiinPro-X</span>
                  <span className={styles.projDate}>Mar 2022 – Sep 2022</span>
                </div>
                <div className={styles.projSub}>VNEXT Software</div>
                <ul>
                  <li>
                    Worked closely with business and backend teams to build and
                    maintain front-end interfaces.
                  </li>
                  <li>
                    Debugged and resolved performance issues; maintained and
                    improved application quality.
                  </li>
                </ul>
                <div className={styles.tech}>
                  React.js · Redux Toolkit · TradingView · Fullcalendar
                </div>
              </div>

              <div className={styles.proj}>
                <div className={styles.projHeader}>
                  <span className={styles.projName}>E-Daotao & AMS</span>
                  <span className={styles.projDate}>Jan 2021 – Feb 2022</span>
                </div>
                <div className={styles.projSub}>AMELA Technology</div>
                <ul>
                  <li>
                    Designed and implemented REST APIs; built front-end and
                    back-end features for both projects.
                  </li>
                </ul>
                <div className={styles.tech}>
                  React.js · Express.js · MySQL · AWS
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.secTitle}>Education</div>
          <div className={styles.eduRow}>
            <div>
              <div className={styles.eduDeg}>
                Bachelor of Engineering – Electronics & Telecommunications
              </div>
              <div className={styles.eduSchool}>
                Hanoi University of Science and Technology
              </div>
            </div>
            <span className={styles.eduDate}>2017 – 2022</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.secTitle}>Certifications</div>
          <p className={styles.cert}>
            <strong>Senior React Certified Developer</strong> — certificates.dev
            · 2024
          </p>
        </div>
      </div>
    </div>
  );
}
