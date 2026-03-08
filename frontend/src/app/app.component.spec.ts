import { describe, expect, it } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent (composant Angular)', () => {
  it('expose le composant racine', () => {
    const component = new AppComponent();
    expect(component).toBeInstanceOf(AppComponent);
  });

  it('declare un selector stable pour le shell', () => {
    const metadata = (AppComponent as any).ɵcmp;
    expect(metadata?.selectors?.[0]?.[0]).toBe('app-root');
  });
});
