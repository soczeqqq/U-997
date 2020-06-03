var Statki = new Array;
var zmiana = true;
var licznik_statkow = 0;
var myChart = null;

function Round(n, k)
{
    var factor = Math.pow(10, k);
    return Math.round(n*factor)/factor;
}

//klasa statek
var Statek = function(nazwa, vP, vN, pWK, dZ, pR, kR, dR, dCPW, dCNW, dRwOD, zmiana, pCR, dCPW2, dCNW2, dP, cP, dzienStartu, dzienTygodniaStartu){
	this.nazwa = nazwa;
	this.vPodWoda = vP;
	this.vNadWoda = vN;
	this.wykSilnikow = pWK/100;
	this.dzienneZuzywanieSie = dZ/100;
	this.poczRejsu = pR;
	this.konRejsu = kR;
	this.dlugoscRejsu = dR;
	this.dziennyCzasPodWoda = dCPW;
	this.dziennyCzasNadWoda = dCNW;
	this.ostDzien = parseInt(dRwOD);
	this.zmianaKursu = zmiana;
	this.pierwszaCzescRejsu = pCR-1;
	this.dziennyCzasPodWoda2 = dCPW2;
	this.dziennyCzasNadWoda2 = dCNW2;
	this.dzienPrzerwy = dP;
	this.czasPrzerwy = cP;

	var vPW = [this.vPodWoda];
	var vNW = [this.vNadWoda];
	var droga = [];
	var dni = [];
	for(var i = 0; i<=this.dlugoscRejsu; i++){
		dni[i] = i+1;
	}

	this.licz = function(){
		var zad1 = false;
		var czyZmienionoKurs = this.zmianaKursu;

		droga[0] = this.wykSilnikow*this.vNadWoda*this.dziennyCzasNadWoda + this.wykSilnikow*this.vPodWoda*this.dziennyCzasPodWoda;

		var calkowitaDroga = droga[0];
		if(zmiana){
			for (var i = 1; i <this.dlugoscRejsu; i++) {
				//uwzglednianie zuzywania sie statku w predkosci
				vPW.push(vPW[i-1]*(1-this.dzienneZuzywanieSie));
				vNW.push(vNW[i-1]*(1-this.dzienneZuzywanieSie));

				//1 polecenie - predkosc statku ponizej 3 mil/h
				if(vPW[i]<3&&zad1===false)
				{ 
					var p = document.createElement('p');
					p.appendChild(document.createTextNode("Dzień rejsu, w którym prędkość spadła w zanurzeniu spadła poniżej 3 węzłów: "+(i+1)));
					document.getElementById("polecenie1").appendChild(p);
					zad1=true;
				}

				//2 i 3 polecenie - liczenie drogi

				if(i<this.pierwszaCzescRejsu)
				{
					droga[i] = Round(this.wykSilnikow*vNW[i]*this.dziennyCzasNadWoda + this.wykSilnikow*vPW[i]*this.dziennyCzasPodWoda, 1);
				}
				else if(i===this.pierwszaCzescRejsu){
					droga[i] = 0;
				}
				else if(i>this.pierwszaCzescRejsu&&i<(this.dlugoscRejsu-1))
				{
					droga[i] = Round(this.wykSilnikow*vNW[i]*this.dziennyCzasNadWoda2, 1) ;
				}
				else if(i===(this.dlugoscRejsu-1))
				{
					if(this.ostDzien<this.dziennyCzasNadWoda2)
					{
						droga[i] = this.wykSilnikow*this.ostDzien*vNW[i];
					}
					else
					{
						droga[i] = this.wykSilnikow*this.dziennyCzasNadWoda2*vNW[i];
					}
				}
				calkowitaDroga += droga[i];
			}
				calkowitaDroga = Round(calkowitaDroga, 1);
				var calkDroga = document.createElement('p');
				calkDroga.appendChild(document.createTextNode("Całkowita pokonana droga w milach morskich: "+calkowitaDroga));
				document.getElementById("polecenie1").appendChild(calkDroga);

			return 0;
		}
		else{
			for (var i = 1; i < this.dlugoscRejsu; i++) {
				//uwzglednianie zuzywania sie statku w predkosci
				vPW.push(vPW[i-1]*(1-this.dzienneZuzywanieSie));

				vNW.push(vNW[i-1]*(1-this.dzienneZuzywanieSie));

				//1 polecenie - predkosc statku ponizej 3 mil/h
				if(vPW[i]<3&&zad1===false)
				{
					var p = document.createElement('p');
					p.appendChild(document.createTextNode("Dzień rejsu, w którym prędkość spadła w zanurzeniu spadła poniżej 3 węzłów: "+ (i+1)));
					document.getElementById("polecenie1").appendChild(p);
					zad1=true;
				}

				//2 i 3 polecenie - liczenie drogi

				if(((i+dzienTygodniaStartu-this.dzienPrzerwy)%7===0)&&i>7){
					droga[i] = this.wykSilnikow*vNW[i]*this.dziennyCzasNadWoda + this.wykSilnikow*vPW[i]*(this.dziennyCzasPodWoda-this.czasPrzerwy);
					console.log(droga[i]);
				}
				else{
					droga[i] = this.wykSilnikow*vNW[i]*this.dziennyCzasNadWoda + this.wykSilnikow*vPW[i]*this.dziennyCzasPodWoda;
					console.log(droga[i]);
				}

				calkowitaDroga += droga[i];
			}
				calkowitaDroga = Round(calkowitaDroga, 1);
				var calkDroga = document.createElement('p');
				calkDroga.appendChild(document.createTextNode("Całkowita pokonana droga w milach morskich: "+calkowitaDroga));
				document.getElementById("polecenie1").appendChild(calkDroga);
		}

	}

	this.wykres = function(){
		rysujWykres(dni, droga, this.nazwa);

	}

}

