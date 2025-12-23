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

  _setDescription(){
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
  }
}

//Running Class [Child]
class Running extends Workout{
  type = 'running'
  constructor(coords, distance, duration, cadence){
    super(coords, distance, duration)
    this.cadence = cadence;
    this.calculatePace();
    this._setDescription()
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
    this._setDescription();
  }

  calculateSpeed(){
    this.speed = this.distance/this.duration
    return this.speed
  }
}

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
    containerWorkouts.addEventListener('click', this._moveMarker.bind(this))
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
    
    // Leaflet On Click Handler Function
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work =>{
      this._renderWorkout(work)
    });
    
  }
  
  _showForm(mapEv){
    this.#mapEvent = mapEv; 
    console.log(this.#mapEvent.latlng);
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm(){
    // Clear all input fields - THIS NOW CLEARS ALL FIELDS
    inputDistance.value = '';
    inputDuration.value = '';
    inputElevation.value = '';
    inputCadence.value = '';
    
    // Hide form with animation
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField(){
    // Clear BOTH fields every time we toggle
    inputElevation.value = '';
    inputCadence.value = '';
    
    // Then toggle visibility
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

      // FIXED: Only validate the fields that are visible for running
      if(!validateInputs(distance, duration, cadence) || !checkNegativeNums(distance, duration, cadence)){
        return alert('Use a Positive and Valid Number')
      }

      workout = new Running([lat, lng], distance, duration, cadence)
      this.#workouts.push(workout)
    }

    // If Cycling Workout Create Cycling Object
    if(type === 'cycling'){
      const elevation = Number(inputElevation.value)

      // FIXED: Only validate distance and duration for positive (elevation can be negative for downhill)
      if(!validateInputs(distance, duration, elevation) || !checkNegativeNums(distance, duration)){
        return alert('Use a Positive and Valid Number')
      }
      
      workout = new Cycling([lat, lng], distance, duration, elevation)
      this.#workouts.push(workout)
    }
    
    console.log(workout)
    
    //Render Workout on Map and List 
    this._renderWorkoutMarker(workout)
    this._renderWorkout(workout)
    
    //Hide Form + Clear Inputs 
    this._hideForm()
  }
  
  _renderWorkoutMarker(workout){
    // Render Workout on Map as Marker  
    L.marker(workout.coords)  
    .addTo(this.#map)
    .bindPopup(L.popup({
      maxWidth: 250, 
      minHeight: 100,
      autoClose: false,
      closeOnClick: false, 
      className: `${workout.type}-popup`
    }))
    .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
    .openPopup();
  }

  _renderWorkout(workout){
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
        </div>
         <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
         </div>`;
    if(workout.type === 'running'){
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
      `
    } else if (workout.type === 'cycling'){
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(2)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
      `
    }
    
    html += '</li>'
    
    form.insertAdjacentHTML('afterend', html)
  }
  
  _moveMarker(e){
    const workoutElement = e.target.closest('.workout')
    if(!workoutElement) return;

    const workout = this.#workouts.find(work => work.id === workoutElement.dataset.id)

    this.#map.setView(workout.coords, 13, {
      animate: true,
      pan:{
        duration: 1,
      } 
    })
  }

  _setLocalStorage(){
    localStorage.setItem('workouts', JSON.stringify(this.#workouts))
  }



  _getLocalStorage(){
    const data = JSON.parse(localStorage.getItem('workouts'))
  
    if(data){
      this.#workouts = data;
  
      this.#workouts.forEach(work =>{
        this._renderWorkout(work)
      });
    }
   
  
  }

}

const application = new App();