
var updateTable = function () {
    var table = document.getElementById("infoTable");
    var newEntry = document.createElement("tr");
    var stCol = document.createElement("td");
    var drCol = document.createElement("td");

    stCol.innerText = "alalaal";
    drCol.innerText = "fassad";

    newEntry.appendChild(stCol);
    newEntry.appendChild(drCol);

    table.appendChild(newEntry);
}