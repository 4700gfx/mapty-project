'use strict';
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

if(navigator.geolocation){
  //Accesses Geolocation API 
  navigator.geolocation.getCurrentPosition(
    function(position){
      //Destructuring The Position Object - Success
      const {latitude, longitude} = position.coords;
      console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);
      const coords = [latitude, longitude];
      console.log(coords);
      
      const map = L.map('map').setView(coords, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      
      map.on('click', function(mapEvent){
        console.log(mapEvent.latlng)
        const {lat, lng} = mapEvent.latlng

          L.marker([lat, lng]).addTo(map)
            .bindPopup(L.popup({
              maxWidth: 250, 
              maxHeight: 200, 
              autoClose: false,
              closeOnClick: false, 
              className: 'running-popup'
            }))
            .setPopupContent('Workout Completed Here')
            .openPopup();
        })
    }, 
    function(){
      //Error Message - Failed 
      alert('Could Not Get Your Location');
    }
  );
}