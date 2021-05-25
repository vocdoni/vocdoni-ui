import { PageCard } from "../../components/cards"
import i18n from '@i18n';
import { When } from "react-if";

const PageView = () => {
  const lang = i18n.language

  return (
    <PageCard>
      <>
        <When condition={!lang || lang === 'es'}>
          <div>
            <table>
              <tbody>
                <tr>
                  <th>Base jurídica</th>
                  <td>
                    La base legal para el tratamiento de los datos es la ejecución del contrato a que se refiere el artículo 6.1.b) RGPD.<br/>
                    La base legal para el mantenimiento de relaciones comerciales solicitantes del proceso de votación es el interés legítimo de VOCDONI a que se refiere el artículo 6.1.f) RGPD.<br/>
                    La base legal para el tratamiento en relación con envío de información, publicidad, suscripción a boletín de noticias y la asistencia por VOCDONI, es el consentimiento a que se refiere el artículo 6.1.a) RGPD, y el artículo 7 RGPD.
                  </td>
                </tr>
                <tr>
                  <th>Finalidad del tratamiento</th>
                  <td>La debida prestación de los servicios de votación electrónica, el mantenimiento de relaciones comerciales, así como el envío de información, la asistencia, y publicidad.</td>
                </tr>
                <tr>
                  <th>Categorías de interesados</th>
                  <td>Solicitantes del servicio de votación de VOCDONI , y entidades que deseen relacionarse.</td>
                </tr>
                <tr>
                  <th>Categorías de datos personales</th>
                  <td>
                  <p>Para la prestación del servicio de votación, nombre y apellidos de la persona de contacto, cargo, correo electrónico corporativo y teléfono de contacto corporativo. </p>
                  <p>Para atender consultas, envío de publicidad, y tramitar un alta en los boletines informativos los usuarios deben cumplimentar los siguientes campos: correo electrónico.</p>
                  </td>
                </tr>
                <tr>
                  <th>Categorías de destinatarios a quienes se comunicaron o comunicarán los datos personales</th>
                  <td>Con carácter general no se comunicarán los datos personales a terceros. En algunos casos, podría ser necesario comunicar la información que nos ha proporcionado a terceras partes para poder prestarle el servicio que ha solicitado.</td>
                </tr>

                <tr>
                  <th> Transferencias de datos personales a un tercer país o una organización internacional</th>
                  <td> No están previstas	transferencias internacionales de los datos.</td>
                </tr>
                <tr>
                  <th> 			Plazos previstos para la 			supresión de las diferentes categorías de datos			 		</th>
                  <td> 			Los datos personales 			correspondientes a la prestación de los servicios de votación se 			conservarán durante el tiempo mínimo imprescindible para el 			proceso técnico de participación. Los datos personales 			correspondientes al aviso informativo sobre el inicio de sondeo 			electoral por internet se conservarán únicamente durante el día 			de realización de la prueba. 		</td>
                </tr>
                <tr>
                  <th> 			Medidas de seguridad 		</th>
                  <td> 			Las medidas de seguridad 			implantadas se encuentran descritas en los documentos que 			conforman la documentación de Política de Seguridad de Vocdoni 			en relación al concreto servicio. 		</td>
                </tr>
                <tr>
                  <th> 			Entidad responsable 		</th>
                  <td> 			VOCDONI 		</td>
                </tr>
              </tbody>
            </table>
          </div>
        </When>

        <When condition={lang === 'ca'}>
        <div>
            <table>
              <tbody>
                <tr>
                  <th>Base jurídica</th>
                  <td>
                    La base legal para el tratamiento de los datos es la ejecución del contrato a que se refiere el artículo 6.1.b) RGPD.<br/>
                    La base legal para el mantenimiento de relaciones comerciales solicitantes del proceso de votación es el interés legítimo de VOCDONI a que se refiere el artículo 6.1.f) RGPD.<br/>
                    La base legal para el tratamiento en relación con envío de información, publicidad, suscripción a boletín de noticias y la asistencia por VOCDONI, es el consentimiento a que se refiere el artículo 6.1.a) RGPD, y el artículo 7 RGPD.
                  </td>
                </tr>
                <tr>
                  <th>Finalidad del tratamiento</th>
                  <td>La debida prestación de los servicios de votación electrónica, el mantenimiento de relaciones comerciales, así como el envío de información, la asistencia, y publicidad.</td>
                </tr>
                <tr>
                  <th>Categorías de interesados</th>
                  <td>Solicitantes del servicio de votación de VOCDONI , y entidades que deseen relacionarse.</td>
                </tr>
                <tr>
                  <th>Categorías de datos personales</th>
                  <td>
                  <p>Para la prestación del servicio de votación, nombre y apellidos de la persona de contacto, cargo, correo electrónico corporativo y teléfono de contacto corporativo. </p>
                  <p>Para atender consultas, envío de publicidad, y tramitar un alta en los boletines informativos los usuarios deben cumplimentar los siguientes campos: correo electrónico.</p>
                  </td>
                </tr>
                <tr>
                  <th>Categorías de destinatarios a quienes se comunicaron o comunicarán los datos personales</th>
                  <td>Con carácter general no se comunicarán los datos personales a terceros. En algunos casos, podría ser necesario comunicar la información que nos ha proporcionado a terceras partes para poder prestarle el servicio que ha solicitado.</td>
                </tr>

                <tr>
                  <th> Transferencias de datos personales a un tercer país o una organización internacional</th>
                  <td> No están previstas	transferencias internacionales de los datos.</td>
                </tr>
                <tr>
                  <th> 			Plazos previstos para la 			supresión de las diferentes categorías de datos			 		</th>
                  <td> 			Los datos personales 			correspondientes a la prestación de los servicios de votación se 			conservarán durante el tiempo mínimo imprescindible para el 			proceso técnico de participación. Los datos personales 			correspondientes al aviso informativo sobre el inicio de sondeo 			electoral por internet se conservarán únicamente durante el día 			de realización de la prueba. 		</td>
                </tr>
                <tr>
                  <th> 			Medidas de seguridad 		</th>
                  <td> 			Las medidas de seguridad 			implantadas se encuentran descritas en los documentos que 			conforman la documentación de Política de Seguridad de Vocdoni 			en relación al concreto servicio. 		</td>
                </tr>
                <tr>
                  <th> 			Entidad responsable 		</th>
                  <td> 			VOCDONI 		</td>
                </tr>
              </tbody>
            </table>
          </div>
        </When>

        <When condition={lang === 'en'}>
        <div>
            <table>
              <tbody>
                <tr>
                  <th>Base jurídica</th>
                  <td>
                    La base legal para el tratamiento de los datos es la ejecución del contrato a que se refiere el artículo 6.1.b) RGPD.<br/>
                    La base legal para el mantenimiento de relaciones comerciales solicitantes del proceso de votación es el interés legítimo de VOCDONI a que se refiere el artículo 6.1.f) RGPD.<br/>
                    La base legal para el tratamiento en relación con envío de información, publicidad, suscripción a boletín de noticias y la asistencia por VOCDONI, es el consentimiento a que se refiere el artículo 6.1.a) RGPD, y el artículo 7 RGPD.
                  </td>
                </tr>
                <tr>
                  <th>Finalidad del tratamiento</th>
                  <td>La debida prestación de los servicios de votación electrónica, el mantenimiento de relaciones comerciales, así como el envío de información, la asistencia, y publicidad.</td>
                </tr>
                <tr>
                  <th>Categorías de interesados</th>
                  <td>Solicitantes del servicio de votación de VOCDONI , y entidades que deseen relacionarse.</td>
                </tr>
                <tr>
                  <th>Categorías de datos personales</th>
                  <td>
                  <p>Para la prestación del servicio de votación, nombre y apellidos de la persona de contacto, cargo, correo electrónico corporativo y teléfono de contacto corporativo. </p>
                  <p>Para atender consultas, envío de publicidad, y tramitar un alta en los boletines informativos los usuarios deben cumplimentar los siguientes campos: correo electrónico.</p>
                  </td>
                </tr>
                <tr>
                  <th>Categorías de destinatarios a quienes se comunicaron o comunicarán los datos personales</th>
                  <td>Con carácter general no se comunicarán los datos personales a terceros. En algunos casos, podría ser necesario comunicar la información que nos ha proporcionado a terceras partes para poder prestarle el servicio que ha solicitado.</td>
                </tr>

                <tr>
                  <th> Transferencias de datos personales a un tercer país o una organización internacional</th>
                  <td> No están previstas	transferencias internacionales de los datos.</td>
                </tr>
                <tr>
                  <th> 			Plazos previstos para la 			supresión de las diferentes categorías de datos			 		</th>
                  <td> 			Los datos personales 			correspondientes a la prestación de los servicios de votación se 			conservarán durante el tiempo mínimo imprescindible para el 			proceso técnico de participación. Los datos personales 			correspondientes al aviso informativo sobre el inicio de sondeo 			electoral por internet se conservarán únicamente durante el día 			de realización de la prueba. 		</td>
                </tr>
                <tr>
                  <th> 			Medidas de seguridad 		</th>
                  <td> 			Las medidas de seguridad 			implantadas se encuentran descritas en los documentos que 			conforman la documentación de Política de Seguridad de Vocdoni 			en relación al concreto servicio. 		</td>
                </tr>
                <tr>
                  <th> 			Entidad responsable 		</th>
                  <td> 			VOCDONI 		</td>
                </tr>
              </tbody>
            </table>
          </div>
        </When>
      </>
    </PageCard>
  )
}


export default PageView
