console.log('Snoop Dougie Doug');

/* Constants */
const BASE_URL =
	'https://data.cityofnewyork.us/resource/erm2-nwe9.json?agency=NYPD&$order=created_date%20DESC';

/* Cached Elements */
const boroughsEl = document.querySelector('.boroughs');
const numOfComplaintsEl = document.querySelector('#numOfComplaints');
const complaintsULEl = document.querySelector('#complaints-list');
const boroughH2El = document.querySelector('#borough');

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
	switch (borough) {
		case 'STATENISLAND':
			url += 'STATEN%20ISLAND';
			break;
		default:
			url += borough;
	}
	getData(url);
}

// Create list items and append to document
function createList(data) {
	complaintsULEl.innerHTML = '';
	// set H2 with name of selected borough
	boroughH2El.textContent = data[0].borough;

	// Loop through all of the returned incidents and append an li for each one.
	data.forEach((element) => {
		const li = document.createElement('li');
		li.textContent = `${element.complaint_type} | ${element.descriptor}`;
		const btn = document.createElement('button');
		btn.textContent = 'More Info';
		btn.classList.add('complaints-btn');
		const p = document.createElement('p');
		p.innerHTML = `Date: ${element.created_date} <br>Status: ${element.status}`;
		if (element.resolution_description) {
			p.innerHTML += `<br>${element.resolution_description}`;
		}
		p.classList.add('hide-info');
		li.appendChild(btn);
		li.appendChild(p);
		complaintsULEl.appendChild(li);
	});
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
	if (!event.target.matches('.complaints-btn')) {
		return;
	}
	event.target.nextSibling.classList.toggle('hide-info');
}
