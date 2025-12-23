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

//Parent Class for Workouts 
class Workout{
  //Date and Unique ID 
  date = new Date()
  id = (Date.now() + '').slice(-10)

  //Properties of the Workout Class 
  constructor(coords, distance, duration){
    this.coords = coords; 
    this.distance = distance;
    this.duration = duration; 
  }
}

//Running Class [Child]
class Running extends Workout{
  type = 'running'
  constructor(coords, distance, duration, cadence){
    super(coords, distance, duration)
    this.cadence = cadence;
    this.calculatePace();
  }

  calculatePace(){
    this.pace = this.duration/this.distance
    return this.pace
  }
}

//Cycling Class [Child]
class Cycling extends Workout{
  type = 'cycling' 
  constructor(coords, distance, duration, elevationGain){
    super(coords, distance, duration)
    this.elevationGain = elevationGain;
    this.calculateSpeed();
  }

  calculateSpeed(){
    this.speed = this.distance/this.duration
    return this.speed
  }
}

const firstRun = new Running([39, -12], 5.2, 24, 178)
console.log(firstRun)

//APPLICATION ARCHITECTURE
class App {
  #map;
  #mapEvent;
  #workouts = [];
  
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
    const validateInputs = (...inputs) => inputs.every(data => Number.isFinite(data))
    const checkNegativeNums = (...inputs) => inputs.every(data => data > 0) 

    // Clearing Form 
    e.preventDefault();
    
    // Get Data from Form 
    const type = inputType.value;
    const distance = Number(inputDistance.value); 
    const duration = Number(inputDuration.value);
    
    // Destructing Object to Obtain Lat & Lng
    const {lat, lng} = this.#mapEvent.latlng;
    let workout;

    // If Running Workout Create Running Object 
    if (type === 'running'){
      const cadence = Number(inputCadence.value)

      // Fixed: added ! before checkNegativeNums and added return
      if(!validateInputs(distance, duration, cadence) || !checkNegativeNums(distance, duration, cadence)){
        return alert('Use a Positive and Valid Number')
      }

      workout = new Running([lat, lng], distance, duration, cadence)
      this.#workouts.push(workout)
    }

    // If Cycling Workout Create Cycling Object
    if(type === 'cycling'){
      const elevation = Number(inputElevation.value)

      if(!validateInputs(distance, duration, elevation) || !checkNegativeNums(distance, duration)){
        return alert('Use a Positive and Valid Number')
      }
      
      workout = new Cycling([lat, lng], distance, duration, elevation)
      this.#workouts.push(workout)  // Fixed: removed duplicate push
    }
    
    console.log(workout)
    
    //Render Workout on the List 
    this.renderWorkoutMarker(workout)
    
    //Hide Form + Clear Inputs 
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';
    inputElevation.value = '';
  }
  
  renderWorkoutMarker(workout){
    // Render Workout on Map as Marker  
    L.marker(workout.coords)  // Fixed: now uses correct property name
    .addTo(this.#map)
    .bindPopup(L.popup({
      maxWidth: 250, 
      minHeight: 100,
      autoClose: false,
      closeOnClick: false, 
      className: `${workout.type}-popup`
    }))
    .setPopupContent(workout.distance.toString())
    .openPopup();
  }
}

const application = new App();