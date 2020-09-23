import * as $ from 'jquery'

function createAnalytics(): object {
  let counter = 0
  let isDestroyed: boolean = false

  const listener = (): number => counter++

  $(document).on('click', listener)

  return {
    destroy() {
      $(document).off('click', listener)
      isDestroyed = true
    },

    getClicks() {
      if(isDestroyed) {
        return 'Analytics was destroyed. Total clicks = ' + counter
      }
      return counter
    }
  }
}

window['analitycs'] = createAnalytics()