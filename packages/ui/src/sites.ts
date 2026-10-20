export type SiteKey = 'home' | 'blog' | 'talks' | 'projects' | 'recipes' | 'insta';

export interface Site {
  key: SiteKey;
  label: string;
  url: string;
  blurb: string;
}

export const sites: Site[] = [
  { key: 'home', label: 'Home', url: 'https://jonathanjayes.com', blurb: 'Who I am and what I work on.' },
  { key: 'blog', label: 'Blog', url: 'https://blog.jonathanjayes.com', blurb: 'Posts on data, economic history and the odd scraping project, going back to 2021.' },
  { key: 'talks', label: 'Talks', url: 'https://talks.jonathanjayes.com', blurb: 'Slides from talks, seminars and workshops, plus course material from teaching.' },
  { key: 'projects', label: 'Projects', url: 'https://projects.jonathanjayes.com', blurb: 'Scrollytelling pieces, websites and tools, each with a link to the code.' },
  { key: 'recipes', label: 'Recipes', url: 'https://recipes.jonathanjayes.com', blurb: 'My personal cookbook. Mostly things I make more than once.' },
  { key: 'insta', label: 'Insta', url: 'https://insta.jonathanjayes.com', blurb: 'The latest photos from Instagram, for fun.' }
];

export const links = {
  github: 'https://github.com/j-jayes',
  linkedin: 'https://www.linkedin.com/in/jonathanjayes/',
  email: 'mailto:j0nathanjayes@gmail.com'
};
