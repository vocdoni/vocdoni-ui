import React from 'react'
import styled from 'styled-components'

export const CsvTerms1Es = () => (
  <>
    <PrivacyWrapper>
      <p>Aragon Labs informa de manera expresa a los solicitantes de este servicio de votación electrónica, de lo siguiente:</p>
      <p>1) En relación con la prestación de este servicio de votación electrónica, Aragon Labs en ningún caso trata los datos personales de los participantes en las votaciones electrónicas (los votantes).  Dichos datos son tratados exclusivamente por la entidad/solicitante que contrata el servicio de votación electrónica a Aragon Labs a través de estas condiciones generales. Por dicho motivo la entidad/solicitante es el responsable del tratamiento de dichos datos, y queda obligado al cumplimiento de las obligaciones que pertoquen en tal condición.</p>
      <p>2) Aragon Labs únicamente trata ciertos datos de contacto de las entidades/solicitantes del servicio, en relación con los cuales adquiere la condición de responsable del tratamiento y cumple con las obligaciones del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016 relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos y por el que se deroga la Directiva 95/46/CE (Reglamento general de protección de datos), y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>
      <p>3) El resultado de la votación electrónica estará disponible públicamente en xDAI, una cadena de bloques pública de lectura y de escritura. Por ello la entidad/solicitante se da por informado que no es posible controlar que la lectura de las votaciones se haga por todo aquel que tenga acceso a Vochain.</p>
      <p>4) Aragon Labs advierte que dependiendo de los atributos requeridos por la entidad/solicitante a los votantes en el proceso de votación, puede llegar a ser posible la reidentificación de dichos votantes. Por dicho motivo Aragon Labs recomienda que, atendiendo a la sensibilidad de la concreta votación, el conjunto de atributos requeridos a los votantes por la entidad/solicitante no permita su reidentificación. Igualmente se prohíbe el uso de DNI/NIF o datos identificativos únicos similares, en aquellas votaciones cuyo ejercicio supongan el tratamiento de categorías especiales de datos personales según lo indicado en el artículo 9 RGPD. Por ejemplo: votaciones sobre opiniones políticas.</p>
    </PrivacyWrapper>
  </>
)

const PrivacyWrapper = styled.div`
& h2 {
text-align: center;
}
& > ul > li  {
font-size: small;
}
`
