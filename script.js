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

/* Functions */
function createURL(event) {
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
		const btn = document.createElement('button');
		btn.textContent = 'WHAT DID THE POLICE DO?';
		const p = document.createElement('p');
		p.textContent = `${element.status} ${element.resolution_description}`;
		li.textContent = `${element.descriptor} | ${element.created_date} | ${element.agency}`;
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
