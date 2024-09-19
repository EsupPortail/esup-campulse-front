/// <reference types="vite/client" />

declare module 'vue-matomo' {
  import {RouteLocationNormalized, Router} from 'vue-router'
  import {App} from 'vue'

  declare type DefaultOptions = {
    debug: boolean;
    disableCookies: boolean;
    enableHeartBeatTimer: boolean;
    enableLinkTracking: boolean;
    heartBeatTimerInterval: number;
    requireConsent: boolean;
    trackInitialView: boolean;
    trackerFileName: string;
    trackerUrl?: string;
    trackerScriptUrl?: string;
    userId?: string;
    cookieDomain?: string;
    domains?: string;
    preInitActions: string[][];
  }

  declare type MatomoSetupOptions = {
    host: string;
    siteId: number;
    router: Router;
    trackerFileName?: string;
    trackerUrl?: string;
    trackerScriptUrl?: string;
    enableLinkTracking?: boolean;
    requireConsent?: boolean;
    trackInitialView?: boolean;
    disableCookies?: boolean;
    enableHeartBeatTimer?: boolean;
    heartBeatTimerInterval?: number;
    debug?: boolean;
    domains?: string;
    preInitActions?: string[][];
  }

  interface MatomoTracker {
    setReferrerUrl(referrerUrl: string): void;
    setCustomUrl(url: string): void;
    trackPageView(title: string): void;
    enableLinkTracking(): void;
  }

  interface ImportMetaEnv {
    VITE_APP_OPEN_LDAP: boolean;
  }

  declare type MatomoOptions = DefaultOptions | MatomoSetupOptions;
  const defaultOptions: DefaultOptions
  const matomoKey: string

  function trackMatomoPageView(options: MatomoOptions,
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
  ): void | undefined;
  function initMatomo(Vue: App, options: MatomoOptions): void;
  function piwikExists(): Promise<void | never>;
  function install(Vue: App, setupOptions?: MatomoSetupOptions): void;
  function getMatomo(): MatomoTracker;
  function loadScript(trackerScript: string): Promise<void>;
  function getResolvedHref(router: Router, path: string): string;
}
