import { h } from 'vue'

export const TranslateIcon = {
  name: 'TranslateIcon',
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      style: { width: '1em', height: '1em' }
    }, [
      h('path', {
        d: 'M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.09C9.45 8.73 7.5 11.24 6.28 14.07l2.54 2.51A8.5 8.5 0 0112 18.5a8.5 8.5 0 01-3.18-1.92l-2.54-2.51a17.52 17.52 0 00-.03.03A17.52 17.52 0 006 22h3v2h2v-2h3a17.52 17.52 0 00-1.15-6.93z'
      })
    ])
  }
}