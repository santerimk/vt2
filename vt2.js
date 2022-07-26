"use strict";
//@ts-check
// voit tutkia käsiteltävää dataa suoraan osoitteesta
// https://appro.mit.jyu.fi/cgi-bin/tiea2120/randomize.cgi
// data muuttuu hieman jokaisella latauskerralla

// seuraava lataa datan ja luo sen käsittelyyn tarvittavan parserin
// xmldata-muuttuja sisältää kaiken tarvittavan datan
// vinkki: muunna xmldata ensimmäisen viikkotehtävän tyyppiseksi rakenteeksi

{
  let xmldata; 

  window.addEventListener("load", function() {
	fetch('https://appro.mit.jyu.fi/cgi-bin/tiea2120/randomize.cgi')
	  .then(response => response.text())
	  .then(function(data) {
		let parser = new window.DOMParser();
		xmldata = parser.parseFromString( data, "text/xml" );
		// tästä eteenpäin omaa koodia
        let dataRakenne = {
            joukkueet: [],
            rastit: [],
            sarjat: [],
        };
        let joukkueData = xmldata.documentElement.getElementsByTagName("joukkue");
        let rastiData = xmldata.documentElement.getElementsByTagName("rasti");
        let sarjaData = xmldata.documentElement.getElementsByTagName("sarja");
        for (let rasti of rastiData) {
            let rastiObjekti = {
                id: rasti.getAttribute("id"),
                koodi: rasti.getAttribute("koodi"),
                lat: rasti.getAttribute("lat"),
                lon: rasti.getAttribute("lon")
            };
            // pushaa dataan
            dataRakenne.rastit.push(rastiObjekti);
        }
        for (let sarja of sarjaData) {
            let sarjaObjekti = {
                id: sarja.getAttribute("id"),
                kesto: sarja.getAttribute("kesto"),
                nimi: sarja.getAttribute("nimi")
            };
            dataRakenne.sarjat.push(sarjaObjekti);
        }
        for (let joukkue of joukkueData) {
            let joukkueObjekti = {
                jasenet: [], // lisää toteutus
                nimi: joukkue.getAttribute("nimi"),
                sarja: joukkue.getAttribute("sarja")
            };
            dataRakenne.joukkueet.push(joukkueObjekti);
        }
		console.log(xmldata);
		console.log(xmldata.documentElement);
		console.log(xmldata.documentElement.getElementsByTagName("joukkue"));
        console.log(dataRakenne);
	  }
	);

  });
 // voit määritellä omia funktioita tänne saman lohkon sisään jolloin näkevät myös xmldata-muuttujan
}

