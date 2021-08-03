import { useTranslation } from "react-i18next"

const ErrorPage = (props: { message?: string }) => {
  const { i18n } = useTranslation()

  return (<div>{(props && props.message) || i18n.t('errors.general_error')}</div>)
}

export default ErrorPage
