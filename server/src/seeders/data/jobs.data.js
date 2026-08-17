// Demo/dev job seed data. Real companies (already seeded), realistic but
// fictional postings — no claim that these companies are hiring through
// CUET Placement Network. Deadlines are computed relative to seed run time
// so the Find Jobs page always shows a spread of future dates.

const DAY = 24 * 60 * 60 * 1000;

function daysFromNow(days) {
  return new Date(Date.now() + days * DAY).toISOString().slice(0, 10);
}

// company name -> jobs. Each job: title, jobType, location, description,
// requirements. Descriptions/requirements are written per-role, not templated.
export const jobsByCompany = {
  bKash: [
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'bKash is looking for a Software Engineer to build and maintain services on our mobile financial platform, used by tens of millions of customers daily. You will work on backend services that handle transactions, wallet balances, and merchant payments, collaborating closely with QA and product teams to ship reliable features.',
      requirements:
        'Strong understanding of data structures, algorithms, and object-oriented design. Experience with Java or Node.js and relational databases. Familiarity with REST APIs and Git-based workflows. Skills: Java, Node.js, SQL, REST API, Git.',
    },
    {
      title: 'Backend Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Join the core banking integration team to design and maintain backend services that connect bKash with partner banks and payment rails. You will own service reliability, write clean API contracts, and participate in on-call rotations for production systems.',
      requirements:
        'Solid backend development experience with Node.js or Java, comfort with SQL and transactional data models, and an understanding of API security fundamentals. Skills: Node.js, Express, SQL, Docker, API Security.',
    },
    {
      title: 'Data Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'The Data Analyst role supports product and risk teams by turning transaction data into actionable insight — building dashboards, running ad-hoc analysis on usage patterns, and flagging anomalies that may indicate fraud or churn.',
      requirements:
        'Proficiency in SQL and a BI tool such as Power BI or Tableau, comfort with Excel for quick analysis, and basic statistics. Skills: SQL, Power BI, Excel, Statistics.',
    },
    {
      title: 'Management Trainee',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'A structured rotational program for recent graduates to gain exposure across bKash\'s operations, product, and business teams before settling into a permanent role aligned with their strengths.',
      requirements:
        'Bachelor\'s degree in any discipline with a strong academic record, leadership experience in university activities, and excellent communication skills. Skills: Communication, Leadership, Analytical Thinking, MS Office.',
    },
  ],

  Grameenphone: [
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Build internal tools and customer-facing digital services for Bangladesh\'s largest mobile network operator, working across billing, self-care app, and internal automation platforms.',
      requirements:
        'Experience with a modern backend language (Java, C#, or Node.js), REST API design, and relational databases. Skills: Java, REST API, SQL, Git.',
    },
    {
      title: 'Network Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Support planning, monitoring, and optimization of Grameenphone\'s mobile network infrastructure to maintain service quality across coverage areas.',
      requirements:
        'Understanding of mobile network architecture (2G/3G/4G), network monitoring tools, and troubleshooting methodology. Skills: Network Engineering, RF Planning, Troubleshooting, MATLAB.',
    },
    {
      title: 'Data Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Analyze subscriber usage and network performance data to support commercial and network planning decisions across the organization.',
      requirements:
        'Strong SQL skills, experience with a BI tool, and ability to communicate insights clearly to non-technical stakeholders. Skills: SQL, Power BI, Excel, Data Visualization.',
    },
    {
      title: 'Marketing Executive',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Support campaign planning and execution for Grameenphone\'s consumer segments, coordinating with agencies and analyzing campaign performance.',
      requirements:
        'Degree in business or marketing, understanding of digital marketing channels, and strong project coordination skills. Skills: Digital Marketing, Campaign Management, Analytics, Communication.',
    },
  ],

  'Robi Axiata': [
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Develop and maintain digital services for Robi\'s self-care app and internal business systems, working in an agile cross-functional team.',
      requirements:
        'Proficiency in a backend language and SQL, understanding of software development lifecycle, and Git experience. Skills: Java, SQL, REST API, Git.',
    },
    {
      title: 'Network Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Monitor and optimize Robi\'s radio access network performance, working with the technical operations team to resolve service degradation issues.',
      requirements:
        'Telecommunications or EEE background, familiarity with RAN performance tools, and analytical troubleshooting skills. Skills: RAN, Network Optimization, Troubleshooting.',
    },
    {
      title: 'Data Analyst',
      jobType: 'internship',
      location: 'Dhaka, Bangladesh',
      description:
        'A hands-on internship supporting the analytics team with subscriber behavior analysis, dashboard maintenance, and ad-hoc reporting.',
      requirements:
        'Currently pursuing or recently completed a degree in CSE, statistics, or a related field, with working knowledge of SQL and Excel. Skills: SQL, Excel, Statistics.',
    },
    {
      title: 'Management Trainee',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Rotational leadership development program exposing graduates to Robi\'s commercial, technology, and operations functions over 18 months.',
      requirements:
        'Strong academic record, demonstrated leadership in extracurricular activities, and excellent communication skills. Skills: Leadership, Communication, Analytical Thinking.',
    },
  ],

  Banglalink: [
    {
      title: 'Network Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Maintain and optimize Banglalink\'s core and access network to ensure consistent service quality for subscribers nationwide.',
      requirements:
        'EEE/ETE background with understanding of mobile network fundamentals and monitoring tools. Skills: Network Engineering, Troubleshooting, MATLAB.',
    },
    {
      title: 'Business Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Bridge business and technology teams by gathering requirements, documenting processes, and supporting the rollout of new commercial initiatives.',
      requirements:
        'Strong analytical and documentation skills, proficiency in Excel, and ability to communicate with both technical and non-technical stakeholders. Skills: Business Analysis, Excel, SQL, Communication.',
    },
  ],

  'Daraz Bangladesh': [
    {
      title: 'Frontend Developer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Build and improve customer-facing shopping experiences on Daraz\'s web platform, working closely with designers and backend engineers.',
      requirements:
        'Experience with React and modern JavaScript/TypeScript, understanding of responsive design, and familiarity with REST APIs. Skills: React, JavaScript, TypeScript, HTML, CSS.',
    },
    {
      title: 'Backend Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Develop scalable services powering Daraz\'s order management and catalog systems during high-traffic sales campaigns.',
      requirements:
        'Backend development experience in Node.js or Java, understanding of relational and NoSQL databases, and containerization basics. Skills: Node.js, SQL, Docker, REST API.',
    },
    {
      title: 'Product Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Support the e-commerce product team by analyzing conversion funnels, running experiments, and reporting on key marketplace metrics.',
      requirements:
        'SQL proficiency, familiarity with product analytics platforms, and comfort presenting data-driven recommendations. Skills: SQL, Product Analytics, Excel.',
    },
    {
      title: 'Operations Analyst',
      jobType: 'internship',
      location: 'Dhaka, Bangladesh',
      description:
        'Support the logistics and fulfillment operations team with data tracking, process documentation, and performance reporting during a 6-month internship.',
      requirements:
        'Currently pursuing a degree in engineering, business, or a related field, strong Excel skills, and attention to detail. Skills: Excel, Process Analysis, Data Entry.',
    },
  ],

  Pathao: [
    {
      title: 'Backend Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Build backend services powering Pathao\'s ride-hailing and delivery dispatch systems, optimized for high concurrency and low latency.',
      requirements:
        'Strong backend engineering skills in Node.js or Go, experience with distributed systems concepts, and SQL proficiency. Skills: Node.js, SQL, Docker, System Design.',
    },
    {
      title: 'Frontend Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Develop and maintain customer and rider-facing interfaces across Pathao\'s mobile and web products.',
      requirements:
        'Proficiency in React or React Native, strong JavaScript/TypeScript fundamentals, and experience with state management. Skills: React, React Native, JavaScript, TypeScript.',
    },
    {
      title: 'Data Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Analyze rider and driver behavior data to support pricing, dispatch, and growth decisions across Pathao\'s platform.',
      requirements:
        'Strong SQL and Python skills, experience with data visualization tools, and understanding of basic statistics. Skills: Python, SQL, Power BI, Statistics.',
    },
    {
      title: 'Operations Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Monitor and improve city-level operational metrics for Pathao\'s ride and delivery services, coordinating with field operations teams.',
      requirements:
        'Analytical mindset, Excel proficiency, and comfort working with operational data under time pressure. Skills: Excel, Operations Analysis, SQL.',
    },
  ],

  'Brain Station 23': [
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Work on client software projects spanning web and mobile applications for both local and international clients, in a fast-paced software services environment.',
      requirements:
        'Solid programming fundamentals in at least one modern language, understanding of OOP, and eagerness to work across different tech stacks. Skills: JavaScript, Java, SQL, Git.',
    },
    {
      title: 'Full Stack Developer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Build end-to-end features for client web applications, from database schema design to responsive frontend implementation.',
      requirements:
        'Experience with React or Vue on the frontend and Node.js or Laravel on the backend, plus SQL. Skills: React, Node.js, SQL, REST API.',
    },
    {
      title: 'QA Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Design and execute manual and automated test plans for client software releases, ensuring quality before deployment.',
      requirements:
        'Understanding of software testing methodology, experience with at least one automation tool, and strong attention to detail. Skills: Manual Testing, Selenium, Test Planning, SQL.',
    },
    {
      title: 'UI/UX Designer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Design user interfaces and experiences for client web and mobile products, from wireframes through high-fidelity prototypes.',
      requirements:
        'Proficiency in Figma, understanding of user-centered design principles, and a portfolio demonstrating UI/UX work. Skills: Figma, UI Design, UX Research, Prototyping.',
    },
  ],

  'Enosis Solutions': [
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Develop software products for international clients across healthcare, fintech, and logistics domains as part of an agile delivery team.',
      requirements:
        'Strong programming fundamentals, experience with a backend or frontend framework, and SQL knowledge. Skills: JavaScript, C#, SQL, Git.',
    },
  ],

  'BJIT Group': [
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Contribute to software development projects for Japanese and international clients, working within cross-cultural agile teams.',
      requirements:
        'Solid understanding of data structures and OOP, experience with Java or C#, and SQL proficiency. Skills: Java, C#, SQL, Git.',
    },
    {
      title: 'QA Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Perform functional and regression testing on enterprise client applications, documenting defects and verifying fixes.',
      requirements:
        'Understanding of QA methodology, experience with bug tracking tools, and strong written communication for defect reports. Skills: Manual Testing, Test Planning, Bug Tracking.',
    },
    {
      title: 'DevOps Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Manage CI/CD pipelines and cloud infrastructure for client projects, ensuring reliable and repeatable deployments.',
      requirements:
        'Experience with Docker, a CI/CD tool, and basic cloud platform knowledge (AWS or Azure). Skills: Docker, CI/CD, AWS, Linux.',
    },
  ],

  TigerIT: [
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Develop software components for biometric identification and government identity systems, requiring high reliability and precision.',
      requirements:
        'Strong programming fundamentals in C++ or Java, understanding of algorithms, and attention to detail. Skills: C++, Java, Algorithms, Git.',
    },
    {
      title: 'Machine Learning Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Work on biometric matching and computer vision models used in national identity verification systems.',
      requirements:
        'Experience with Python and a deep learning framework, understanding of computer vision fundamentals, and math background. Skills: Python, PyTorch, Computer Vision, Machine Learning.',
    },
    {
      title: 'Cybersecurity Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Secure identity and biometric systems against unauthorized access, performing security reviews and implementing safeguards.',
      requirements:
        'Understanding of application security principles, experience with security testing tools, and knowledge of encryption fundamentals. Skills: Application Security, Penetration Testing, Cryptography.',
    },
  ],

  'DataSoft Systems': [
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Build enterprise software systems for banking and government clients, working across the full development lifecycle.',
      requirements:
        'Proficiency in Java or .NET, SQL database experience, and understanding of enterprise application architecture. Skills: Java, .NET, SQL, Git.',
    },
  ],

  'Therap (BD)': [
    {
      title: 'QA Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Test healthcare workflow features for compliance and reliability before release to production environments.',
      requirements:
        'Understanding of software QA processes, attention to detail for compliance-sensitive features, and test case writing skills. Skills: Manual Testing, Test Case Design, SQL.',
    },
  ],

  'Augmedix Bangladesh': [
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Build tools that support real-time medical documentation workflows, integrating with speech and NLP-driven systems.',
      requirements:
        'Programming experience in Python or Java, interest in health tech, and SQL familiarity. Skills: Python, Java, SQL, REST API.',
    },
    {
      title: 'Data Analyst',
      jobType: 'internship',
      location: 'Dhaka, Bangladesh',
      description:
        'Support the analytics team in reviewing documentation quality metrics and preparing internal reports during a paid internship.',
      requirements:
        'Currently pursuing a degree in CSE, statistics, or related field, with basic SQL and Excel skills. Skills: SQL, Excel, Data Analysis.',
    },
  ],

  Walton: [
    {
      title: 'Mechanical Engineer',
      jobType: 'full-time',
      location: 'Gazipur, Bangladesh',
      description:
        'Join Walton\'s product engineering team to design and refine mechanical components for home appliances, from concept through manufacturing handoff.',
      requirements:
        'BSc in Mechanical Engineering, proficiency in SolidWorks or AutoCAD, and understanding of manufacturing processes. Skills: SolidWorks, AutoCAD, Mechanical Design, Manufacturing.',
    },
    {
      title: 'Electrical Engineer',
      jobType: 'full-time',
      location: 'Gazipur, Bangladesh',
      description:
        'Design and test electrical systems for Walton\'s consumer electronics and appliance product lines.',
      requirements:
        'BSc in EEE, understanding of circuit design and electrical safety standards, and familiarity with testing equipment. Skills: Circuit Design, Electrical Testing, MATLAB.',
    },
    {
      title: 'Production Engineer',
      jobType: 'full-time',
      location: 'Gazipur, Bangladesh',
      description:
        'Oversee production line efficiency at Walton\'s manufacturing facility, identifying bottlenecks and implementing process improvements.',
      requirements:
        'Background in Mechanical, Industrial, or Production Engineering, understanding of lean manufacturing, and hands-on plant floor experience preferred. Skills: Lean Manufacturing, Process Improvement, Production Planning.',
    },
    {
      title: 'Quality Engineer',
      jobType: 'full-time',
      location: 'Gazipur, Bangladesh',
      description:
        'Ensure Walton products meet quality and safety standards through inspection protocols, root-cause analysis, and supplier audits.',
      requirements:
        'Engineering background with knowledge of quality control methodologies such as Six Sigma, and strong documentation skills. Skills: Quality Control, Six Sigma, Root Cause Analysis.',
    },
    {
      title: 'Supply Chain Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Support demand planning and supplier coordination for Walton\'s component sourcing and finished goods distribution.',
      requirements:
        'Background in Industrial Engineering or Business, Excel proficiency, and understanding of inventory management principles. Skills: Supply Chain, Excel, Inventory Management.',
    },
    {
      title: 'Civil Engineer',
      jobType: 'full-time',
      location: 'Gazipur, Bangladesh',
      description:
        'Support facility expansion and infrastructure projects across Walton\'s manufacturing campus, coordinating with contractors on civil works.',
      requirements:
        'BSc in Civil Engineering, familiarity with AutoCAD and structural drawings, and site supervision experience preferred. Skills: AutoCAD, Structural Analysis, Project Management, Site Supervision.',
    },
  ],

  'PRAN-RFL Group': [
    {
      title: 'Production Engineer',
      jobType: 'full-time',
      location: 'Gazipur, Bangladesh',
      description:
        'Manage daily production operations at a PRAN-RFL manufacturing unit, ensuring output targets and safety standards are met.',
      requirements:
        'BSc in Mechanical, Industrial, or Chemical Engineering, and willingness to work in a factory environment. Skills: Production Planning, Manufacturing, Process Optimization.',
    },
    {
      title: 'Quality Control Engineer',
      jobType: 'full-time',
      location: 'Gazipur, Bangladesh',
      description:
        'Conduct quality inspections and testing for food and consumer goods products to ensure compliance with safety standards.',
      requirements:
        'Background in Food Engineering, Chemical Engineering, or related field, and familiarity with QC testing procedures. Skills: Quality Control, Food Safety Standards, Lab Testing.',
    },
    {
      title: 'Supply Chain Executive',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Coordinate distribution logistics between PRAN-RFL manufacturing units and regional distribution centers nationwide.',
      requirements:
        'Business or Industrial Engineering background, strong coordination skills, and Excel proficiency. Skills: Supply Chain, Logistics, Excel.',
    },
    {
      title: 'Industrial Engineer',
      jobType: 'full-time',
      location: 'Gazipur, Bangladesh',
      description:
        'Analyze and improve manufacturing workflows across PRAN-RFL production lines, applying lean methods to reduce waste and increase throughput.',
      requirements:
        'BSc in Industrial and Production Engineering, familiarity with Lean and Six Sigma methods, and strong analytical skills. Skills: Lean Manufacturing, Six Sigma, Process Optimization, Time Study.',
    },
    {
      title: 'Management Trainee',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Structured graduate program rotating across PRAN-RFL\'s production, supply chain, and sales functions over the first year.',
      requirements:
        'Bachelor\'s degree in any discipline with strong leadership and communication skills. Skills: Leadership, Communication, Problem Solving.',
    },
  ],

  'Square Group': [
    {
      title: 'Production Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Support pharmaceutical production operations at a Square manufacturing facility, ensuring GMP-compliant processes.',
      requirements:
        'BSc in Chemical, Mechanical, or Pharmaceutical Engineering, and understanding of GMP standards. Skills: GMP, Production Engineering, Process Control.',
    },
    {
      title: 'Quality Control Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Perform quality testing on pharmaceutical products to ensure compliance with regulatory and internal standards.',
      requirements:
        'Chemical Engineering or Pharmacy background, lab testing experience, and attention to regulatory detail. Skills: Quality Control, Lab Testing, GMP Compliance.',
    },
    {
      title: 'Process Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Optimize manufacturing processes for efficiency and consistency across Square\'s production lines.',
      requirements:
        'Chemical or Industrial Engineering background, understanding of process optimization methods, and analytical skills. Skills: Process Engineering, Six Sigma, Process Optimization.',
    },
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Develop internal systems supporting Square\'s manufacturing resource planning and distribution tracking.',
      requirements:
        'Programming experience in Java or C#, SQL knowledge, and interest in enterprise software. Skills: Java, SQL, REST API.',
    },
  ],

  'ACI Limited': [
    {
      title: 'Quality Control Engineer',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Ensure product quality compliance across ACI\'s pharmaceutical and consumer brands manufacturing lines.',
      requirements:
        'Background in Chemical Engineering or Pharmacy, familiarity with QC testing standards. Skills: Quality Control, GMP, Lab Testing.',
    },
    {
      title: 'Supply Chain Executive',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Manage inventory planning and distribution coordination for ACI\'s consumer brands and agribusiness divisions.',
      requirements:
        'Business or Industrial Engineering background, strong Excel skills, and coordination ability. Skills: Supply Chain, Excel, Inventory Planning.',
    },
    {
      title: 'Business Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Support strategic decision-making across ACI\'s diversified business units through market and financial analysis.',
      requirements:
        'Business or Engineering degree, strong Excel and analytical skills, and clear written communication. Skills: Business Analysis, Excel, SQL, Communication.',
    },
  ],

  Google: [
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Mountain View, CA',
      description:
        'Design, develop, and maintain large-scale distributed systems that serve billions of users, collaborating with cross-functional teams across Google products.',
      requirements:
        'Strong foundation in data structures, algorithms, and system design. Proficiency in at least one of C++, Java, Python, or Go. Skills: C++, Java, Python, System Design, Algorithms.',
    },
    {
      title: 'Data Scientist',
      jobType: 'full-time',
      location: 'Remote',
      description:
        'Apply statistical modeling and machine learning to product and infrastructure data, driving decisions across Google\'s product teams.',
      requirements:
        'Strong statistics and Python/R skills, experience with large-scale data analysis, and a graduate degree preferred. Skills: Python, R, Statistics, Machine Learning, SQL.',
    },
    {
      title: 'Cloud Engineer',
      jobType: 'full-time',
      location: 'Remote',
      description:
        'Support customers building on Google Cloud Platform, helping design scalable and secure cloud architectures.',
      requirements:
        'Experience with cloud infrastructure (GCP, AWS, or Azure), understanding of networking and security fundamentals, and scripting ability. Skills: GCP, Kubernetes, Cloud Architecture, Linux.',
    },
  ],

  Microsoft: [
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Redmond, WA',
      description:
        'Build features for Microsoft\'s cloud and productivity platforms, working within an agile engineering team on high-scale services.',
      requirements:
        'Strong CS fundamentals, experience with C# or C++, and familiarity with cloud-native development. Skills: C#, .NET, Azure, System Design.',
    },
    {
      title: 'Cloud Engineer',
      jobType: 'full-time',
      location: 'Remote',
      description:
        'Design and operate Azure-based infrastructure supporting enterprise customer workloads at scale.',
      requirements:
        'Experience with Azure services, infrastructure-as-code tools, and containerization. Skills: Azure, Kubernetes, Terraform, CI/CD.',
    },
    {
      title: 'Product Analyst',
      jobType: 'internship',
      location: 'Remote',
      description:
        'Summer internship supporting a product team with usage analytics, competitive research, and go-to-market data support.',
      requirements:
        'Currently pursuing a degree in a quantitative or business field, strong Excel/SQL skills, and clear communication. Skills: SQL, Excel, Product Analytics.',
    },
  ],

  Amazon: [
    {
      title: 'Data Analyst',
      jobType: 'full-time',
      location: 'Remote',
      description:
        'Analyze fulfillment and supply chain data to support operational efficiency initiatives across Amazon\'s logistics network.',
      requirements:
        'Strong SQL and Excel skills, experience with a BI tool, and comfort working with large datasets. Skills: SQL, Excel, Power BI, Statistics.',
    },
  ],

  Meta: [
    {
      title: 'Machine Learning Engineer',
      jobType: 'full-time',
      location: 'Remote',
      description:
        'Build and deploy machine learning models that power content ranking and recommendation systems.',
      requirements:
        'Strong Python skills, experience with PyTorch or TensorFlow, and understanding of ML systems at scale. Skills: Python, PyTorch, TensorFlow, Machine Learning.',
    },
  ],

  Adobe: [
    {
      title: 'Software Engineer',
      jobType: 'full-time',
      location: 'Remote',
      description:
        'Build features for Adobe\'s creative cloud applications, working on performance-critical rendering and collaboration systems.',
      requirements:
        'Strong C++ or JavaScript skills, understanding of software architecture, and attention to product quality. Skills: C++, JavaScript, System Design.',
    },
    {
      title: 'UI/UX Designer',
      jobType: 'full-time',
      location: 'Remote',
      description:
        'Design intuitive interfaces for Adobe\'s creative tools, balancing power-user functionality with accessibility.',
      requirements:
        'Strong portfolio in product design, proficiency in Figma, and understanding of design systems. Skills: Figma, UI Design, Design Systems, Prototyping.',
    },
  ],

  Accenture: [
    {
      title: 'Technology Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Support client technology implementation projects across cloud migration, application development, and systems integration engagements.',
      requirements:
        'CSE or related engineering degree, strong problem-solving skills, and willingness to learn client-specific technologies. Skills: SQL, Cloud, Java, Communication.',
    },
    {
      title: 'Business Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Gather and document business requirements for client engagements, bridging the gap between business needs and technical delivery teams.',
      requirements:
        'Business or engineering background, strong analytical and communication skills, and Excel proficiency. Skills: Business Analysis, Excel, SQL, Communication.',
    },
    {
      title: 'Management Consultant',
      jobType: 'full-time',
      location: 'Remote',
      description:
        'Advise clients on operational strategy and process improvement initiatives as part of Accenture\'s global consulting practice.',
      requirements:
        'Strong academic record, exceptional communication skills, and analytical problem-solving ability. Skills: Consulting, Strategy, Communication, Presentation.',
    },
    {
      title: 'Cloud Engineer',
      jobType: 'full-time',
      location: 'Remote',
      description:
        'Implement and manage cloud infrastructure for enterprise clients as part of Accenture\'s cloud practice.',
      requirements:
        'Experience with a major cloud platform, understanding of DevOps practices, and client-facing communication skills. Skills: AWS, Azure, DevOps, Cloud Architecture.',
    },
  ],

  Deloitte: [
    {
      title: 'Business Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Support advisory engagements by analyzing client business processes and preparing recommendations for operational improvement.',
      requirements:
        'Business or engineering degree, strong Excel and analytical skills, and professional communication ability. Skills: Business Analysis, Excel, Communication.',
    },
    {
      title: 'Risk Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Assess financial and operational risk for client organizations as part of Deloitte\'s risk advisory practice.',
      requirements:
        'Finance, business, or engineering background, understanding of risk frameworks, and strong analytical skills. Skills: Risk Analysis, Excel, Financial Modeling.',
    },
    {
      title: 'Financial Analyst',
      jobType: 'full-time',
      location: 'Remote',
      description:
        'Support financial due diligence and advisory engagements, building models and analyzing client financial statements.',
      requirements:
        'Finance or business degree, strong Excel modeling skills, and attention to detail. Skills: Financial Modeling, Excel, Financial Analysis.',
    },
  ],

  PwC: [
    {
      title: 'Associate Consultant',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Join client engagement teams delivering audit, tax, or advisory services as part of PwC\'s early-career consulting track.',
      requirements:
        'Business, finance, or engineering degree, strong analytical and communication skills, and professional demeanor. Skills: Consulting, Communication, Excel.',
    },
    {
      title: 'Data Analyst',
      jobType: 'full-time',
      location: 'Remote',
      description:
        'Support client engagements with data extraction, cleaning, and analysis to inform advisory recommendations.',
      requirements:
        'SQL and Excel proficiency, experience with a BI tool, and strong attention to detail. Skills: SQL, Excel, Power BI, Data Analysis.',
    },
    {
      title: 'Technology Consultant',
      jobType: 'full-time',
      location: 'Remote',
      description:
        'Support technology transformation engagements for clients, including systems assessment and implementation planning.',
      requirements:
        'CSE or business background, understanding of enterprise systems, and client-facing communication skills. Skills: Consulting, SQL, Business Analysis, Communication.',
    },
  ],

  BRAC: [
    {
      title: 'Research Assistant',
      jobType: 'internship',
      location: 'Dhaka, Bangladesh',
      description:
        'Support field research and data collection for BRAC\'s development programs in health, education, or microfinance.',
      requirements:
        'Currently pursuing a degree in social science, public health, or a related field, with strong data collection and writing skills. Skills: Research, Data Collection, Excel, Report Writing.',
    },
    {
      title: 'Data Analyst',
      jobType: 'full-time',
      location: 'Dhaka, Bangladesh',
      description:
        'Analyze program monitoring data to support evidence-based decision-making across BRAC\'s development initiatives.',
      requirements:
        'Statistics, public health, or CSE background, strong SQL and Excel skills, and interest in social impact. Skills: SQL, Excel, Statistics, Data Analysis.',
    },
  ],
};
