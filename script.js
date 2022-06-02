console.log('Snoop Dougie Doug');

/* Constants */
const BASE_URL =
	'https://data.cityofnewyork.us/resource/erm2-nwe9.json?agency=NYPD&$order=created_date%20DESC';

/* Cached Elements */
const boroughsEl = document.querySelector('.boroughs');
const numOfComplaintsEl = document.querySelector('#numOfComplaints');
const complaintsULEl = document.querySelector('#complaints-list');
const boroughH2El = document.querySelector('#borough');
const categoriesEl = document.querySelector('#categories');
const mapEl = document.querySelector('#map');

/* Event Listener */
boroughsEl.addEventListener('click', createURL);
complaintsULEl.addEventListener('click', toggleInfo);

/* Functions */
function createURL(event) {
	if (!event.target.matches('button')) {
		return;
	}
	let limit = numOfComplaintsEl.value;
	numOfComplaintsEl.value = '';
	// If no limit is specified set default to 10
	if (!limit) {
		limit = 10;
	}
	let url = `${BASE_URL}&$limit=${limit}&borough=`;
	borough = event.target.id;
	// If borough is STATEN ISLAND then we need to add %20 to url for a space.
	if (borough === 'STATENISLAND') {
		url += 'STATEN%20ISLAND';
	} else {
		url += borough;
	}
	getData(url);
}

// Create list items and append to document
function createList(data) {
	complaintsULEl.innerHTML = '';
	// set H2 with name of selected borough
	boroughH2El.textContent = data[0].borough;
	const categoryCount = {};
	// Loop through all of the returned incidents and append an li for each one.
	data.forEach((element) => {
		const li = document.createElement('li');
		li.textContent = `${element.descriptor} | ${element.complaint_type}`;
		const btn = document.createElement('button');
		btn.textContent = 'More Info';
		btn.classList.add('complaints-btn');
		const p = document.createElement('p');
		p.innerHTML = `Date: ${element.created_date} <br>Status: ${element.status}`;
		if (element.resolution_description) {
			p.innerHTML += `<br>${element.resolution_description}`;
		}
		p.classList.add('hide-info');
		const mapBtn = document.createElement('button');
		mapBtn.textContent = 'Show Map';
		mapBtn.classList.add('map-btn');
		mapBtn.dataset.lat = element.latitude;
		mapBtn.dataset.long = element.longitude;
		li.appendChild(btn);
		li.appendChild(p);
		p.appendChild(mapBtn);
		complaintsULEl.appendChild(li);
		// Count instances of each complaint_type
		if (categoryCount[element.complaint_type]) {
			categoryCount[element.complaint_type]++;
		} else {
			categoryCount[element.complaint_type] = 1;
		}
	});
	// Loop through categoryCount object and display list of categories with counts
	categoriesEl.innerHTML = '';
	for (cat in categoryCount) {
		const catLi = document.createElement('li');
		catLi.textContent = `${cat}: ${categoryCount[cat]}`;
		categoriesEl.appendChild(catLi);
	}
}

// Fetch data at given url
function getData(url) {
	fetch(url)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			createList(data);
		})
		.catch((err) => {
			console.log('Error', err);
		});
}

// Toggle additional complaint info
function toggleInfo(event) {
	if (event.target.matches('.complaints-btn')) {
		event.target.nextSibling.classList.toggle('hide-info');
	} else if (event.target.matches('.map-btn')) {
		createMap(
			event.target.dataset.lat,
			event.target.dataset.long,
			event.target.parentElement
		);
	}
}

function createMap(lat, long, parent) {
	const div = document.createElement('div');
	const mapIframe = document.createElement('iframe');
	div.classList.add('map');
	mapIframe.width = '500';
	mapIframe.height = '400';
	mapIframe.frameBorder = '0';
	mapIframe.src = `https://www.bing.com/maps/embed?h=400&w=500&lvl=15&typ=d&sty=r&src=SHELL&FORM=MBEDV8&cp=${lat}~${long}`;
	mapIframe.scrolling = 'no';
	div.appendChild(mapIframe);
	parent.appendChild(div);
}
