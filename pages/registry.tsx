import { PageCard } from '../components/elements/cards'
import i18n from '@i18n'
import { When } from 'react-if'
import styled from 'styled-components'

const PageView = () => {
  const lang = i18n.language

  return (
    <PageCard>
      <>
        <When condition={!lang || lang === 'es' || lang === 'ca'}>
          <h3>Registro de Actividad</h3>
          <RegistryWrapper>
            <table>
              <tbody>
                <tr>
                  <td>Base jurídica</td>
                  <td>
                    La base legal para el tratamiento de los datos es la
                    ejecución del contrato a que se refiere el artículo 6.1.b)
                    RGPD.
                    <br />
                    La base legal para el mantenimiento de relaciones
                    comerciales solicitantes del proceso de votación es el
                    interés legítimo de Aragon a que se refiere el artículo
                    6.1.f) RGPD.
                    <br />
                    La base legal para el tratamiento en relación con envío de
                    información, publicidad, suscripción a boletín de noticias y
                    la asistencia por Aragon, es el consentimiento a que se
                    refiere el artículo 6.1.a) RGPD, y el artículo 7 RGPD.
                  </td>
                </tr>
                <tr>
                  <td>Finalidad del tratamiento</td>
                  <td>
                    La debida prestación de los servicios de votación
                    electrónica, el mantenimiento de relaciones comerciales, así
                    como el envío de información, la asistencia, y publicidad.
                  </td>
                </tr>
                <tr>
                  <td>Categorías de interesados</td>
                  <td>
                    Solicitantes del servicio de votación de Aragon , y
                    entidades que deseen relacionarse.
                  </td>
                </tr>
                <tr>
                  <td>Categorías de datos personales</td>
                  <td>
                    <p>
                      Para la prestación del servicio de votación, nombre y
                      apellidos de la persona de contacto, cargo, correo
                      electrónico corporativo y teléfono de contacto
                      corporativo.{' '}
                    </p>
                    <p>
                      Para atender consultas, envío de publicidad, y tramitar un
                      alta en los boletines informativos los usuarios deben
                      cumplimentar los siguientes campos: correo electrónico.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    Categorías de destinatarios a quienes se comunicaron o
                    comunicarán los datos personales
                  </td>
                  <td>
                    Con carácter general no se comunicarán los datos personales
                    a terceros. En algunos casos, podría ser necesario comunicar
                    la información que nos ha proporcionado a terceras partes
                    para poder prestarle el servicio que ha solicitado.
                  </td>
                </tr>

                <tr>
                  <td>
                    {' '}
                    Transferencias de datos personales a un tercer país o una
                    organización internacional
                  </td>
                  <td>
                    {' '}
                    No están previstas transferencias internacionales de los
                    datos.
                  </td>
                </tr>
                <tr>
                  <td>
                    {' '}
                    Plazos previstos para la supresión de las diferentes
                    categorías de datos{' '}
                  </td>
                  <td>
                    {' '}
                    Los datos personales correspondientes a la prestación de los
                    servicios de votación se conservarán durante el tiempo
                    mínimo imprescindible para el proceso técnico de
                    participación. Los datos personales correspondientes al
                    aviso informativo sobre el inicio de sondeo electoral por
                    internet se conservarán únicamente durante el día de
                    realización de la prueba.{' '}
                  </td>
                </tr>
                <tr>
                  <td> Medidas de seguridad </td>
                  <td>
                    {' '}
                    Las medidas de seguridad implantadas se encuentran descritas
                    en los documentos que conforman la documentación de Política
                    de Seguridad de Aragon en relación al concreto servicio.{' '}
                  </td>
                </tr>
                <tr>
                  <td> Entidad responsable </td>
                  <td> Aragon. </td>
                </tr>
              </tbody>
            </table>
          </RegistryWrapper>
        </When>

        <When condition={lang === 'en'}>
          <RegistryWrapper>
            <h3>Activity Register</h3>
            <table>
              <tbody>
                <tr>
                  <td>Legal</td>
                  <td>
                  The legal basis for data processing is the execution of the contract referred to in article 6.1.b) GDPR.

                    <br />
                    The legal basis for maintaining business relationships requesting the voting process is the legitimate interest of Aragon referred to in article 6.1.f) GDPR.
                    <br />
                    The legal basis for the treatment in relation to sending information, advertising, subscription to newsletter and assistance by Aragon, is the consent referred to in article 6.1.a) GDPR, and article 7 GDPR.
                  </td>
                </tr>
                <tr>
                  <td>Purpose of the treatment</td>
                  <td>The due provision of electronic voting services, the maintenance of commercial relations, as well as the sending of information, assistance, and publicity. </td>
                </tr>
                <tr>
                  <td>Categories of interested parties </td>
                  <td>Applicants for the Aragon voting service, and entities that wish to be related.</td>
                </tr>
                <tr>
                  <td>Categories of personal data </td>
                  <td>
                    <p> For the provision of the voting service, name and surname of the contact person, position, corporate email and corporate contact telephone number.
To attend inquiries, send advertising, and process a registration in the newsletters, users must fill in the following fields: email.
{' '}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                  Categories of recipients to whom the personal data was communicated or will be communicated
                  </td>
                  <td>
                  In general personal data will not be communicated to third parties. In some cases, it may be necessary to communicate the information you have provided to third parties in order to provide you with the service you have requested.
                  </td>
                </tr>

                <tr>
                  <td>
                    {' '}
                    Transfers of personal data to a third country or an international organization Internationa
                  </td>
                  <td>
                    {' '}
                    Data transfers are not foreseen.
                  </td>
                </tr>
                <tr>
                  <td>
                    {' '}
                    Deadlines for the deletion of the different categories of data {' '}
                  </td>
                  <td>
                    {' '} The personal data corresponding to the provision of voting services will be kept for the minimum time necessary for the technical participation process. The personal data corresponding to the information notice on the start of the electoral poll online will be kept only during the day of the test.{' '}
                  </td>
                </tr>
                <tr>
                  <td> Security Measures </td>
                  <td>
                    {' '}
                    Themeasures implemented are described in the documents that make up the Aragon Security Policy documentation in relation to the specific service.{' '}
                  </td>
                </tr>
                <tr>
                  <td> Responsible entity </td>
                  <td> Aragon. </td>
                </tr>
              </tbody>
            </table>
          </RegistryWrapper>
        </When>
      </>
    </PageCard>
  )
}

const RegistryWrapper = styled.div`
  & > table > tbody > tr > td {
    padding: 10px;
    border: solid 3px ${({ theme }) => theme.lightBorder};
  }

  & > table > tbody > tr > td:first-child {
    font-weight: bold;
  }
`

export default PageView
