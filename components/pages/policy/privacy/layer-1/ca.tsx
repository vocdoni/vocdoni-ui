import React from 'react'
import styled from 'styled-components'
import { DATA_POLICY_PATH } from '@const/routes'

export const PrivacyLayer1Ca = () => (
  <>
    <p>En cumplimiento de lo dispuesto en el Reglamento (Eu) 2016/679 Del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos, y por el que se deroga la Directiva 95/46/CE (RGPD), ARAGON LABS, como responsable del tratamiento, le informa que sus datos personales son necesarios para la prestación del servicio contratado, y que los mismos serán tratados, de acuerdo con lo indicado en el registro de actividades de tratamiento previsto en el artículo 30 del RGPD.</p>
    <p>Igualmente se le suministra la siguiente información<strong>(Capa 1)</strong>:</p>
    <TableWrapper>
      <table>
        <tbody>
          <tr>
            <td>Responsable</td>
            <td>Los datos personales que se recojan directamente del solicitante para el proceso de votación, serán tratados de forma confidencial y se incorporarán a la actividad de tratamiento correspondiente propiedad de ARAGON LABS.</td>
          </tr>
          <tr>
            <td>Finalidad</td>
            <td>La correcta prestación de los servicios de voto electrónico contratados, y la gestión comercial y de servicios.</td>
          </tr>
          <tr>
            <td>Legitimación</td>
            <td> 
              <p>La base legal para el tratamiento de sus datos es la ejecución del contrato al que se refiere el artículo 6.1.b) GDPR. La base legal para el mantenimiento de las relaciones comerciales, es el interés legítimo de ARAGON LABS referido en el artículo 6.1.f) GDPR</p>
            </td>
          </tr>
          <tr>
            <td>Destinatarios</td>
            <td>Sus datos personales no serán cedidos a terceros, ni serán transferidos fuera de la Unión Europea</td>
          </tr>
          <tr>
            <td>Derechos</td>
            <td>Acceder, rectificar y suprimir los datos, así como otros derechos, como
              se explica en la información adicional</td>
          </tr>
          <tr>
            <td>Información adicional (capa 2)</td>
            <td>Puede consultar la información adicional y detallada sobre la protección de datos en nuestro sitio web:
              <a target="_blank" href={DATA_POLICY_PATH}>https://vocdoni.app{DATA_POLICY_PATH}</a>
            </td>
          </tr>
          <tr>
            <td>Fuente (procedencia) de los datos en el supuesto en que los datos personales no hayan sido obtenidos directamente de usted</td>
            <td>No aplica.</td>
          </tr>
      </tbody>
    </table>
  </TableWrapper>
</>
)


const TableWrapper = styled.div`
& > table > tbody > tr > td {
  padding: 10px;
  border: solid 3px ${({ theme }) => theme.lightBorder};
}

& > table > tbody > tr > td:first-child {
  font-weight: bold;
}
`
