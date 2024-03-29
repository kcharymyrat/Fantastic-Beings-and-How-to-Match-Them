console.log("works")

const mapTable = document.querySelector("#map");

window.renderMap = (rowsCount, colsCount) => {
    for (let i = 0; i < rowsCount; i++) {
        const tr = document.createElement("tr")
        for (let j = 0; j < colsCount; j++) {
            const td = document.createElement("td");
            td.classList.add("cell");
            tr.appendChild(td);
        }
        mapTable.appendChild(tr);
    }
}

window.clearMap = () => {
    while (mapTable.firstChild) {
        mapTable.removeChild(mapTable.firstChild);
    }
    console.log(mapTable);
}

window.renderMap(5, 5)
