// Demo/dev resource seed data. Original content written for the CUET
// Placement Network project — not copied from any external source.
// One resource (marked isFeatured) is shown prominently on the public page.

export const resources = [
  // --- Career Guidance (3) ---
  {
    title: 'How to Choose the Right Career Path as an Engineering Student',
    category: 'career_guidance',
    excerpt:
      'Choosing a direction after graduation feels overwhelming when every department offers dozens of possible paths. Here is a practical framework to narrow things down.',
    tags: 'Career, CSE, EEE, Mechanical, Civil, IPE',
    readingTimeMinutes: 7,
    isFeatured: true,
    content: `Most engineering students reach their third year and realize the same uncomfortable truth: nobody explained how to actually choose a career path. You picked a department at eighteen based on merit rank, and now you are expected to know whether you want to be a design engineer, a software developer, a project manager, or something else entirely.

Start with what you already know about yourself, not what sounds impressive. If you enjoy debugging problems for hours without getting bored, software or hardware troubleshooting roles will suit you. If you like seeing physical results of your work, production, site, or manufacturing roles will feel more rewarding than a desk job ever will. If you are energized by talking to people and negotiating outcomes, business, sales, or project management paths deserve serious consideration even if your department is technical.

Look at what you gravitate toward outside of coursework. The clubs you join, the side projects you start without being told to, and the topics you research on your own time are stronger signals than your CGPA in any single course. A Civil Engineering student who spends weekends learning estimation software is telling you something different than one who spends weekends organizing events — both are valid directions, but they point to different careers.

Talk to seniors who graduated two to four years ago, not just the ones who landed the most talked-about jobs. Ask what their actual day looks like, not just their job title. A "Software Engineer" at a bank does very different work than one at a startup. A "Production Engineer" at a garments factory does different work than one at a pharmaceutical plant. Titles hide a lot of variation.

Finally, accept that your first job does not have to be your final answer. Career paths in Bangladesh's job market are rarely linear — mechanical engineers move into supply chain, CSE graduates move into product management, business graduates move into operations. Pick a reasonable next step based on what you know now, take it, and let real experience refine your direction from there.`,
  },
  {
    title: 'Internship Planning: When and How to Start Looking',
    category: 'career_guidance',
    excerpt:
      'Internships are most valuable when you plan for them instead of applying at the last minute. Here is a realistic timeline for CUET students.',
    tags: 'Internship, Career, Planning',
    readingTimeMinutes: 6,
    content: `Many students wait until their final year to think about internships, then scramble to find something — anything — that will look acceptable on a CV. A better approach treats the internship search as a project with its own timeline, starting well before you actually need one.

Begin building toward an internship by your second year, even if you do not apply yet. This means keeping your CGPA in a defensible range, picking up at least one practical skill relevant to your interests (a programming language, a design tool, a certification), and staying aware of which companies in Bangladesh actually offer structured internship programs in your field.

By the start of your third year, start following the companies you are interested in — their career pages, their LinkedIn presence, their past intern cohorts if visible. Many Bangladeshi companies do not post internships publicly on a fixed schedule; they often hire when a team has capacity, which means timing and networking matter more than they would in markets with formal recruiting seasons.

Apply broadly, not just to your dream company. A three-month internship at a smaller, less prestigious company that gives you real responsibility is worth more on your CV and in your actual skill growth than an unpaid internship at a famous company where you mostly observe. Prioritize learning over logo recognition, especially for your first internship.

Treat the internship itself as an extended interview. Companies frequently convert strong interns into full-time offers, skipping the formal interview process entirely. Show up on time, ask thoughtful questions, finish what you are assigned, and build real relationships with your team — this often matters more than the specific technical output you produce during a short internship.`,
  },
  {
    title: 'Building a Realistic Career Roadmap Before You Graduate',
    category: 'career_guidance',
    excerpt:
      'A career roadmap does not need to be a rigid five-year plan. It needs to give you enough direction to make good decisions each semester.',
    tags: 'Career, Planning, FreshGraduate',
    readingTimeMinutes: 6,
    content: `A career roadmap sounds like a corporate exercise, but at its core it is just a way of turning "I want a good job someday" into decisions you can actually act on this semester. You do not need to predict exactly where you will be in ten years — you need enough clarity to choose your next elective, your next project, and your next application wisely.

Start by writing down two or three plausible directions, not one fixed answer. For example, a Mechanical Engineering student might list: design and CAD-focused roles, production and manufacturing roles, and a pivot toward supply chain or operations. You do not have to commit to one yet, but naming them lets you evaluate every opportunity against a real list instead of drifting.

For each direction, identify the one or two gaps that would matter most if a recruiter compared you to someone who is already strong in that path. This might be a specific software skill, a certification, a portfolio project, or simply more exposure through a relevant internship. Address the biggest gap first — trying to fix everything at once usually means finishing nothing.

Set checkpoints tied to your academic calendar rather than arbitrary dates. "By the end of this semester, I will have completed one project I can talk about in an interview" is more useful than "by next year, I will be job-ready," because it forces a concrete, gradable output.

Revisit your roadmap every six months. It is normal for the honest answer to change — many students discover they enjoy a discipline-adjacent path more than their original major once they get real exposure to it. A roadmap that cannot be revised is not a plan, it is a guess you are refusing to update.`,
  },

  // --- Resume & CV (3) ---
  {
    title: 'How to Write a Strong CV as a Fresh Graduate',
    category: 'resume_cv',
    excerpt:
      'Fresh graduates often struggle with a CV that feels empty. Here is how to present coursework, projects, and activities in a way recruiters actually value.',
    tags: 'Resume, FreshGraduate, JobSearch',
    readingTimeMinutes: 8,
    content: `Fresh graduate CVs tend to fail for one of two reasons: they list too little, or they list too much without explaining why any of it matters. A strong CV is not about having years of experience — it is about presenting the experience you do have in a way that shows judgment and impact.

Start with a short summary, two to three lines, that states your field, your strongest skill area, and what kind of role you are looking for. Skip generic lines like "hardworking team player seeking growth opportunities" — every CV says that, and it tells a recruiter nothing. Instead, be specific: "Final-year CSE student with hands-on experience building full-stack web applications, seeking a backend engineering role."

Your academic projects deserve real space on the CV, not a one-line mention. For each significant project, state what the project did, what your specific contribution was, and what tools or techniques you used. "Built a food delivery web app" tells a recruiter almost nothing. "Built the order-matching backend for a food delivery web app using Node.js and MySQL, handling real-time status updates for over 200 test orders" tells them you understand scope and can describe technical work clearly.

List relevant coursework only if it adds information a recruiter would not otherwise guess from your degree — advanced or specialized courses, not the standard curriculum. Extracurricular activities matter more than students think, especially leadership roles in clubs, competitions, or organizing committees, because they demonstrate initiative and ownership that a transcript cannot show.

Keep the CV to one page unless you genuinely have enough substantial experience to justify two. Use a clean, readable format without decorative graphics that confuse automated screening systems. Proofread it more than once — a CV with spelling errors signals carelessness before a recruiter has read a single line of your actual qualifications.`,
  },
  {
    title: 'Making Your Resume ATS-Friendly Without Making It Boring',
    category: 'resume_cv',
    excerpt:
      'Applicant tracking systems filter resumes before a human ever sees them. Here is how to pass that filter while still writing a CV people want to read.',
    tags: 'Resume, ATS, JobSearch',
    readingTimeMinutes: 6,
    content: `Larger companies, including many operating in Bangladesh, use applicant tracking systems (ATS) to scan resumes for relevant keywords before a recruiter ever opens them manually. A resume that looks great to a human but confuses this software can be filtered out before anyone reads it.

The biggest ATS risk is formatting, not content. Multi-column layouts, text inside images, tables used for layout, and unusual fonts can all cause parsing errors that scramble your resume into unreadable text on the recruiter's side. Stick to a single-column layout with standard section headings like "Experience," "Education," and "Skills" — these are the labels ATS software is trained to recognize.

Match your language to the job posting where it is honestly accurate. If a posting asks for "REST API development" and you built one, use that exact phrase somewhere in your CV rather than only writing "backend development." This is not about stuffing keywords dishonestly — it is about not losing credit for skills you genuinely have just because you phrased them differently than the job description.

Save and submit your resume as a PDF unless a company specifically requests another format, since PDFs preserve formatting reliably across most ATS platforms. Avoid unusual file names like "resume_final_v3_edited.pdf" — use something clean like "YourName_Resume.pdf."

None of this means writing for a machine at the expense of a human reader. A resume that is ATS-friendly and well-written are not in conflict — clear section headers, specific accomplishments, and honest keyword alignment serve both audiences at once.`,
  },
  {
    title: 'Common CV Mistakes That Cost Fresh Graduates Interviews',
    category: 'resume_cv',
    excerpt:
      'Small, avoidable mistakes quietly eliminate strong candidates before they get a chance to interview. Here are the ones seen most often.',
    tags: 'Resume, FreshGraduate, Mistakes',
    readingTimeMinutes: 5,
    content: `Most CV mistakes are not dramatic — they are small habits that quietly signal a lack of attention to detail, which is exactly the trait recruiters are screening for even in an entry-level candidate.

The most common mistake is vague accomplishment statements. Writing "responsible for managing project tasks" describes a duty, not a result. A stronger version states what happened because of your work: "coordinated a five-member team to deliver a course project two weeks ahead of deadline." Recruiters read dozens of CVs and remember specifics, not duties.

Inconsistent formatting is the second most common issue — mixing date formats, inconsistent bullet styles, or uneven spacing between sections. These details seem minor, but a recruiter scanning fifty CVs in an afternoon subconsciously treats formatting sloppiness as a preview of how you will handle work products on the job.

Listing skills you cannot actually discuss in an interview is a mistake that only surfaces later, but it does real damage. If you list "Machine Learning" because you completed one short online course, be ready for a technical interviewer to ask a basic follow-up question. Overselling a skill you cannot back up is worse than leaving it off entirely.

Using an unprofessional email address is a small thing that still happens constantly — an email like "coolguy_2019@example.com" undercuts an otherwise strong CV. Create a simple professional email using your name before you start applying anywhere.

Finally, sending the same generic CV to every single job without any tailoring wastes strong material. You do not need a completely different CV for each application, but adjusting your summary line and reordering your most relevant projects to match each specific role takes ten minutes and meaningfully improves your response rate.`,
  },

  // --- Interview Preparation (3) ---
  {
    title: 'Common Engineering Job Interview Questions and How to Answer Them',
    category: 'interview_prep',
    excerpt:
      'Engineering interviews mix technical questions with judgment questions. Here are the patterns that show up most often across disciplines.',
    tags: 'Interview, CSE, EEE, Mechanical, Civil',
    readingTimeMinutes: 8,
    content: `Engineering interviews, regardless of discipline, tend to follow recognizable patterns once you have sat through a few of them. Preparing for the pattern, not just memorizing answers, will serve you better across different companies and roles.

"Walk me through one of your projects" is almost guaranteed to come up. Prepare a two-minute version of your strongest project that covers the problem you were solving, your specific role, the key technical decision you made, and the outcome. Practice this out loud — students who prepare this mentally but never say it aloud often ramble when the moment actually arrives.

Technical fundamentals questions test whether your coursework actually stuck, not whether you memorized formulas. A Mechanical Engineering interviewer might ask you to explain a stress-strain concept in plain language. An EEE interviewer might ask you to reason through a basic circuit out loud. A Civil Engineering interviewer might ask how you would approach a load calculation at a high level. These questions are checking whether you understand the underlying concept well enough to explain it simply, not whether you can recite a textbook definition.

"Why do you want to work here" deserves a genuine, specific answer, not a generic one. Research the company's actual products, projects, or market position beforehand, and connect that to something concrete about your background or interests. Interviewers can immediately tell when this question gets a copy-paste answer that could apply to any company.

Judgment questions like "tell me about a time you disagreed with a team member" or "how do you handle a tight deadline" are assessing whether you can work with other people under pressure, which matters as much as technical skill in most entry-level roles. Prepare one or two real examples from coursework, projects, or extracurriculars — vague hypothetical answers are noticeably weaker than a specific real situation.

Always prepare two or three thoughtful questions to ask the interviewer at the end. Asking about the team structure, what a typical first six months looks like, or what skills the team wishes new hires arrived with shows genuine engagement, not just interest in getting an offer.`,
  },
  {
    title: 'How to Introduce Yourself in an Interview Without Sounding Rehearsed',
    category: 'interview_prep',
    excerpt:
      'The self-introduction sets the tone for the entire interview. Here is how to prepare one that sounds natural instead of memorized.',
    tags: 'Interview, Communication, FreshGraduate',
    readingTimeMinutes: 5,
    content: `The "tell me about yourself" opener feels simple, but it is often where candidates lose momentum before the interview really starts. A strong introduction is not a recited biography — it is a short, structured answer that gives the interviewer a clear reason to keep listening.

A reliable structure is present, past, future. Start with where you are now (your degree, your final year status, your area of focus). Move to relevant past experience — one or two things that best support the role you are applying for, not your entire academic history. End with what you are looking for next and why this specific opportunity interests you.

Keep it to sixty to ninety seconds. Longer introductions tend to lose focus and start including irrelevant details, while the interviewer is quietly waiting for you to get to the point. If you find yourself unsure whether to include something, cut it — you can always expand on details if they ask a follow-up question.

Avoid reciting your CV line by line. The interviewer already has your CV in front of them; repeating it verbatim wastes the one open-ended moment where you control the narrative. Use this time instead to connect the dots between your experiences in a way the CV alone cannot show — why you moved from one interest to another, what pattern connects your projects.

Practice out loud, not just in your head, several times before the actual interview. The gap between an answer that sounds good mentally and one that sounds smooth when spoken is larger than most people expect. Practicing with a friend or even recording yourself once will reveal filler words and awkward transitions you would not otherwise notice.

Sound like yourself, not like a corporate press release. Interviewers interview many candidates in a week; a natural, specific, slightly informal introduction is more memorable than a stiff, over-rehearsed one.`,
  },
  {
    title: 'Interview Preparation Checklist: The Week Before',
    category: 'interview_prep',
    excerpt:
      'Good interview preparation is mostly about removing avoidable mistakes, not memorizing perfect answers. Here is a practical checklist.',
    tags: 'Interview, Checklist, JobSearch',
    readingTimeMinutes: 5,
    content: `Interview preparation is often treated as an all-or-nothing exercise — either you feel ready or you panic the night before. A structured checklist in the days leading up to the interview removes most of the avoidable failure points.

Research the company beyond its homepage. Understand what it actually does, who its customers or users are, and any recent news relevant to its business. For Bangladeshi companies especially, understanding their specific market position — whether they are a market leader, a newer challenger, or a specialized niche player — gives you material for both your answers and your own questions.

Re-read the job description carefully and match it against your own background. Identify two or three specific experiences from your CV that map directly to the requirements listed, and have a ready example for each one. This preparation prevents the common failure of having relevant experience but forgetting to mention it under pressure.

Prepare your logistics the day before, not the morning of. Confirm the interview time, location or video call link, and what documents you need to bring. For in-person interviews in Dhaka or Chattogram, account for realistic travel time given traffic, and plan to arrive ten to fifteen minutes early rather than exactly on time.

Prepare your appearance appropriately for the company and role — when uncertain, slightly more formal is safer than too casual, particularly for first interviews at more traditional companies like banks, telecom operators, or established manufacturing firms.

On the day itself, eat something beforehand, bring a printed CV even if you already submitted it digitally, and bring a notebook and pen. Small preparation details like these reduce unnecessary stress and let you focus your energy on actually answering questions well instead of managing avoidable logistics problems in the moment.`,
  },

  // --- Job Search (3) ---
  {
    title: 'How to Read a Job Description Properly Before Applying',
    category: 'job_search',
    excerpt:
      'Many students apply to jobs without actually reading what is being asked. Here is how to read a posting the way a recruiter wrote it.',
    tags: 'JobSearch, Resume, Skills',
    readingTimeMinutes: 6,
    content: `A job description is not just a formality to skim before clicking apply — it is a recruiter telling you, in their own words, exactly what they are trying to solve. Reading it carefully changes both whether you should apply and how you present yourself if you do.

Separate the requirements into "must-have" and "nice-to-have," even if the posting does not label them that way. Core technical skills mentioned early and repeated throughout the description are usually genuine requirements. Skills mentioned once, near the end, in a phrase like "familiarity with X is a plus" are usually flexible. Many strong candidates avoid applying to good-fit roles because they assume every listed skill is mandatory.

Pay attention to the responsibilities section, not just the qualifications section. This is where you learn what the role actually involves day to day, which often tells you more about fit than the requirements list. A "Software Engineer" posting focused on maintaining existing systems is a different job than one focused on building new features from scratch, even with an identical job title.

Notice the language used to describe the team and company culture. Phrases like "fast-paced environment" or "wear multiple hats" usually signal a smaller company or startup-style structure. Phrases about "established processes" or "cross-functional collaboration" usually signal a larger, more structured organization. Neither is better — but knowing which environment you actually prefer helps you filter applications more effectively.

If a posting is vague or poorly written, do not assume the company itself is disorganized — smaller companies and growing teams in Bangladesh often write job postings quickly without a dedicated HR function. In these cases, it is worth applying anyway and using your cover letter or application message to ask a clarifying question about the role's actual day-to-day focus.`,
  },
  {
    title: 'How to Search and Apply for Jobs Effectively',
    category: 'job_search',
    excerpt:
      'Applying to a hundred jobs randomly is less effective than applying to twenty jobs strategically. Here is how to search with intent.',
    tags: 'JobSearch, Strategy',
    readingTimeMinutes: 6,
    content: `Job searching often turns into a numbers game — apply to as many postings as possible and hope something sticks. This approach is exhausting and usually produces a low response rate, because generic applications rarely stand out against candidates who tailored their approach.

Start by defining a narrow target instead of a broad one. Three or four job titles you are genuinely qualified for and interested in will produce better results than applying to every posting that vaguely matches your degree. A focused search also makes it realistic to actually tailor each application, which meaningfully increases response rates.

Use multiple channels, not just one job board. Company career pages, LinkedIn, referrals through seniors or faculty, and direct outreach to smaller companies that may not post formally are all valid channels — and in the Bangladeshi job market, referrals and direct networking often outperform cold applications through job boards, especially for smaller and mid-sized companies.

Track your applications in a simple spreadsheet: company, role, date applied, and status. This sounds unnecessary until you are applying to fifteen roles at once and cannot remember which companies you have already followed up with or which ones asked for additional materials.

Set a realistic weekly target rather than an all-or-nothing binge. Applying to four or five well-tailored roles per week, consistently, over two months produces better outcomes and less burnout than applying to fifty roles in one exhausted weekend and then going quiet for a month.

Finally, treat rejections and silence as data, not judgment. If you are consistently not hearing back at all, the issue is often the application materials or targeting, not your qualifications. If you are getting interviews but not offers, the issue is usually interview performance, not the application stage. Diagnosing which stage is actually failing tells you where to focus your improvement effort.`,
  },
  {
    title: 'Following Up After Applying: What Actually Works',
    category: 'job_search',
    excerpt:
      'Silence after applying does not always mean rejection. Here is how to follow up professionally without becoming a nuisance.',
    tags: 'JobSearch, Communication',
    readingTimeMinutes: 5,
    content: `Applying and then hearing nothing is one of the most frustrating parts of a job search, and many candidates either give up entirely or follow up so aggressively that it works against them. There is a middle path that is both professional and effective.

Give a reasonable amount of time before following up — generally one to two weeks after applying, unless the posting specifies an application deadline or review timeline. Following up within a day or two of applying signals impatience rather than genuine interest, and most companies simply have not finished reviewing applications yet.

When you do follow up, keep the message short and add value rather than just asking for status. A brief, polite email or message referencing the specific role, restating your interest in one sentence, and optionally mentioning one relevant update (a new project completed, a certification finished) gives the recruiter a reason to look at your application again, not just a reminder that you exist.

Use the channel that matches how you applied. If you applied through a formal portal, a short email to the listed HR contact is appropriate. If you were referred by someone at the company, a brief message to your referral asking if they have any visibility into the timeline is often more effective than contacting HR directly.

Accept that one follow-up is usually appropriate; two is sometimes reasonable if there was a specific reason to expect a response by a certain date; more than that starts to work against you. If you still hear nothing after a reasonable follow-up, treat it as a soft no and redirect your energy toward other applications rather than waiting indefinitely.

Silence is common in hiring processes everywhere, including in Bangladesh, and it rarely reflects anything specific about your qualifications — internal hiring timelines shift, headcount gets frozen, or a role gets filled internally. Do not over-interpret a lack of response as a verdict on your candidacy.`,
  },

  // --- Skills & Career Development (3) ---
  {
    title: 'Technical and Soft Skills Employers Look For in Fresh Graduates',
    category: 'skills_development',
    excerpt:
      'Technical ability gets you considered, but soft skills often determine who actually gets hired between similarly qualified candidates.',
    tags: 'Skills, FreshGraduate, Career',
    readingTimeMinutes: 7,
    content: `Employers hiring fresh graduates are rarely expecting deep expertise — they are evaluating whether you have a solid foundation and the right habits to grow quickly on the job. Understanding what they are actually screening for helps you prioritize your preparation time.

On the technical side, depth in one or two relevant skills is more valuable than shallow exposure to many. A CSE student who can genuinely build and explain a complete project using one backend stack is in a stronger position than one who has briefly touched five different frameworks without building anything substantial with any of them. For non-CSE disciplines, the same principle applies to core tools — genuine proficiency in the CAD, analysis, or simulation software relevant to your field matters more than a long list of half-familiar tools.

Communication skill is the most consistently cited soft skill across industries, and it means something more specific than "being good at talking." It means being able to explain a technical decision to someone outside your field, write a clear email, and summarize a complex problem concisely. This is a trainable skill — practice explaining your projects to a friend outside engineering and notice where they get confused.

Problem-solving under ambiguity matters more in real jobs than in coursework, where problems usually arrive with clear instructions. Employers value candidates who can take a vague, underspecified problem and figure out a reasonable first step, rather than waiting for complete instructions before starting.

Reliability is undervalued by students and overvalued by employers, in the sense that students rarely mention it as a strength while employers consistently rank it among the top reasons they keep or promote junior hires. Simply doing what you say you will do, by when you said you would do it, sets you apart more than most students realize.

Basic professional workplace habits — responding to messages in reasonable time, showing up prepared to meetings, taking feedback without defensiveness — are skills nobody explicitly teaches in university but are constantly evaluated from day one of any job.`,
  },
  {
    title: 'Professional Email Writing: A Practical Guide for Students',
    category: 'skills_development',
    excerpt:
      'Most students have never been taught how to write a professional email. Small habits here make a large difference in how you are perceived.',
    tags: 'Skills, Communication, Professional',
    readingTimeMinutes: 5,
    content: `University communication happens mostly through informal channels, which means many students enter the job market having never really practiced writing a professional email. This is a learnable skill, and getting it right early avoids awkward first impressions with recruiters and future colleagues.

Start with a clear, specific subject line. "Application for Software Engineer Role — [Your Name]" tells the recipient exactly what they are opening before they even read the body. A vague subject like "Hello" or "Regarding job" makes your email easy to overlook in a busy inbox.

Open with a proper greeting using the recipient's name if you know it, rather than a generic "To whom it may concern" when a name is available. If you genuinely do not know the recipient's name, "Dear Hiring Team" is an acceptable neutral alternative.

Keep the body focused and reasonably short. State your purpose in the first sentence or two — do not bury the actual request in the third paragraph. Recruiters and professionals scan emails quickly, and a message that takes too long to get to the point risks being set aside for later and forgotten.

Match your tone to the relationship. A first email to a recruiter you have never spoken with should be more formal than a follow-up email to someone who already interviewed you and was warm in conversation. Reading the existing tone of a conversation and matching it is a skill that develops with practice and attention.

Always end with a clear closing that states what you want to happen next, and sign off with your full name and relevant contact information. Proofread before sending — a rushed, typo-filled email undercuts an otherwise professional message, especially in early interactions where a recruiter has no other information about you yet.`,
  },
  {
    title: 'Building a Technical Skill Roadmap Without Getting Overwhelmed',
    category: 'skills_development',
    excerpt:
      'The number of tools and technologies to learn can feel infinite. Here is how to build a focused, realistic skill roadmap instead.',
    tags: 'Skills, CSE, Roadmap',
    readingTimeMinutes: 6,
    content: `It is easy to feel behind when scrolling through lists of technologies that "every developer should know." The truth is that most working engineers use a small, focused set of tools deeply rather than a huge list shallowly, and your learning roadmap should reflect that reality instead of chasing every trend.

Start by identifying the specific role you are targeting, not a generic "become a good engineer" goal. A backend-focused CSE student and a data-focused CSE student have meaningfully different roadmaps despite sharing a degree. Vague goals produce scattered, unfocused learning.

Once you have a target, identify the two or three core skills that show up consistently across job postings for that role, and commit to genuinely mastering those before branching out. A student who deeply understands one backend framework, one database, and basic system design concepts is better positioned than one who has sampled ten frameworks without building anything substantial with any of them.

Learn by building, not by only completing tutorials. Tutorials teach you to follow instructions; projects teach you to make decisions, debug real problems, and explain your choices — which is what interviews and actual jobs require. A single well-documented project you can discuss in depth is worth more than five tutorial completions you can barely remember.

Set a learning cadence you can actually sustain alongside coursework, rather than an intense but unsustainable pace that burns out after two weeks. Consistent, moderate effort over a full semester produces more durable skill than a frantic week of cramming before an application deadline.

Revisit your roadmap periodically and prune it. It is normal to start learning something and later realize it does not fit your direction — dropping it deliberately is a better use of time than continuing out of guilt for the hours already spent.`,
  },

  // --- Industry Insights (2) ---
  {
    title: 'Career Opportunities in Manufacturing for Engineering Graduates',
    category: 'industry_insights',
    excerpt:
      'Manufacturing remains one of the largest employers of engineering graduates in Bangladesh, offering a wider range of roles than most students realize.',
    tags: 'Industry, Mechanical, IPE, Chemical, Manufacturing',
    readingTimeMinutes: 7,
    content: `Manufacturing is often underrated by engineering students who default toward software or consulting roles, but it remains one of the largest and most stable employers of engineering talent in Bangladesh, spanning electronics, consumer goods, pharmaceuticals, textiles, and food production.

Production and process roles form the backbone of manufacturing hiring. These roles involve managing daily output, troubleshooting line issues, and improving efficiency — a strong fit for Mechanical, Industrial and Production, and Chemical Engineering graduates who enjoy hands-on, tangible problem solving rather than purely theoretical work.

Quality control and quality assurance roles have grown significantly as Bangladeshi manufacturers, particularly in pharmaceuticals and consumer goods, pursue international certification standards. These roles suit detail-oriented graduates who are comfortable with structured testing procedures, documentation, and regulatory compliance — often Chemical Engineering or Materials-focused graduates, though Mechanical and Industrial Engineering graduates fill these roles as well.

Supply chain and operations roles bridge manufacturing with business functions, covering procurement, inventory planning, and logistics coordination between production sites and distribution networks. This is a strong path for engineering graduates who enjoy analytical work but want more exposure to business decision-making than a pure production role offers.

Increasingly, manufacturing companies also hire software and automation talent to support ERP systems, IoT-connected equipment, and internal tooling — meaning CSE and EEE graduates have a growing, though less traditional, entry point into this sector as well.

Compensation and structure vary significantly by company size and sector, but larger manufacturing conglomerates in Bangladesh often offer more structured graduate training programs, clearer promotion paths, and better job security than smaller companies — a genuine advantage for fresh graduates who value stability and mentorship early in their career, even if the initial role feels less exciting than a trendier tech job.`,
  },
  {
    title: 'Understanding Careers in Fintech and Digital Financial Services',
    category: 'industry_insights',
    excerpt:
      'Fintech has become one of the fastest-growing sectors in Bangladesh, creating roles that blend technology, finance, and product thinking.',
    tags: 'Industry, Fintech, CSE, Business',
    readingTimeMinutes: 6,
    content: `Bangladesh's mobile financial services sector has grown rapidly over the past decade, creating a distinct category of jobs that sit at the intersection of technology, finance, and large-scale consumer products. Understanding how this sector actually works helps students evaluate whether it fits their interests.

Engineering roles in fintech tend to demand higher reliability standards than typical consumer software, because these systems move real money at massive transaction volumes. Backend and infrastructure roles focus heavily on security, transaction integrity, and system uptime — appealing to CSE graduates who want technically demanding work with clear, measurable stakes.

Data and analytics roles are core to fintech, not peripheral. Fraud detection, credit risk assessment, and usage pattern analysis all rely on data teams working closely with both engineering and business stakeholders. This makes fintech an attractive destination for statistically-minded graduates from CSE, EEE, or even Business backgrounds with strong quantitative skills.

Product and business analyst roles in fintech require a mix of financial literacy and technical fluency, since teams need people who can translate between regulatory requirements, customer needs, and what engineering can realistically build. This is a strong path for Business graduates who also invest time in building comfort with technical concepts.

Regulatory and compliance considerations shape fintech more than most other tech sectors, since these companies operate under central bank oversight. This creates a genuine niche for graduates interested in risk, compliance, or policy-adjacent roles within a technology company, which is a less obvious but real career path in this sector.

Overall, fintech in Bangladesh offers strong learning density for early-career professionals — the pace, the stakes, and the scale mean fresh graduates are often exposed to production-critical systems faster than they would be in a slower-moving traditional company.`,
  },

  // --- Career Stories (1) ---
  {
    title: 'From Mechanical Engineering to Supply Chain: One Graduate\'s Career Shift',
    category: 'career_stories',
    excerpt:
      'Not every engineering graduate ends up in a role that matches their department. Here is a common, realistic pattern worth understanding.',
    tags: 'CareerStories, Mechanical, SupplyChain',
    readingTimeMinutes: 5,
    content: `A common but rarely discussed career pattern among engineering graduates is the shift from a core technical discipline into an adjacent business function — most visibly, Mechanical and Industrial Engineering graduates moving into supply chain and operations roles a few years into their career.

This shift usually is not a rejection of engineering itself. It typically starts with a graduate taking a production or process engineering role straight out of university, spending one to three years learning how manufacturing actually operates on the ground, and gradually discovering that they are more drawn to the planning, coordination, and analytical decision-making side of the business than the hands-on technical execution side.

The transition is rarely abrupt. It often begins with a production engineer taking on informal responsibility for coordinating with suppliers or planning material flow because someone needed to do it, discovering they were good at it and genuinely enjoyed the work, and then deliberately pursuing a formal move into a supply chain or operations role — sometimes at the same company, sometimes by moving to a new one that explicitly hires for that function.

What makes this transition realistic, rather than a risky leap, is that the engineering background remains a genuine asset rather than dead weight. A supply chain analyst who deeply understands production constraints, material properties, and manufacturing timelines from direct hands-on experience brings a level of grounded judgment that someone without that technical background often lacks.

The practical lesson for current students is not that everyone should plan this exact path, but that a core engineering role early in your career is rarely a permanent cage. Skills and interests discovered on the job are legitimate data for redirecting your career, and many of the most interesting career paths in Bangladesh's engineering and business landscape are exactly this kind of gradual, experience-driven pivot rather than a decision made all at once during university.`,
  },
];
