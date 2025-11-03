'use strict';

'use strict';
//MAIN VARIABLES 
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//MAIN LOGIC 
//Application Logic with Methods 
class App {
  #map;
  #mapEvent;
  
  constructor(){
    this._getPosition();
    
    // Event Listeners
    form.addEventListener('submit', this._newWorkOut.bind(this));
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
  }
  
  _getPosition(){
    if (navigator.geolocation) {
      // Accesses Geolocation API 
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function() {
          // Error Message - Failed 
          alert('Could Not Get Your Location');
        }
      );
    }
  }
  
  _loadMap(position){
    const {latitude, longitude} = position.coords;
    console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);
    
    const coords = [latitude, longitude];
    console.log(coords);
    
    // Accessing Leaflet Object to Setup Map Location 
    this.#map = L.map('map').setView(coords, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);
    
    // Leaflet On Click Handler Function (using arrow function)
    this.#map.on('click', this._showForm.bind(this));
  }
  
  _showForm(mapEv){
      this.#mapEvent = mapEv; 
      console.log(this.#mapEvent.latlng);
      form.classList.remove('hidden');
      inputDistance.focus();
  }

  _toggleElevationField(){
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  
  _newWorkOut(e){
    // Clearing Form 
    e.preventDefault();
    
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';
    inputElevation.value = '';
    
    // Destructing Object to Obtain Lat & Lng
    const {lat, lng} = this.#mapEvent.latlng;
    
    // Setting Up Marker after Submission
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(L.popup({
        maxWidth: 250, 
        minHeight: 100,
        autoClose: false,
        closeOnClick: false, 
        className: 'running-popup'
      }))
      .setPopupContent('Workout Completed Here')
      .openPopup();
  }
}

const application = new App();

