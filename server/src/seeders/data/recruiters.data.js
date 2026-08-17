// Demo/dev recruiter seed data. One recruiter account per company, matching
// the existing 1-recruiter-per-company convention (Recruiter A / Test Company A).
// `companyName` must match an existing Company.name exactly (seeded by
// seedCompanies.js) — the recruiter seed looks the company up, it never
// creates one. `status` drives RecruiterProfile.isVerified plus, for
// 'rejected', whether the account is also deactivated (mirrors how the real
// admin-reject flow behaves today: reject == unverified, there is no
// separate rejected flag on the schema).
export const recruiters = [
  // --- Verified recruiters for companies that already have job postings ---
  { fullName: 'Farhan Ahmed', email: 'recruiter.bkash@example.com', companyName: 'bKash', designation: 'Talent Acquisition Lead', phone: '+8801711000101', status: 'verified' },
  { fullName: 'Nusrat Jahan', email: 'recruiter.grameenphone@example.com', companyName: 'Grameenphone', designation: 'HR Business Partner', phone: '+8801711000102', status: 'verified' },
  { fullName: 'Tanvir Hasan', email: 'recruiter.robiaxiata@example.com', companyName: 'Robi Axiata', designation: 'Talent Acquisition Manager', phone: '+8801711000103', status: 'verified' },
  { fullName: 'Sabrina Islam', email: 'recruiter.banglalink@example.com', companyName: 'Banglalink', designation: 'Recruitment Specialist', phone: '+8801711000104', status: 'verified' },
  { fullName: 'Rafiul Karim', email: 'recruiter.daraz@example.com', companyName: 'Daraz Bangladesh', designation: 'Talent Acquisition Partner', phone: '+8801711000105', status: 'verified' },
  { fullName: 'Mehjabin Chowdhury', email: 'recruiter.pathao@example.com', companyName: 'Pathao', designation: 'People Operations Lead', phone: '+8801711000106', status: 'verified' },
  { fullName: 'Imran Kabir', email: 'recruiter.brainstation23@example.com', companyName: 'Brain Station 23', designation: 'HR Manager', phone: '+8801711000107', status: 'verified' },
  { fullName: 'Farzana Yesmin', email: 'recruiter.enosis@example.com', companyName: 'Enosis Solutions', designation: 'Talent Acquisition Executive', phone: '+8801711000108', status: 'verified' },
  { fullName: 'Shakil Ahmed', email: 'recruiter.bjit@example.com', companyName: 'BJIT Group', designation: 'HR Executive', phone: '+8801711000109', status: 'verified' },
  { fullName: 'Rumana Akter', email: 'recruiter.tigerit@example.com', companyName: 'TigerIT', designation: 'HR & Admin Manager', phone: '+8801711000110', status: 'verified' },
  { fullName: 'Ashraful Islam', email: 'recruiter.datasoft@example.com', companyName: 'DataSoft Systems', designation: 'Recruitment Officer', phone: '+8801711000111', status: 'verified' },
  { fullName: 'Nabila Haque', email: 'recruiter.therap@example.com', companyName: 'Therap (BD)', designation: 'Talent Acquisition Lead', phone: '+8801711000112', status: 'verified' },
  { fullName: 'Zahid Hasan', email: 'recruiter.augmedix@example.com', companyName: 'Augmedix Bangladesh', designation: 'HR Business Partner', phone: '+8801711000113', status: 'verified' },
  { fullName: 'Tania Sultana', email: 'recruiter.walton@example.com', companyName: 'Walton', designation: 'Senior HR Executive', phone: '+8801711000114', status: 'verified' },
  { fullName: 'Kamrul Hasan', email: 'recruiter.pranrfl@example.com', companyName: 'PRAN-RFL Group', designation: 'Group HR Manager', phone: '+8801711000115', status: 'verified' },
  { fullName: 'Rezwana Karim', email: 'recruiter.squaregroup@example.com', companyName: 'Square Group', designation: 'Talent Acquisition Manager', phone: '+8801711000116', status: 'verified' },
  { fullName: 'Mahfuzur Rahman', email: 'recruiter.aci@example.com', companyName: 'ACI Limited', designation: 'HR Manager', phone: '+8801711000117', status: 'verified' },
  { fullName: 'Priya Sharma', email: 'recruiter.google@example.com', companyName: 'Google', designation: 'University Recruiter', phone: '+8801711000118', status: 'verified' },
  { fullName: 'James Whitfield', email: 'recruiter.microsoft@example.com', companyName: 'Microsoft', designation: 'Talent Acquisition Partner', phone: '+8801711000119', status: 'verified' },
  { fullName: 'Laura Bennett', email: 'recruiter.amazon@example.com', companyName: 'Amazon', designation: 'Technical Recruiter', phone: '+8801711000120', status: 'verified' },
  { fullName: 'Daniel Osei', email: 'recruiter.meta@example.com', companyName: 'Meta', designation: 'University Recruiting Lead', phone: '+8801711000121', status: 'verified' },
  { fullName: 'Emily Carter', email: 'recruiter.adobe@example.com', companyName: 'Adobe', designation: 'Talent Acquisition Manager', phone: '+8801711000122', status: 'verified' },
  { fullName: 'Rashedul Islam', email: 'recruiter.accenture@example.com', companyName: 'Accenture', designation: 'Recruitment Lead', phone: '+8801711000123', status: 'verified' },
  { fullName: 'Sophia Martinez', email: 'recruiter.deloitte@example.com', companyName: 'Deloitte', designation: 'Campus Recruiting Manager', phone: '+8801711000124', status: 'verified' },
  { fullName: 'Michael Grant', email: 'recruiter.pwc@example.com', companyName: 'PwC', designation: 'Talent Acquisition Lead', phone: '+8801711000125', status: 'verified' },
  { fullName: 'Shirin Akter', email: 'recruiter.brac@example.com', companyName: 'BRAC', designation: 'HR & Recruitment Officer', phone: '+8801711000126', status: 'verified' },

  // --- Pending recruiters (companies without job postings yet) ---
  { fullName: 'Nayeem Hossain', email: 'recruiter.chaldal@example.com', companyName: 'Chaldal', designation: 'HR Executive', phone: '+8801711000127', status: 'pending' },
  { fullName: 'Farida Yasmin', email: 'recruiter.evaly@example.com', companyName: 'Evaly', designation: 'Talent Acquisition Executive', phone: '+8801711000128', status: 'pending' },

  // --- Rejected recruiter (unverified, account deactivated) ---
  { fullName: 'Rakibul Islam', email: 'recruiter.unverified@example.com', companyName: 'IBM', designation: 'HR Coordinator', phone: '+8801711000129', status: 'rejected' },
];
