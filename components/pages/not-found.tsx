import i18n from '../../i18n'

const NotFound = () => (
  <div>
    <h1>Vocdoni</h1>
    <p>{i18n.t('errors.page_not_found')}</p>
  </div>
)

export default NotFound
