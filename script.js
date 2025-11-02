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
      console.log(latitude, longitude)
    }, 
    function(){
      //Error Message - Failed 
     alert('Could Not Get Your Location') 
    }
  );
}
