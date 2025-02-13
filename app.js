// 구글 스프레드시트 ID (고정)
const sheetId = "1L5BUx5Ykewx4RPa9awZdKnKJIUFHU7zLrURMEegwJ2I";

// 각 시트의 gid 값 (여러 시트의 gid 값을 넣음)
const gids = [
        { name: "Tab 1", gid: 187466876 },
        { name: "Tab 2", gid: 131920880 },
        { name: "Tab 3", gid: 550624426 }
];

// 탭 버튼을 동적으로 생성하는 함수
function createTabs() {
    const tabsDiv = document.getElementById("tabs");
    gids.forEach(tab => {
        const button = document.createElement("button");
        button.textContent = tab.name;
        button.onclick = () => loadData(tab.gid);  // 각 버튼에 gid 값에 맞는 클릭 이벤트 추가
        tabsDiv.appendChild(button);
    });
}

// 특정 gid에 해당하는 데이터를 불러오는 함수
function loadData(gid) {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&id=${sheetId}&gid=${gid}`;
    
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            // CSV 데이터 파싱
            const parsedData = Papa.parse(data, { header: true });

            // 테이블 헤더 생성
            const headers = parsedData.meta.fields;
            const headerRow = document.querySelector('#data-table thead tr');
            headerRow.innerHTML = '';  // 기존 헤더 지우기
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });

            // 테이블 바디에 데이터 추가
            const tableBody = document.querySelector('#data-table tbody');
            tableBody.innerHTML = '';  // 기존 데이터 지우기
            parsedData.data.forEach(row => {
                const tr = document.createElement('tr');
                Object.values(row).forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching CSV:', error));
}

// 페이지가 로드될 때 탭 버튼 생성
createTabs();

// 기본적으로 첫 번째 탭 데이터를 불러오게 설정
loadData(gids[0].gid);
