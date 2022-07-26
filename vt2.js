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
  let dataRakenne = {
    joukkueet: [],
    rastit: [],
    sarjat: [],
  };

  window.addEventListener("load", function() {
	fetch('https://appro.mit.jyu.fi/cgi-bin/tiea2120/randomize.cgi')
	  .then(response => response.text())
	  .then(function(data) {
		let parser = new window.DOMParser();
		xmldata = parser.parseFromString( data, "text/xml" );
		// tästä eteenpäin omaa koodia
        // Datan rakentaminen
        let joukkueData = xmldata.documentElement.getElementsByTagName("joukkue");
        let rastiData = xmldata.documentElement.getElementsByTagName("rasti");
        let sarjaData = xmldata.documentElement.getElementsByTagName("sarja");
        for (let rasti of rastiData) {
            let rastiObjekti = {
                id: Number(rasti.getAttribute("id")),
                koodi: rasti.getAttribute("koodi"),
                lat: Number(rasti.getAttribute("lat")),
                lon: Number(rasti.getAttribute("lon"))
            };
            // pushaa dataan
            dataRakenne.rastit.push(rastiObjekti);
        }
        for (let sarja of sarjaData) {
            let sarjaObjekti = {
                id: Number(sarja.getAttribute("id")),
                kesto: Number(sarja.getAttribute("kesto")),
                nimi: sarja.getAttribute("nimi")
            };
            dataRakenne.sarjat.push(sarjaObjekti);
        }
        for (let joukkue of joukkueData) {
            let jasenTaulukko = [];
            let jasenet = joukkue.firstChild; 
            for (let jasen of jasenet.childNodes) {
                jasenTaulukko.push(jasen.textContent);
            }
            let joukkueObjekti = {
                jasenet: jasenTaulukko,
                nimi: joukkue.getAttribute("nimi"),
                sarja: joukkue.getAttribute("sarja")
            };
            dataRakenne.joukkueet.push(joukkueObjekti);
        }

        tulostaJoukkueet(dataRakenne);
        luoRastiLomake();
        tulostaRastit();
		console.log(xmldata);
		console.log(xmldata.documentElement);
		console.log(xmldata.documentElement.getElementsByTagName("joukkue"));
        console.log(dataRakenne);
	  }
	);

  });
 // voit määritellä omia funktioita tänne saman lohkon sisään jolloin näkevät myös xmldata-muuttujan
 

 /**
  * Tulostaa joukkueet datasta
  * @param {Object} data
  */
 const tulostaJoukkueet = function(dataRakenne) {
    function compare(a, b) {
		let aSarja = dataRakenne.sarjat.find(({ id }) => id == a.sarja);
		let bSarja = dataRakenne.sarjat.find(({ id }) => id == b.sarja);
        if (aSarja.nimi < bSarja.nimi) {
            return -1;
        }
        if (aSarja.nimi > bSarja.nimi) {
            return 1;
        }

        let eka = a.nimi.trim().toUpperCase();
        let toka = b.nimi.trim().toUpperCase();
        if (eka < toka) {
            return -1;
        }
        if (eka > toka) {
            return 1;
        }
        return 0;
    }
    
    let tulospalvelu = document.getElementsByTagName("h1");
	let table = document.createElement("table");
	let caption = document.createElement("caption");
	let tr = document.createElement("tr");
	let th1 = document.createElement("th");
	let th2 = document.createElement("th");
	let sarjaOtsikko = document.createTextNode("Sarja");
	let joukkueOtsikko = document.createTextNode("Joukkue");
	th1.appendChild(sarjaOtsikko);
	th2.appendChild(joukkueOtsikko);
	tr.appendChild(th1);
    tr.appendChild(th2);
	table.appendChild(caption);
	table.appendChild(tr);
	tulospalvelu[0].after(table);
	
    let joukkueet = dataRakenne.joukkueet.slice();
    joukkueet.sort(compare);
    for(let joukkue of joukkueet) {
        let nimi = joukkue.nimi;
        let sarjaApu = dataRakenne.sarjat.find(({ id }) => id == joukkue.sarja);
        let koodi = sarjaApu.nimi;
        let row = document.createElement("tr");
        let s = document.createElement("td");
        let j = document.createElement("td");
        let solu1 = document.createTextNode(koodi);
        let solu2 = document.createTextNode(nimi);
        s.appendChild(solu1);
        j.appendChild(solu2);
        row.appendChild(s);
        row.appendChild(j);
        table.appendChild(row);
    }
 };

 /**
  * Luo rastilomakkeen uuden rastin lisäämiselle
  */
 const luoRastiLomake = function() {
    let fieldset = document.createElement("fieldset");
    let legend = document.createElement("legend");
    fieldset.appendChild(legend);
    let lat = document.createElement("label");
    let lon = document.createElement("label");
    let koodi = document.createElement("label");
    let span1 = document.createElement("span");
    let span2 = document.createElement("span");
    let span3 = document.createElement("span");
    let input1 = document.createElement("input");
    input1.setAttribute("type", "text");
    input1.setAttribute("value", "");
    let input2 = document.createElement("input");
    input2.setAttribute("type", "text");
    input2.setAttribute("value", "");
    let input3 = document.createElement("input");
    input3.setAttribute("type", "text");
    input3.setAttribute("value", "");
    let button = document.createElement("button");
    button.setAttribute("id", "rasti");
    let lomake = document.createElement("form");
    lomake.setAttribute("method", "testi");
    lomake.setAttribute("action", "post");
    let rastinTiedot = document.createTextNode("Rastin tiedot");
    let latTeksti = document.createTextNode("Lat");
    let lonTeksti = document.createTextNode("Lon");
    let koodiTeksti = document.createTextNode("Koodi");
    let buttonTeksti = document.createTextNode("Lisää rasti");
    legend.appendChild(rastinTiedot);
    fieldset.appendChild(legend);
    span1.appendChild(latTeksti);
    span2.appendChild(lonTeksti);
    span3.appendChild(koodiTeksti);
    lat.appendChild(span1);
    lat.appendChild(input1);
    lon.appendChild(span2);
    lon.appendChild(input2);
    koodi.appendChild(span3);
    koodi.appendChild(input3);
    fieldset.appendChild(lat);
    fieldset.appendChild(lon);
    fieldset.appendChild(koodi);
    button.appendChild(buttonTeksti);
    fieldset.appendChild(button);
    lomake.appendChild(fieldset);
	let rastinLisays = document.getElementsByTagName("h2");
	rastinLisays[0].after(lomake);
    button.addEventListener('click', lisaaRasti);
 };

 /**
  * Lisää rastin käyttäjän syötteen mukaan dataan
  * @param {Event} e
  */
 const lisaaRasti = function(e) {
    e.preventDefault();
    let input = document.getElementsByTagName("input");
    let lat = input[0].value;
    let lon = input[1].value;
    let koodi = input[2].value;
    if (lat !== '' && lon !== '' && koodi !== '' && lat % 1 !== 0 && lon % 1 !== 0) {
        let rasti = {
            lon: Number(lon),
            koodi: koodi,
            lat: Number(lat),
            id: etsiSuurin()
        };
        console.log(rasti);
        dataRakenne['rastit'].push(rasti);
    }
    let form = document.getElementsByTagName("form");
    form[0].reset();
    let lista = document.getElementsByTagName("ul");
    lista[0].remove();
    tulostaRastit();
 };

 /**
  * Etsii suurimman id:n rastitaulukosta ja lisää yhden
  * @returns suurin
  */
 const etsiSuurin = function() {
	let suurin = 0;
	for (let rasti of dataRakenne.rastit) {
		if (rasti.id > suurin) {
			suurin = rasti.id;
		}
	}
    suurin++;
	return suurin;
 };

 /**
  * Tulostaa rastit datasta aakkosittain järjestettynä listana
  */
 const tulostaRastit = function() {
    function compare(a, b) {
        let eka = a.koodi.toUpperCase();
        let toka = b.koodi.toUpperCase();
        if (eka < toka) {
            return -1;
        }
        if (eka > toka) {
            return 1;
        }
        return 0;
    }
    
    let h2 = document.getElementsByTagName("h2");
	let ul = document.createElement("ul");
	h2[2].after(ul);
    let rastit = dataRakenne.rastit.slice();
    rastit.sort(compare);
    for(let rasti of rastit) {
        let koodi = rasti.koodi;
        let li = document.createElement("li");
        let solu = document.createTextNode(koodi);
        li.appendChild(solu);
        ul.appendChild(li);
    }
 };
}

