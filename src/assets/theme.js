import Material from '@primeuix/themes/material';
import { definePreset } from '@primeuix/themes';

const RiskGuardTheme = definePreset(Material, {
  components: {
    tag: {
      colorScheme: {
        dark: {
          success:   { background: 'rgba(34,197,94,0.15)',   color: '#22C55E' },
          warn:      { background: 'rgba(239,97,15,0.15)',   color: '#EF610F' },
          danger:    { background: 'rgba(239,68,68,0.15)',   color: '#EF4444' },
          info:      { background: 'rgba(99,179,237,0.12)',  color: '#63B3ED' },
          secondary: { background: 'rgba(107,127,153,0.15)', color: '#6B7F99' },
        },
        light: {
          success:   { background: 'rgba(34,197,94,0.15)',   color: '#16a34a' },
          warn:      { background: 'rgba(239,97,15,0.15)',   color: '#EF610F' },
          danger:    { background: 'rgba(239,68,68,0.15)',   color: '#DC2626' },
          info:      { background: 'rgba(99,179,237,0.12)',  color: '#0284c7' },
          secondary: { background: 'rgba(107,127,153,0.15)', color: '#6B7F99' },
        }
      }
    },
    button: {
      colorScheme: {
        dark: {
          warning: { background: '#EF610F', hoverBackground: '#d9540c', borderColor: '#EF610F', hoverBorderColor: '#d9540c', color: '#fff' },
          success: { background: '#22C55E', hoverBackground: '#16a34a', borderColor: '#22C55E', hoverBorderColor: '#16a34a', color: '#fff' },
        }
      }
    },
    dialog: {
      colorScheme: {
        dark: {
          root:   { background: '#131c2e', borderColor: 'rgba(255,255,255,0.08)', color: '#EEF2FF' },
          header: { background: '#0c1829', color: '#EF610F' },
          footer: { background: '#0c1829' },
        }
      }
    }
  }
});

export default RiskGuardTheme;