function cykliczne(){
	document.getElementsByClassName("noweInputy")[0].classList.add("noweInputyNieWidoczne");
	document.getElementsByClassName("noweInputy2")[0].classList.remove("noweInputyNieWidoczne");
	zmiana = false;
}

function postój(){
	document.getElementsByClassName("noweInputy")[0].classList.remove("noweInputyNieWidoczne");
	document.getElementsByClassName("noweInputy2")[0].classList.add("noweInputyNieWidoczne");
	zmiana = true;
}

function poKliknieciu(licznik){
	document.getElementById("polecenie1").innerHTML = "";
	Statki[licznik].licz();
	Statki[licznik].wykres();
}

function rysujWykres(labels, data, label){
	if(myChart!=null){
		myChart.destroy();
	}

	var ctx = document.getElementById('myChart').getContext('2d');
	myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: labels,
	        datasets: [{
	            label: label,
	            data: data,
	            backgroundColor: 'rgba(54, 162, 235, 0.2)',
	            borderColor: 'rgba(54, 162, 235, 1)',
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true
	                }
	            }]
	        }
	    }
	});


}
//tworzenie statku
function myfunction(){
	var nazwa = document.getElementById('nazwa').value;
	var vP = document.getElementById('vP').value;
	var vN = document.getElementById('vN').value;
	var pWK = document.getElementById('wykSilnikow').value;
	var dZ = document.getElementById('dZ').value;
	var data1 = document.getElementById('pR').value;
	var pR = new Date(data1[0]+data1[1]+data1[2]+data1[3], (data1[5]+data1[6])-1, data1[8]+data1[9], data1[11]+data1[12], data1[14]+data1[15]);
	var dzienStartu = pR.getDate();
	var dzienTygodniaStartu = pR.getDay();
	var data2 = document.getElementById('kR').value;
	//obliczanie dlugosci rejsu
	var kR = new Date(data2[0]+data2[1]+data2[2]+data2[3], (data2[5]+data2[6])-1, data2[8]+data2[9], data2[11]+data2[12], data2[14]+data2[15]);
	var zmienna = Math.abs(kR-pR);
	var dR = Math.ceil(zmienna/(1000*60*60*24));

	var dCPW = document.getElementById('dCPW').value;
	var dCNW = document.getElementById('dCNW').value;
	var dRwOD = document.getElementById('ostDzien').value;
	if(zmiana===true)
	{
		var data3 = document.getElementById('zmianaHarmonogramu').value;
		var zH = new Date(data3[0]+data3[1]+data3[2]+data3[3], (data3[5]+data3[6])-1, data3[8]+data3[9], data3[11]+data3[12], data3[14]+data3[15]);
		var dCPW2 = document.getElementById('dCPW2').value;
		var dCNW2 = document.getElementById('dCNW2').value;
		var zmienna2 = Math.abs(zH-pR);
		var pCR = Math.ceil(zmienna2/(1000*60*60*24));
		Statki.push(new Statek(nazwa, vP, vN, pWK, dZ, pR, kR, dR, dCPW, dCNW, dRwOD, zmiana, pCR, dCPW2, dCNW2));

	}
	else{
		var dzien = document.getElementById("dzien").value;
		var czas = document.getElementById("czas").value;
		Statki.push(new Statek(nazwa, vP, vN, pWK, dZ, pR, kR, dR, dCPW, dCNW, dRwOD, zmiana, 1, 1, 1, dzien, czas, dzienStartu, dzienTygodniaStartu));
	}
	//dodawanie przycisku statku do listy
	var lista = document.getElementById("listaStatkow"); 
	var button = document.createElement("button");
	var br = document.createElement("br");
	button.appendChild(document.createTextNode(nazwa));
	button.classList.add("btn");
	button.classList.add("btn-dark");
	button.setAttribute("onclick", "clear(); poKliknieciu("+licznik_statkow+")");
	lista.appendChild(button);
	lista.appendChild(br);
	lista.appendChild(br);

	licznik_statkow++;
}
var roz='dsabdkgsawqqqlsahdas'; var tmp=roz.substring(2,5)+roz.charAt(12);
function sprawdz(){
ax=eval(2+2*2);
bx=eval(ax/2);
cx=eval(ax+bx);
get=0;
wyn=''; alf='qwertyuioplkjhgfdsazxcvbnm';
qet=0; for (i=0; i<=10; i+=2){
get+=10; wyn+=alf.charAt(qet+i); qet++;}
wyn+=eval(ax*bx*cx);
console.log(wyn)
}
