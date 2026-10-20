// Everything the home page says lives here, so edits never touch markup.

export const hero = {
  name: 'Jonathan Jayes',
  role: 'Data scientist at Nexer Insight',
  line: 'PhD in economic history from Lund University. I turn messy text into data that can answer a question.'
};

export const bio = [
  "I'm a data scientist at Nexer Insight. Before that I spent four years on a PhD in economic history at Lund University, looking at how electrification shaped careers and labour markets in early twentieth-century Sweden.",
  'The thread running through both is text as data. Biographical dictionaries, census returns, company reports and patent records all hold answers, if you can get them out of the PDF and into a table. These days that usually means a language model, a schema and a lot of checking.',
  'I grew up in South Africa and studied economics at the University of Cape Town and Stellenbosch University before moving to Sweden.'
];

export const quote = {
  text: "I enjoy some of the old and I enjoy the new. And if I can find a balance between it, that's where I find my satisfaction.",
  who: 'Anderson .Paak',
  source: 'The Dreamer',
  href: 'https://www.youtube.com/watch?v=Jv95aptVSUk'
};

export interface Role {
  org: string;
  href: string;
  title: string;
  when: string;
}

export const experience: Role[] = [
  { org: 'Nexer Insight', href: 'https://nexergroup.com/', title: 'Data Scientist', when: '2025 – now' },
  { org: 'Codera Analytics', href: 'https://www.linkedin.com/company/coderaanalytics/', title: 'Data Scientist', when: '2022 – 2025' },
  { org: 'Fathom Data', href: 'https://www.linkedin.com/company/fathomdata/', title: 'Data Science Intern', when: '2022' },
  { org: "Laboratory for the Economics of Africa's Past", href: 'https://www.leapecon.org/', title: 'Researcher with Prof. Johan Fourie', when: '2020 – 2021' },
  { org: 'FTI Consulting', href: 'https://www.fticonsulting.com/', title: 'Junior Economist', when: '2019 – 2020' }
];

export interface Degree {
  school: string;
  degree: string;
  when: string;
  note?: string;
}

export const education: Degree[] = [
  { school: 'Lund University', degree: 'PhD, Economic History', when: '2021 – 2025', note: 'Supervised by Prof. Kerstin Enflo' },
  { school: 'Stellenbosch University', degree: "Master's, Economics", when: '2020', note: 'Cum laude' },
  { school: 'University of Cape Town', degree: 'Honours, Economics', when: '2018' },
  { school: 'University of Cape Town', degree: "Bachelor's, Economics and Economic History", when: '2015 – 2017' }
];
