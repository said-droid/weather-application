/*document.getElementById('run').addEventListener('click', ()=>{

    let city = document.getElementById('city').value;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},be&appid=ce24f6ae35615d5b8208834c2524de00&units=metric`)
    .then(data => data.json())
    .then(weather => console.log(weather))
    .catch(error => console.error(error));
});*/

const api = {
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=',
    apiKey: '&appid=ce24f6ae35615d5b8208834c2524de00',
    unit: '&units=metric'
}

const input = document.querySelector('.inputfield');
input.addEventListener('keypress', setQuery);

function setquery(evt){
    if(evt.keyCode === 13){
        getResults(input.value);
    }
}

function getResults(query){
    fetch()
}

