
function getMinTemp(array) {
    let tempMin = [];
    array.forEach(function (item) {
        tempMin.push(Number(item.main.temp_min));
    });
    return Math.min(...tempMin) + "°c";
}

function getMaxTemp(array) {
    let tempMax = [];
    array.forEach(function (item) {
        tempMax.push(Number(item.main.temp_max));
    });
    return Math.max(...tempMax) + "°c";
}

function getAvgTemp(array) {
    let tempSum = 0;
    let i = 0;
    array.forEach(function (item) {
        tempSum += (Number(item.main.temp));
        i++
    });
    return Math.round(tempSum / i) + "°c";
}

function getAvgHumidity(array) {
    let HumSum = 0;
    let i = 0;
    array.forEach(function (item) {
        HumSum += (Number(item.main.humidity));
        i++
    });
    return Math.round(HumSum / i) + "%";
}

function getModeVal(array, val) {
    // take all values to array valueAll depends on the (array/description)
    let valueAll = [];
    if (val === "icon") {
        array.forEach(function (item) {
            valueAll.push(item.weather[0].icon.slice(0, 2));
        });
    } else if (val === "description") {
        array.forEach(function (item) {
            valueAll.push(item.weather[0].description);
        });
    }

    // find the Freq for each value
    let valFreq = {};
    for (let i = 0; i < valueAll.length; i++) {
        if (valFreq[valueAll[i]] !== undefined) {
            valFreq[valueAll[i]]++;
        } else {
            valFreq[valueAll[i]] = 1;
        }
    }

    // get the Mode value
    let freq = 0;
    let modeVal, key;
    for (key in valFreq) {
        if (valFreq[key] > freq) {
            freq = valFreq[key];
            modeVal = key;
        }
    }
    return modeVal
}

window.addEventListener('load', (event) => { // When the page is loaded, hide the result part
    document.getElementById("result").style.visibility = 'hidden';
});

document.getElementById("btn-search").addEventListener("click", function () {

    // Take input and capitalize the first letter
    let city = document.getElementById("city").value;
    city = city.charAt(0).toUpperCase() + city.slice(1);

    // fetch API data with URL(made by the city name)
    fetch(" https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=ce24f6ae35615d5b8208834c2524de00")

        .then(function (response) {
            if (response.ok === false) {     // fail to fetch => error. go to .catch part
                throw('Enter valid city');
            }
            return response.json();
        })

        .then(data => {
            // Show the result part and display city name in the 1st line of the result
            document.getElementById("result").style.visibility = 'visible';

            // get the dates of the 5 days from today
            let date = [];
            const days = 5;
            for (let i = 0; i < days; i++) {
                let day = new Date();
                day.setTime(day.getTime() + 86400000 * i);    // + 1 day
                date.push(day.toDateString());
            }

            // Sort the lists of the data according to the date
            let listD0 = [], listD1 = [], listD2 = [], listD3 = [], listD4 = [];

            data.list.forEach(function (list) {

                let DateOfTheList = new Date(list.dt_txt).toDateString();

                switch (DateOfTheList) {
                    case date[0]:
                        listD0.push(list);
                        break;
                    case date[1]:
                        listD1.push(list);
                        break;
                    case date[2]:
                        listD2.push(list);
                        break;
                    case date[3]:
                        listD3.push(list);
                        break;
                    case date[4]:
                        listD4.push(list);
                        break;
                    default:
                        return;
                }
            });

            // Calculate and display the forecast info per date
            let future = [listD0, listD1, listD2, listD3, listD4];

            for(let i=1; i<future.length; i++){
                document.getElementsByClassName("date")[i].innerHTML = date[i];
                document.getElementsByClassName("icon")[i].src = "http://openweathermap.org/img/wn/" + getModeVal(future[i], "icon") + "d" + "@2x.png";
                document.getElementsByClassName("icon")[i].alt = getModeVal(future[i], "description")+" icon";
                document.getElementsByClassName("description")[i].innerHTML = getModeVal(future[i], "description");
                document.getElementsByClassName("temp")[i].innerHTML = getAvgTemp(future[i]);
                document.getElementsByClassName("temp-min")[i].innerHTML = getMinTemp(future[i]);
                document.getElementsByClassName("temp-max")[i].innerHTML = getMaxTemp(future[i]);
                document.getElementsByClassName("humidity")[i].innerHTML = getAvgHumidity(future[i]);
            }

            // Today - always the latest value, data.list[0] / no list for today hours(21.00-23.59) => can take tomorrow 00.00
            document.getElementsByClassName("date")[0].innerHTML = date[0];
            document.getElementsByClassName("icon")[0].src = "http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png";
            document.getElementsByClassName("icon")[0].alt = data.list[0].weather[0].description+" icon";
            document.getElementsByClassName("description")[0].innerHTML = data.list[0].weather[0].description;
            document.getElementsByClassName("temp")[0].innerHTML = Math.round(data.list[0].main.temp) + '°c';
            document.getElementsByClassName("temp-min")[0].innerHTML = data.list[0].main.temp_min + '°c';
            document.getElementsByClassName("temp-max")[0].innerHTML = data.list[0].main.temp_max + '°c';
            document.getElementsByClassName("humidity")[0].innerHTML = data.list[0].main.humidity + "%";

        })
        .catch(function (error) {
            alert(error);
        });
});


