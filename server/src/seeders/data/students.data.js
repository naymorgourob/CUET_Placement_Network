// Demo/dev student seed data. Realistic Bangladeshi names spread across real
// CUET departments/batches. `department` and `skills` are free-text fields
// on StudentProfile (no enum in the schema), so any reasonable value is
// valid — these use the actual CUET department short codes.
export const students = [
  { fullName: 'Md. Tanvir Ahmed', email: 'tanvir.ahmed24@example.com', department: 'CSE', batchYear: 2021, cgpa: 3.72, phone: '+8801811100201', skills: 'JavaScript, React, Node.js, MySQL, Git' },
  { fullName: 'Nusrat Jahan Mim', email: 'nusrat.mim24@example.com', department: 'CSE', batchYear: 2021, cgpa: 3.85, phone: '+8801811100202', skills: 'Python, Django, PostgreSQL, Docker, REST API' },
  { fullName: 'Rakib Hasan', email: 'rakib.hasan24@example.com', department: 'CSE', batchYear: 2020, cgpa: 3.45, phone: '+8801811100203', skills: 'Java, Spring Boot, MySQL, System Design' },
  { fullName: 'Sadia Afrin', email: 'sadia.afrin24@example.com', department: 'CSE', batchYear: 2022, cgpa: 3.91, phone: '+8801811100204', skills: 'C++, Data Structures, Algorithms, Competitive Programming' },
  { fullName: 'Mahmudul Hasan Shovon', email: 'mahmudul.shovon24@example.com', department: 'CSE', batchYear: 2020, cgpa: 3.30, phone: '+8801811100205', skills: 'React, TypeScript, TailwindCSS, Figma' },
  { fullName: 'Farhana Yesmin', email: 'farhana.yesmin24@example.com', department: 'CSE', batchYear: 2021, cgpa: 3.68, phone: '+8801811100206', skills: 'Python, Pandas, Scikit-learn, SQL, Power BI' },
  { fullName: 'Imtiaz Uddin', email: 'imtiaz.uddin24@example.com', department: 'CSE', batchYear: 2022, cgpa: 3.55, phone: '+8801811100207', skills: 'AWS, Docker, Kubernetes, CI/CD, Linux' },
  { fullName: 'Tasnim Rahman', email: 'tasnim.rahman24@example.com', department: 'CSE', batchYear: 2021, cgpa: 3.60, phone: '+8801811100208', skills: 'Penetration Testing, Networking, Python, Linux' },
  { fullName: 'Ashiqur Rahman Nabil', email: 'ashiqur.nabil24@example.com', department: 'EEE', batchYear: 2021, cgpa: 3.40, phone: '+8801811100209', skills: 'Embedded Systems, C, PCB Design, MATLAB' },
  { fullName: 'Sumaiya Kabir', email: 'sumaiya.kabir24@example.com', department: 'EEE', batchYear: 2020, cgpa: 3.52, phone: '+8801811100210', skills: 'Power Systems, AutoCAD, MATLAB, Circuit Design' },
  { fullName: 'Mehedi Hasan Rafi', email: 'mehedi.rafi24@example.com', department: 'EEE', batchYear: 2022, cgpa: 3.35, phone: '+8801811100211', skills: 'VLSI Design, Verilog, Signal Processing' },
  { fullName: 'Jannatul Ferdous', email: 'jannatul.ferdous24@example.com', department: 'EEE', batchYear: 2021, cgpa: 3.78, phone: '+8801811100212', skills: 'Renewable Energy, MATLAB, Power Electronics' },
  { fullName: 'Rezaul Karim Fahim', email: 'rezaul.fahim24@example.com', department: 'ME', batchYear: 2020, cgpa: 3.25, phone: '+8801811100213', skills: 'SolidWorks, AutoCAD, Thermodynamics, GD&T' },
  { fullName: 'Afsana Mimi', email: 'afsana.mimi24@example.com', department: 'ME', batchYear: 2021, cgpa: 3.48, phone: '+8801811100214', skills: 'ANSYS, SolidWorks, Manufacturing Processes' },
  { fullName: 'Shahriar Kabir Adnan', email: 'shahriar.adnan24@example.com', department: 'ME', batchYear: 2022, cgpa: 3.15, phone: '+8801811100215', skills: 'CAD, HVAC Design, Project Planning' },
  { fullName: 'Tania Islam Trisha', email: 'tania.trisha24@example.com', department: 'CE', batchYear: 2020, cgpa: 3.58, phone: '+8801811100216', skills: 'AutoCAD, STAAD Pro, Structural Analysis, Estimation' },
  { fullName: 'Nayeem Islam Rifat', email: 'nayeem.rifat24@example.com', department: 'CE', batchYear: 2021, cgpa: 3.20, phone: '+8801811100217', skills: 'Site Supervision, AutoCAD, Surveying' },
  { fullName: 'Fahmida Akter Nodi', email: 'fahmida.nodi24@example.com', department: 'CE', batchYear: 2022, cgpa: 3.66, phone: '+8801811100218', skills: 'ETABS, AutoCAD, Structural Design, Estimation' },
  { fullName: 'Kazi Rakibul Islam', email: 'kazi.rakibul24@example.com', department: 'ETE', batchYear: 2021, cgpa: 3.42, phone: '+8801811100219', skills: 'Networking, Telecommunications, Python, Linux' },
  { fullName: 'Samia Rahman Oishi', email: 'samia.oishi24@example.com', department: 'ETE', batchYear: 2020, cgpa: 3.33, phone: '+8801811100220', skills: 'Signal Processing, MATLAB, Embedded C' },
  { fullName: 'Arafat Hossain Shanto', email: 'arafat.shanto24@example.com', department: 'Architecture', batchYear: 2021, cgpa: 3.62, phone: '+8801811100221', skills: 'AutoCAD, SketchUp, Revit, 3ds Max' },
  { fullName: 'Nazifa Tabassum', email: 'nazifa.tabassum24@example.com', department: 'Architecture', batchYear: 2022, cgpa: 3.70, phone: '+8801811100222', skills: 'Revit, Lumion, Adobe Photoshop, Model Making' },
  { fullName: 'Sifat Ullah Rifat', email: 'sifat.rifat24@example.com', department: 'BME', batchYear: 2021, cgpa: 3.38, phone: '+8801811100223', skills: 'Biomedical Instrumentation, MATLAB, Signal Processing' },
  { fullName: 'Ruma Akter Nishat', email: 'ruma.nishat24@example.com', department: 'BME', batchYear: 2020, cgpa: 3.55, phone: '+8801811100224', skills: 'Medical Imaging, Python, Data Analysis' },
  { fullName: 'Golam Mostofa Rayhan', email: 'golam.rayhan24@example.com', department: 'URP', batchYear: 2021, cgpa: 3.28, phone: '+8801811100225', skills: 'GIS, AutoCAD, Urban Planning, QGIS' },
  { fullName: 'Israt Jahan Priya', email: 'israt.priya24@example.com', department: 'CSE', batchYear: 2022, cgpa: 3.80, phone: '+8801811100226', skills: 'Flutter, Firebase, Dart, UI/UX Design' },
  { fullName: 'Mohaimenul Islam Shuvo', email: 'mohaimenul.shuvo24@example.com', department: 'CSE', batchYear: 2020, cgpa: 3.10, phone: '+8801811100227', skills: 'Sales, Communication, MS Excel, Marketing' },
];
