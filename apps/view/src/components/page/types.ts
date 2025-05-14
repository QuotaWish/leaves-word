import { deprecate } from 'util';
import { InjectionKey } from "vue";

export enum DrawerState {
  HIDE = 'hide',         // 完全隐藏
  VISIBLE = 'visible',   // 只显示小横条
  SHRINK = 'shrink',     // 显示约20%内容
  EXPAND = 'expand',     // 完全打开
  FULLSCREEN = 'fullscreen' // 铺满屏幕
}

export const DrawerControl: InjectionKey<{
  currentState: Ref<DrawerState>
  setState: (state: DrawerState) => void
  isExpanded: Ref<boolean>
  isHidden: Ref<boolean>
  toggleDrawer: () => void
  toggleFullscreen: () => void
  expand: () => void
  shrink: () => void
  collapse: () => void
  hide: () => void
  show: () => void
}> = Symbol('INNER_DRAWER_CONTROL')

export interface IWIthPageProps {
  /**
   * @deprecated non-use
   * Force enable adapt mode to simulate BUILDER display mode.
   */
  adapt?: boolean;
}

export interface IRoutePageProps extends IWIthPageProps {
  loading?: boolean;
  loadingMask?: boolean;
  innerClass?: string;
  refreshing?: boolean;
  enablePullRefresh?: boolean;
}

export interface IRoutePageEmits {
  (e: 'refresh'): void
  (e: 'update:refreshing', value: boolean): void
}