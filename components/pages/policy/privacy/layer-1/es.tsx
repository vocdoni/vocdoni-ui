import React from 'react'
import styled from 'styled-components'
import {DATA_POLICY_PATH} from '@const/routes'

export const PrivacyLayer1Es = () => (
  <>
    <p>
      En cumplimiento de lo dispuesto por el Reglamento 2016/679, del Parlamento
      Europeo y del Consejo, de 27 de abril de 2016 (RGPD), Aragon Labs, como
      responsable del tratamiento, le informa que sus datos personales son
      precisos para la prestación del servicio contratado, y que estos datos
      serán objeto de tratamiento, conforme a lo indicado en el registro de las
      actividades de tratamiento previsto en el artículo 30 del RGPD.
  </p>
    <p>Igualmente se le suministra la siguiente información <strong>(Capa 1)</strong>:</p>
    <TableWrapper>
      <table>
        <tbody>
          <tr>
            <td colSpan={2}>Información básica sobre Protección de Datos</td>
          </tr>
          <tr>
            <td>Responsable</td>
            <td>Los datos de carácter personal que se recaban directamente del
            solicitante del proceso de votación serán tratados de forma confidencial
            y quedarán incorporados a la correspondiente actividad de tratamiento
      titularidad de Aragon Labs.</td>
          </tr>
          <tr>
            <td>Finalidad</td>
            <td>  La debida prestación de los servicios de votación electrónica
      contratados.</td>
          </tr>
          <tr>
            <td>Legitimación</td>
            <td> <p>  La debida relación con los solicitantes del servicio de votación electrónica, y la gestión comercial y de servicios.</p>
              <p>La base legal para el tratamiento de sus datos es la ejecución del contrato a que se refiere el artículo 6.1.b) RGPD.</p>
              <p>La base legal para el mantenimiento de relaciones comerciales es el interés legítimo de Aragon Labs a que se refiere el artículo 6.1.f) RGPD. </p>
          </td>
        </tr>
        <tr>
          <td>Destinatarios</td>
          <td>Sus datos personales no serán cedidos a terceros, ni se transferirán
            fuera de la Unión Europea</td>
        </tr>
        <tr>
          <td>Derechos</td>
          <td>Acceder, rectificar y suprimir los datos, así como otros derechos, como
            se explica en la información adicional</td>
        </tr>
        <tr>
          <td>Información adicional (capa 2)</td>
          <td>Puede consultar la información adicional y detallada sobre Protección de Datos en nuestra página web:
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