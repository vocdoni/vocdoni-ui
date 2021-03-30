import i18n from '../i18n'

const ErrorPage = (props: { message?: string }) => (
  <div>{(props && props.message) || i18n.t('errors.generalErrorMessage')}</div>
)

export default ErrorPage
