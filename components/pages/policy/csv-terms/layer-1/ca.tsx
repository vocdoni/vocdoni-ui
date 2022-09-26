import React from 'react'
import styled from 'styled-components'

export const CsvTerms1Ca = () => (
  <>
    <PrivacyWrapper>
      <p>Aragon informa de manera expressa als sol·licitants d'aquest servei de votació electrònica, del següent:</p>
      <p>1) En relació amb la prestació d'aquest servei de votació electrònica, Aragon en cap cas tracta les dades personals dels participants en les votacions electròniques (els votants).  Aquestes dades son tractades exclusivament por la entitat/sol·licitant que contracta el servei de votació electrònica a Aragon  a través d'aquestes condiciones generales. Per aquest motiu l'entitat/sol·licitant és la responsable del tractament d'aquestes dades, i queda obligada al compliment de les obligacions que pertoquen en tal condició.</p>
      <p>2) Aragon únicament tracta certes dades de contacte de les entitats/sol·licitants del servei, en relació amb els quals adquireix la condició de responsable del tractament i compleix amb les obligacions del Reglamento (UE) 2016/679 del Parlamento Europeu i del Consell de 27 de abril de 2016 relatiu a la protecció de les persones físiques pel que fa respecta al tractament de dades personals i a la lliure circulació d'aquestes dades i pel que se deroga la Directiva 95/46/CE (Reglament general de protecció de dades), i la Llei Orgànica 3/2018, de 5 de desembre, de Protecció de dades personals i garantia dels drets digitals (LOPDGDD).</p>
      <p>3) El resultat de la votació electrònica estarà disponible públicament a xDAI, una  cadena de blocs pública de lectura i d'escriptura. Per això l'entitat/sol·licitant es dona per informat que no es possible controlar que la lectura d'aquests resultats.</p>
      <p>4) Aragon adverteix que depenent dels atributs requerits per l'entitat/sol·licitant als votants durant el procés de votació, pot arribar a ser possible la reidentificació dels votants. Per aquest motiu Aragon  recoman que, atenent a la sensibilitat de la votació concreta, el conjunt de atributs requerits als votants per la entitat/sol·licitant no permeti la seva reidentificació. Igualment queda prohibit l'ús de DNI/NIF o dades identificatives úniques similars, en aquelles votacions l'exercici de les quals suposin el tractament de categories especials de dades personals tal com està indicat en el article 9 RGPD. Por exemple: les votacions sobre opinions polítiques.</p>
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
