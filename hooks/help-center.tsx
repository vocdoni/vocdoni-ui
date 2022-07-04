let initialized = false;

export function useHelpCenter() {
  const show = () => {
    if (!initialized) {
      initialized = true
      //window.Beacon('init', process.env.HELPSCOUT_PROJECT_ID)
    }
  }

  const hide = () => {
    if (initialized) {
      //window.Beacon('destroy')
      initialized = false
    }
  }

  const open = () => {
    //window.Beacon('open')
  }

  return { show, hide, open }
}
