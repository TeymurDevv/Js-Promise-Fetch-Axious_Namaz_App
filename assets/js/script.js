document.getElementById('dailyBtn').addEventListener('click', fetchDailyData);
document.getElementById('monthlyBtn').addEventListener('click', fetchMonthlyData);

function fetchDailyData() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    fetch(`http://api.aladhan.com/v1/calendar/${year}/${month}?latitude=51.508515&longitude=-0.1254872&method=2`)
        .then(response => response.json())
        .then(data => {
            const dailyData = data.data.find(item => item.date.gregorian.day == day);
            displayDailyResults([dailyData]);
        })
        .catch(error => console.error('Günlük veriləri çəkərkən xəta:', error));
}

function fetchMonthlyData() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    fetch(`http://api.aladhan.com/v1/calendar/${year}/${month}?latitude=51.508515&longitude=-0.1254872&method=2`)
        .then(response => response.json())
        .then(data => {
            displayMonthlyResults(data.data);
        })
        .catch(error => console.error('Aylıq veriləri çəkərkən xəta:', error));
}

function displayDailyResults(data) {
    const resultsDiv = document.getElementById('results');
    const dailyResults = document.getElementById('dailyResults');
    dailyResults.innerHTML = '';

    data.forEach(day => {
        const date = day.date.gregorian.date;
        const timings = day.timings;
        
        const dayCard = document.createElement('div');
        dayCard.classList.add('card', 'mb-3');

        const dayCardBody = document.createElement('div');
        dayCardBody.classList.add('card-body');
        
        const dateHeader = document.createElement('h2');
        dateHeader.classList.add('card-title');
        dateHeader.textContent = `Tarix: ${date}`;
        dayCardBody.appendChild(dateHeader);

        for (const [key, value] of Object.entries(timings)) {
            const timePara = document.createElement('p');
            timePara.classList.add('card-text');
            timePara.textContent = `${key}: ${value}`;
            dayCardBody.appendChild(timePara);
        }

        dayCard.appendChild(dayCardBody);
        dailyResults.appendChild(dayCard);
    });

    document.getElementById('monthlyResults').classList.add('d-none');
    dailyResults.classList.remove('d-none');
    resultsDiv.classList.remove('d-none');
}

function displayMonthlyResults(data) {
    const resultsDiv = document.getElementById('results');
    const monthlyResults = document.getElementById('monthlyResults');
    monthlyResults.innerHTML = '';

    const tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped', 'table-hover');
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Tarix', 'Sübh', 'Gün çıxır', 'Zöhr', 'Əsr', 'Gün batır', 'Məğrib', 'İşa', 'İmsak', 'Gecə yarısı', 'Birinci üçdə biri', 'Son üçdə biri'];
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    data.forEach(day => {
        const row = document.createElement('tr');
        const date = day.date.gregorian.date;
        const timings = day.timings;

        const timingsArray = [date, timings.Fajr, timings.Sunrise, timings.Dhuhr, timings.Asr, timings.Sunset, timings.Maghrib, timings.Isha, timings.Imsak, timings.Midnight, timings.Firstthird, timings.Lastthird];
        
        timingsArray.forEach(time => {
            const td = document.createElement('td');
            td.textContent = time;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    monthlyResults.appendChild(tableContainer);

    document.getElementById('dailyResults').classList.add('d-none');
    monthlyResults.classList.remove('d-none');
    resultsDiv.classList.remove('d-none');
}
