/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/perfil`; params?: Router.UnknownInputParams; } | { pathname: `/recarga`; params?: Router.UnknownInputParams; } | { pathname: `/sucesso`; params?: Router.UnknownInputParams; } | { pathname: `/pagamento-pix`; params?: Router.UnknownInputParams; } | { pathname: `/../components/ui/collapsible`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/perfil`; params?: Router.UnknownOutputParams; } | { pathname: `/recarga`; params?: Router.UnknownOutputParams; } | { pathname: `/sucesso`; params?: Router.UnknownOutputParams; } | { pathname: `/pagamento-pix`; params?: Router.UnknownOutputParams; } | { pathname: `/../components/ui/collapsible`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/perfil${`?${string}` | `#${string}` | ''}` | `/recarga${`?${string}` | `#${string}` | ''}` | `/sucesso${`?${string}` | `#${string}` | ''}` | `/pagamento-pix${`?${string}` | `#${string}` | ''}` | `/../components/ui/collapsible${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/perfil`; params?: Router.UnknownInputParams; } | { pathname: `/recarga`; params?: Router.UnknownInputParams; } | { pathname: `/sucesso`; params?: Router.UnknownInputParams; } | { pathname: `/pagamento-pix`; params?: Router.UnknownInputParams; } | { pathname: `/../components/ui/collapsible`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
