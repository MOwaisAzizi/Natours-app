
/* eslint-disable */
// const data = JSON.parse(document.getElementById('map').dataset.locations)
// console.log(data);
// console.log(L);

 export const displayMap = ()=>{
    
    document.addEventListener("DOMContentLoaded", function () {
        let map = L.map('map').setView([51.505, -0.09], 13);
    
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    
        L.marker([51.505, -0.09]).addTo(map)
            .bindPopup('نقشه ساده Leaflet')
            .openPopup();
    });
 }
