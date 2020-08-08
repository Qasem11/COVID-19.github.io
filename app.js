const init = () => {
	fetch('https://api.covid19api.com/summary')
		.then((resp) => {
			return resp.json();
		})
		.then((data) => {
			globalData(data);
			searchForCountry(data);
			readAllCountries(data);
		})
		.catch((err) => {
			alert('Something went wrong');
			console.log(err);
		});
};

const readAllCountries = (data) => {
	let table = document.querySelector('table');
	let tbody = document.querySelector('tbody');

	let unSorted = [];
	unSorted.push(data);
	unSorted = unSorted[0];

	let sorted = unSorted.Countries.sort(compare);
	// const keyGlobal = [
	// 	'World',
	// 	numberWithCommas(unSorted.Global.TotalConfirmed),
	// 	numberWithCommas(unSorted.Global.NewConfirmed),
	// 	numberWithCommas(unSorted.Global.TotalDeaths),
	// 	numberWithCommas(unSorted.Global.NewDeaths),
	// 	numberWithCommas(unSorted.Global.TotalRecovered),
	// 	numberWithCommas(unSorted.Global.NewRecovered)
	// ];

	// let Row = document.createElement('tr');
	// for (let i = -1; i < keyGlobal.length; i++) {
	// 	let cell = document.createElement('td');
	// 	if (i === -1) cell.appendChild(document.createTextNode(''));
	// 	else cell.appendChild(document.createTextNode(keyGlobal[i]));
	// 	Row.appendChild(cell);
	// }
	// tbody.appendChild(Row);

	for (let i = 0; i < sorted.length; i++) {
		let row = document.createElement('tr');
		let keyCountries = [
			numberWithCommas(sorted[i].Slug.split('-').join(' ')),
			numberWithCommas(sorted[i].TotalConfirmed),
			numberWithCommas(sorted[i].TotalDeaths),
			numberWithCommas(sorted[i].NewConfirmed),
			numberWithCommas(sorted[i].NewDeaths),
			numberWithCommas(sorted[i].TotalRecovered),
			numberWithCommas(sorted[i].NewRecovered)
		];
		for (let j = -1; j < keyCountries.length; j++) {
			let cell = document.createElement('td');
			if (j === -1) cell.appendChild(document.createTextNode(i + 1));
			else cell.appendChild(document.createTextNode(keyCountries[j]));
			row.appendChild(cell);
		}
		tbody.appendChild(row);
	}
	addClasses();
};

const addClasses = () => {
	let confirm = document.querySelectorAll('td:nth-child(4)');
	let deaths = document.querySelectorAll('td:nth-child(6)');
	let recover = document.querySelectorAll('td:nth-child(8)');

	for (let i = 0; i < confirm.length; i++) {
		if (confirm[i].textContent !== '0') confirm[i].classList.add('newConfirm');
		if (confirm[i].textContent === '0') confirm[i].textContent = '';
	}
	for (let i = 0; i < deaths.length; i++) {
		if (deaths[i].textContent !== '0') deaths[i].classList.add('newDeaths');
		if (deaths[i].textContent === '0') deaths[i].textContent = '';
	}
	for (let i = 0; i < recover.length; i++) {
		if (recover[i].textContent !== '0') recover[i].classList.add('newRecover');
		if (recover[i].textContent === '0') recover[i].textContent = '';
	}

	for (let i = 0; i < confirm.length; i++) {
		document.querySelectorAll('tbody td:nth-child(1)')[i].setAttribute('colname', '#');
		document.querySelectorAll('tbody td:nth-child(2)')[i].setAttribute('colname', 'country');
		document.querySelectorAll('tbody td:nth-child(3)')[i].setAttribute('colname', 'total cases');
		document.querySelectorAll('tbody td:nth-child(4)')[i].setAttribute('colname', 'new cases');
		document.querySelectorAll('tbody td:nth-child(5)')[i].setAttribute('colname', 'total deaths');
		document.querySelectorAll('tbody td:nth-child(6)')[i].setAttribute('colname', 'new deaths');
		document.querySelectorAll('tbody td:nth-child(7)')[i].setAttribute('colname', 'total recovery');
		document.querySelectorAll('tbody td:nth-child(8)')[i].setAttribute('colname', 'new recovery');
	}
};

const compare = (a, b) => {
	let totalA = a.TotalConfirmed;
	let totalB = b.TotalConfirmed;

	return (totalA - totalB) * -1;
};
const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const searchForCountry = (data) => {
	let countries = data.Countries;
	let countryName = '';
	let countryInput = document.querySelector('input');

	document.querySelector('button').addEventListener('click', () => {
		document.querySelector('form').addEventListener('submit', (event) => {
			event.preventDefault();
		});
		//taking the value of the input and clean it.
		countryName = countryInput.value;
		countryInput.value = '';

		//searching and updating data
		countries.forEach((country) => {
			if (
				country.Country.toLowerCase() === countryName.toLowerCase() ||
				country.CountryCode.toLowerCase() === countryName.toLowerCase() ||
				country.Slug.toLowerCase() === countryName.toLowerCase()
			) {
				document.querySelector('.card').style.display = 'block';
				document.querySelector('#countryName').textContent = country.Slug.split('-').join(' ');
				document.querySelector('#countryConfirm').textContent = numberWithCommas(country.TotalConfirmed);
				document.querySelector('#countryRecover').textContent = numberWithCommas(country.TotalRecovered);
				document.querySelector('#countryDeath').textContent = numberWithCommas(country.TotalDeaths);
			}
		});
	});
};
const globalData = (data) => {
	let global = data.Global;
	document.querySelector('#confirm').textContent = numberWithCommas(global.TotalConfirmed);
	document.querySelector('#recover').textContent = numberWithCommas(global.TotalRecovered);
	document.querySelector('#death').textContent = numberWithCommas(global.TotalDeaths);
};

init();
