export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  { path: '/welcome', icon: 'smile', component: './Welcome', name: '欢迎页' },
  {
    path: '/admin',
    icon: 'crown',
    name: '管理页',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user' },
      { icon: 'table', path: '/admin/user', component: './Admin/User', name: '用户管理' },
      { icon: 'table', path: '/admin/category', component: './Admin/Category', name: '分类管理' },
      {
        icon: 'crown', path: '/admin/english', name: '英语管理', access: 'canAdmin', routes: [
          { icon: 'table', path: '/admin/english/dictionary', component: './Admin/English/Dictionary', name: '词典管理' },
          { icon: 'table', path: '/admin/english/word', component: './Admin/English/Word', name: '单词管理' },
          { icon: 'table', path: '/admin/english/word-status', component: './Admin/English/WordStatus', name: '单词状态变更统计' },
        ]
      },
      { icon: 'table', path: '/admin/audio', component: './Admin/Audio', name: '音频管理' },
      { icon: 'table', path: '/admin/media-creator', component: './Admin/MediaCreator', name: 'AI媒体创作中心' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
