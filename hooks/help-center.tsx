const show = () => {
  window.Beacon('init', process.env.HELPSCOUT_PROJECT_ID)
}

const hide = () => {
  window.Beacon('destroy')
}

const open = () => {
  window.Beacon('open')
}

export function useHelpCenter() {
  return { show, hide, open}
}
