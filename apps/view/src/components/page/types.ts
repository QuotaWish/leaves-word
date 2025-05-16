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
   * Force enable adapt mode to simulate BUILDER display mode.
   */
  adapt?: boolean;
}

export interface IRoutePageProps extends IWIthPageProps {
  empty?: boolean;
  loading?: boolean;
  loadingMask?: boolean;
  innerClass?: string;
  enablePullRefresh?: boolean;

  onrefresh?: (done: IRefreshDone) => void;
}

export type IRefreshDone = () => void

export interface IRoutePageEmits {
  // (e: 'refresh', done: IRefreshDone): void
}

export interface IPageNavHolderProps extends IRoutePageProps {
  title: string;
  navColor?: string;
  headColor?: string;
  header?: boolean;
  contentPadding?: boolean;
  /**
   * 沉浸模式
   * 启用之后，会加入自定义标题，整体会更加沉浸
   */
  immersive?: boolean;
}

export interface IPageNavHolderEmits extends IRoutePageEmits {

}

export interface ISideNavHolderProps extends IPageNavHolderProps {

}

export interface ISideNavHolderEmits extends IPageNavHolderEmits {

}