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
      const {latitude} = position.coords.latitude
      const {longitude} = position.coords.longitude
      console.log(`https://www.google.pt/maps/@${latitude},${longitude}`)
      const map = L.map('map').setView([51.505, -0.09], 13);
 
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker([51.5, -0.09]).addTo(map)
          .bindPopup('A pretty CSS popup.<br> Easily customizable.')
          .openPopup();
          }, 
    function(){
      //Error Message - Failed 
     alert('Could Not Get Your Location') 
    }
  );
}
