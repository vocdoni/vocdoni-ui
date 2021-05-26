import { PageCard } from "@components/cards"
import i18n from '@i18n';
import { When } from "react-if";
import {REGSITRY_PATH} from '@const/routes'
const PageView = () => {
  const lang = i18n.language

  return (
    <PageCard>
      <>
        <When condition={!lang || lang === 'es' || lang === 'ca'}>
        <>
          <h2>Capa segundaria de información de Protección de Datos</h2>
          <h4>Responsable del tratamiento</h4>
          <p>Los datos de carácter personal que se pudieran recabar directamente del interesado serán tratados de forma confidencial y quedarán incorporados a la correspondiente actividad de tratamiento titularidad de Aragon Labs.</p>
          <p></p>
          <p>La relación actualizada de las actividades de tratamiento que Aragon Labs lleva a cabo se encuentra disponible en el siguiente enlace al registro de actividades de Aragon Labs: <a target="_blank" href={REGSITRY_PATH}>https://vocdoni.app{REGSITRY_PATH}</a></p>
<p></p>
            <h4>¿Quién es el Responsable del tratamiento de sus datos?</h4>
            <p>Identidad: Aragon Labs, AG</p>
            {/* <p>Registration number: </p> */}
            <p>Dir. postal: Bahnhofstrasse, 20, 6300 Zug, Switzerland</p>
            <p>Teléfono: +372 54680950</p>
            <p>Correo electrónico: privacy@aragonlabs.com</p>
            <p>Contacto DPD: <a href="mailto:roger@aragon.org">Roger
            Baig</a></p>
            <p></p>
            <h4>Finalidad</h4>
            <p>La finalidad del tratamiento de los datos corresponde a cada una de las actividades de tratamiento que realiza Aragon Labs, accesibles en el correspondiente registro de actividades de tratamiento a que se refiere el enlace indicado en el párrafo anterior.</p>
            <p></p>
            <h4>Legitimación</h4>
            <p></p>
            <p>El tratamiento de sus datos se realiza para el cumplimiento de obligaciones legales por parte de Aragon Labs.</p>
            <p></p>
            <p>La concreta legitimación para el tratamiento de sus datos es la debida prestación y ejecución del contrato de servicios de votación, por el que usted acepta las condiciones generales de dicho servicio. En su caso, el envío de las comunicaciones publicitarias o promocionales de productos y servicios como solicitante del proceso de votación está basada en el interés legítimo de Aragon Labs. El envío de información, publicidad, suscripción a boletín de noticias y la asistencia a entidades distintas de las solicitantes se legitima por su consentimiento.</p>
            <p></p>
            <p>Puede consultar la base legal para cada una de las actividades de tratamiento que lleva a cabo Aragon Labs en el enlace al registro de actividades de Aragon Labs indicado previamente. </p>
            <p></p>
            <h4>Conservación de datos</h4>
            <p>Los datos personales correspondientes a la prestación del servicio se conservarán mientras la esté vigente la relación contractual.</p>
            <p>Los datos personales correspondientes al resto de servicios, se conservarán durante el tiempo necesario para cumplir con la finalidad para la que se recaban y para determinar las posibles responsabilidades que se pudieran derivar de la finalidad, además de los períodos que resulten del ejercicio de las correspondientes acciones de reclamación en la vía administrativa y judicial. En todos los casos, una vez finalice la prestación del servicio, Aragon Labs mantendrá sus datos personales bloqueados durante los plazos de prescripción legal. Transcurridos dichos plazos de prescripción, sus datos serán destruidos.</p>
            <p></p>
            <h4>Comunicación de datos</h4>
            <p>Con carácter general no se comunicarán los datos personales a terceros. En algunos casos, podría ser necesario comunicar la información que nos ha proporcionado a terceras partes para poder prestarle el servicio que ha solicitado.</p>
            <p></p>
            <p>Puede consultar los destinatarios para cada una de las actividades de tratamiento que lleva a cabo Aragon Labs en el enlace al registro de actividades de Aragon Labs.</p>
            <p></p>
            <h4>Derechos de los interesados</h4>
            <p>Cualquier persona tiene derecho a obtener confirmación sobre los tratamientos que de sus datos que se llevan a cabo por Aragon Labs.</p>
            <p>YPuede ejercer sus derechos de acceso, rectificación, supresión y portabilidad de sus datos, de limitación y oposición a su tratamiento, así como a no ser objeto de decisiones basadas únicamente en el tratamiento automatizado de sus datos, cuando procedan, ante Aragon Labs, Calle Bahnhofstrasse 20, 6300 Zug,
        Switzerland, o en la dirección de correo electrónico</p>
            <p></p>
            <h4>¿Qué datos son obligatorios?</h4>
            <p>Los datos que se solicitan a los interesados son estrictamente los necesarios para la suscripción del contrato, y la prestación del servicio. La no comunicación de los datos supondría la imposibilidad de prestación del servicio.</p>
            <p></p>
            <h4>Medidas de seguridad</h4>
            <p>Las medidas de seguridad implantadas se encuentran descritas en los documentos que conforman la documentación de Política de Seguridad de Aragon Labs en relación al concreto servicio.</p>
            <p></p>
            <h4>¿Se toman decisiones automatizadas?</h4>
            <p>Aragon Labs no adopta decisiones automatizadas, ni siquiera la elaboración de perfiles.</p>
            <p></p>
            <h4>¿Se realizan transferencias internacionales de datos?</h4>
            <p>Aragon Labs no realiza transferencias de datos personales a terceros países a los que no es de aplicación el RGPD.</p>
            <p></p>
            <h4>En el supuesto en que los datos personales no hayan sido obtenidos directamente de usted </h4>
            <p>Los datos personales únicamente se obtienen del interesado.</p>
            <p></p>
            <h4>Derecho a presentar una reclamación ante la autoridad de control:</h4>
            <p>Usted tiene derecho a presentar una reclamación ante la autoridad de control en el caso de que considere infringido algunos de los derechos que en materia de protección de datos, le asisten. La autoridad de control en España es la Agencia Española de Protección de Datos accesible en: <a target="_blank" href="https://www.aepd.es">https://www.aepd.es</a></p>

            </>
        </When>

        <When condition={lang === 'en'}>
          <>
          <h2>Data Protection Secondary Information Layer</h2>
          <h4>Responsible for the treatment</h4>
          <p>The personal data that could be collected directly from the interested party will be
          treated confidentially and will be incorporated into the corresponding treatment activity owned by Aragon
        Labs.</p>
          <p></p>
          <p>The updated list of the treatment activities that Aragon Labs carries out is available at the
          following link to the Aragon Labs activity register: <a target="_blank" href={REGSITRY_PATH}>https://vocdoni.app{REGSITRY_PATH}</a></p>
<p></p>
            <h4>Who is responsible for the processing of your data?</h4>
            <p>Identity: Aragon Labs, AG</p>
            {/* <p>Registration number: </p> */}
            <p>Postal address: Bahnhofstrasse, 20, 6300 Zug, Switzerland</p>
            <p>Telephone: +372 54680950</p>
            <p>Email: privacy@aragonlabs.com</p>
            <p>DPD Contact: <a href="mailto:roger@aragon.org">Roger
            Baig</a></p>
            <p></p>
            <h4>Purpose</h4>
            <p>The purpose of data processing corresponds to each of the processing activities carried
            out by Aragon Labs, accessible in the corresponding record of processing activities referred to in the link
        indicated in the preceding paragraph.</p>
            <p></p>
            <h4>Legitimation</h4>
            <p></p>
            <p>The processing of your data is carried out for the fulfillment of legal obligations by
        Aragon Labs.</p>
            <p></p>
            <p>The specific legitimacy for the treatment of your data is the due provision and
            execution of the voting services contract, by which you accept the general conditions of said service. Where
            appropriate, the sending of advertising or promotional communications of products and services as an applicant
            for
            the voting process is based on the legitimate interest of Aragon Labs. The sending of information, advertising,
            subscription to the newsletter and assistance to entities other than the applicants is legitimized by your
        consent.</p>
            <p></p>
            <p>You can consult the legal basis for each of the processing activities carried out by
        Aragon Labs in the link to the Aragon Labs activity register indicated previously. </p>
            <p></p>
            <h4>Data Retention</h4>
            <p>The personal data corresponding to the provision of the service will be kept
        as long as the contractual relationship is in force.</p>
            <p>The personal data corresponding to the rest of the services will be kept for the time
            necessary to fulfill the purpose for which they are collected and to determine the possible responsibilities
            that
            may arise from the purpose, in addition to the periods that result from the exercise of the corresponding claim
            actions in the administrative and judicial channels. In all cases, once the service is finished, Aragon Labs
            will
            keep your personal data blocked during the legal prescription periods. After these prescription periods have
        elapsed, your data will be destroyed.</p>
            <p></p>
            <h4>Data communication</h4>
            <p>In general, personal data will not be communicated to third parties. In some cases, it
            may be necessary to communicate the information you have provided to third parties in order to provide you with
        the service you have requested.</p>
            <p></p>
            <p>You can check the recipients for each of the processing activities carried out by
        Aragon Labs in the link to the Aragon Labs activity register.</p>
            <p></p>
            <h4>Rights of the interested parties</h4>
            <p>Anyone has the right to obtain confirmation about the processing of their data that is
        carried out by Aragon Labs.</p>
            <p>You can exercise your rights of access, rectification, deletion and portability of your
            data, of limitation and opposition to its treatment, as well as not to be the subject of decisions based solely
            on
            the automated processing of your data, when appropriate, before Aragon Labs, Bahnhofstrasse 20, 6300 Zug,
        Switzerland, or at the email address privacy@aragonlabs.com</p>
            <p></p>
            <h4>What information is required?</h4>
            <p>The data that are requested from the interested parties are strictly those necessary
            for the subscription of the contract, and the provision of the service. Failure to communicate the data would
        imply the impossibility of providing the service.</p>
            <p></p>
            <h4>Security</h4>
            <p>The Measures implemented are described in the documents that make up the Aragon Labs
        Security Policy documentation in relation to the specific service.</p>
            <p></p>
            <h4>Are automated decisions made?</h4>
            <p>Aragon Labs does not make automated decisions, not even
        profiling.</p>
            <p></p>
            <h4>Are international data transfers made?</h4>
            <p>Aragon Labs does not transfer personal data to third countries to
        which the RGPD does not apply.</p>
            <p></p>
            <h4>In the event that the personal data has not been obtained directly from you </h4>
            <p>The personal data is only obtained from the interested party.</p>
            <p></p>
            <h4>Right to file a claim with the control authority:</h4>
            <p>You have the right to file a claim with the control authority in the event that you consider
            some of your data protection rights to be violated. The control authority in Spain is the Spanish Data
            Protection Agency accessible at: <a target="_blank" href="https://www.aepd.es">https://www.aepd.es</a></p>

            </>
        </When>
      </>
    </PageCard>
  )
}

export default PageView
