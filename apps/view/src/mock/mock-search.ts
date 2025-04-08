export interface SearchResult {
  type: 'word' | 'phrase' | 'sentence' | 'subtitle' | 'ai_explanation';
  content: string;
  translation?: string;
  pronunciation?: string;
  examples?: string[];
  aiAnalysis?: string;
  source?: string;
  tags?: string[];
}

export const mockSearchResults: SearchResult[] = [
  {
    type: 'word',
    content: 'innovation',
    translation: '创新；革新',
    pronunciation: '/ˌɪnəˈveɪʃn/',
    examples: [
      'Technological innovation drives progress.',
      'The company is known for its innovative solutions.'
    ],
    aiAnalysis: 'This word is frequently used in technology and business contexts. AI suggests related terms: breakthrough, advancement, pioneering.',
    tags: ['business', 'technology', 'trending']
  },
  {
    type: 'phrase',
    content: 'think outside the box',
    translation: '跳出思维定式；创新思考',
    examples: [
      'To solve this problem, we need to think outside the box.',
      'Creative solutions come from thinking outside the box.'
    ],
    aiAnalysis: 'This idiom emphasizes creative problem-solving. AI analysis shows it appears frequently in business and innovation contexts.',
    tags: ['idiom', 'business', 'creativity']
  },
  {
    type: 'sentence',
    content: 'The integration of AI in education has revolutionized the way we learn languages.',
    translation: '人工智能在教育领域的应用彻底改变了我们学习语言的方式。',
    aiAnalysis: 'This sentence demonstrates advanced vocabulary usage and complex sentence structure. Key themes: technology, education, change.',
    tags: ['education', 'AI', 'technology']
  },
  {
    type: 'subtitle',
    content: 'In this rapidly evolving digital landscape, adaptation is key to survival.',
    source: 'TED Talk: The Future of Learning',
    translation: '在这个快速发展的数字化环境中，适应能力是生存的关键。',
    aiAnalysis: 'Common context in technology documentaries. Shows formal language usage in professional settings.',
    tags: ['documentary', 'professional', 'technology']
  },
  {
    type: 'ai_explanation',
    content: 'AI Language Learning Tips',
    translation: 'AI语言学习技巧',
    aiAnalysis: 'Based on your learning pattern, focus on contextual learning and real-world applications. Consider: 1) Daily practice with AI conversations 2) Multimedia immersion 3) Pattern recognition in natural language',
    tags: ['learning', 'AI', 'tips']
  }
];
