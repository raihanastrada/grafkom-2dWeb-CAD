// function activateJumlahSisiPolygon(event) {
//     var inputSisiPolygon = document.getElementById("polygonSisi")
//     if (event.target.id === "polygon" && getOption() === "create") {
//         inputSisiPolygon.style.display = "block";
//     } else {
//         inputSisiPolygon.style.display = "none";
//     }
// }

// function activateProporsiRectangle(event) {
//     var proporsiX = document.getElementById("proporsiXRectangle")
//     var proporsiY = document.getElementById("proporsiYRectangle")
//     var inputSisiPolygon = document.getElementById("polygonSisi")
//     if (event.target.id === "rectangle" && getOption() === "create") {
//         proporsiX.style.display = "";
//         proporsiY.style.display = "block";
//         inputSisiPolygon.style.display = "none";
//     } else {
//         proporsiX.style.display = "none";
//         proporsiY.style.display = "none";
//     }
// }

// document.querySelectorAll("input[name='shape']").forEach((input) => {
//     input.addEventListener('change', activateJumlahSisiPolygon);
//     input.addEventListener('change', activateProporsiRectangle);
// });