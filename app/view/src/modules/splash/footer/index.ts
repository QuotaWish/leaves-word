import { useGlobalSplashState } from '..'
import LogoSvg from '/logo.svg'

export const navs = reactive([
  {
    name: '探索',
    icon: 'i-carbon-explore',
    path: '/explore',
    // svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke-dasharray="44" stroke-dashoffset="44" stroke-width="2" d="M6 14L17 3L21 7L10 18L6 14Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="44;0"/></path><path fill="currentColor" fill-opacity="0" stroke-dasharray="20" stroke-dashoffset="20" d="M9 17L6.5 19.5H2.5L7 15Z"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="16;0"/><animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.15s" values="0;0.3"/></path></g></svg>',
  },
  {
    name: '计划',
    icon: LogoSvg,
    path: '/',
    // svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" fill-opacity="0" d="M6 8L12 3L18 8V20H16V13L15 12H9L8 13V20H6V8Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.9s" dur="0.15s" values="0;0.3"/></path><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="21" stroke-dashoffset="21" d="M5 21H19"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="21;0"/></path><path stroke-dasharray="15" stroke-dashoffset="15" d="M5 21V8M19 21V8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="15;0"/></path><path stroke-dasharray="24" stroke-dashoffset="24" d="M9 21V13H15V21"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="24;0"/></path><path stroke-dasharray="26" stroke-dashoffset="26" d="M2 10L12 2L22 10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.4s" values="26;0"/></path></g></svg>',
  },
  {
    name: '我的',
    icon: 'i-carbon:user-avatar-filled-alt',
    path: '/personal',
    // svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-dasharray="28" stroke-dashoffset="28" stroke-linecap="round" stroke-width="2"><path d="M4 21V20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="28;0"/></path><path d="M12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7C16 9.20914 14.2091 11 12 11Z"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.4s" values="28;0"/></path></g></svg>',
  },
])

export function useFooterNav() {
  const route = useRoute()

  const globalSplashState = useGlobalSplashState()
  const activeNav = computed(() => navs.find(item => item.path === route?.path))

  return {
    activeNav,
    active: computed(() => globalSplashState.footerVisible.value && activeNav.value),
    navs,
  }
}
