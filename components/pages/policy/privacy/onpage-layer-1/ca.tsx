import React from 'react'
import styled from 'styled-components'
import { DATA_POLICY_PATH } from '@const/routes'
import { Typography, TypographyVariant } from '@components/elements/typography'

export const OnPagePrivacyLayer1Ca = () => (
  <>
    <Typography variant={TypographyVariant.ExtraSmall}>En cumplimiento de lo dispuesto por el Reglamento 2016/679, del Parlamento Europeo y del Consejo, de 27 de abril de 2016 (RGPD), Aragon Labs, como responsable del tratamiento, le informa que sus datos personales son precisos para la prestación del servicio contratado, y que estos datos serán objeto de tratamiento, conforme a lo indicado en el registro de las actividades de tratamiento previsto en el artículo 30 del RGPD.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}>Igualmente se le suministra la siguiente información <strong>(Capa 1)</strong>:</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Responsable</strong> - Los datos de carácter personal que se recaban directamente del solicitante del proceso de votación serán tratados de forma confidencial y quedarán incorporados a la correspondiente actividad de tratamiento titularidad de Aragon Labs.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Finalidad</strong> - La debida prestación de los servicios de votación electrónica contratados.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Legitimación</strong> - La debida relación con los solicitantes del servicio de votación electrónica, y la gestión comercial y de servicios. La base legal para el tratamiento de sus datos es la ejecución del contrato a que se refiere el artículo 6.1.b) RGPD. La base legal para el mantenimiento de relaciones comerciales es el interés legítimo de Aragon Labs a que se refiere el artículo 6.1.f) RGPD.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Destinatarios</strong> - Sus datos personales no serán cedidos a terceros, ni se transferirán fuera de la Unión Europea</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Derechos</strong> - Acceder, rectificar y suprimir los datos, así como otros derechos, como se explica en la información adicional</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Información adicional (capa 2)</strong> - Puede consultar la información adicional y detallada sobre Protección de Datos en nuestra página web: <a target="_blank" href={DATA_POLICY_PATH}>https://vocdoni.app{DATA_POLICY_PATH}</a></Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Fuente (procedencia) de los datos en el supuesto en que los datos personales no hayan sido obtenidos directamente de usted </strong> - No aplica.</Typography>
    <br /><br />
  </>
)