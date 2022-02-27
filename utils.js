function hexToRGB(value) {
    // #XXXXXX -> ["XX", "XX", "XX"]
    var value = value.match(/[A-Za-z0-9]{2}/g);

    // ["XX", "XX", "XX"] -> [n, n, n]
    value = value.map(function(v) { return parseInt(v, 16) });
    value = value.map(function(v) { return (v/255).toFixed(3)})
    return value
}

function getColor() {
    var colorChoice = document.getElementById("color").value
    colorChoice = hexToRGB(colorChoice)
    return colorChoice;
}

function getOption(){
    var options = document.getElementsByName("option")
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            return options[i].value
        }
    }
}

function getPolygonSisi() {
    var polygonSisi = document.getElementById("polygonSisi").value
    return polygonSisi
}

function getShapeSize() {
    var shapeSize = document.getElementById("widthSlide").value
    return shapeSize
}

function getProporsiXYRectangle() {
    var proporsiXInput = parseInt(document.getElementById("proporsiXRectangle").value)
    var proporsiYInput = parseInt(document.getElementById("proporsiYRectangle").value)
    return [proporsiXInput, proporsiYInput]
}

function saveFile(params) {
    // console.log("Save button clicked")
    const a = document.createElement('a');
    const isi = [
        "Persegi Panjang: ",
        persegiPanjang,
        "Persegi: ",
        persegi,
        "Garis: ",
        garis,
        "Polygon: ",
        polygon
    ]
    const blob = new Blob([JSON.stringify(isi)]);
    a.href = URL.createObjectURL(blob);
    a.download = 'CAD-Download';
    a.click();
    // console.log("HERE")
}

function loadFile(params) {
    // console.log("Load button clicked")
    var file = document.getElementById("load")
    // console.log(file.value)

}

var file = document.getElementById("load")

file.onchange = function(event) {
    var inputFile = file.files[0]
    if (inputFile) {
        var reader = new FileReader();
        reader.readAsText(inputFile);
        reader.onload = function (evt) {
            var isi = JSON.parse(evt.target.result);
            for (let i = 0; i < isi.length; i++) {
                if (i%2 === 0) {
                    if (isi[i] === "Persegi Panjang: ") {
                        i = i + 1
                        persegiPanjang = []
                        persegiPanjang = isi[i]
                    } else if (isi[i] === "Persegi: ") {
                        i = i + 1
                        persegi = []
                        persegi = isi[i]
                    } else if (isi[i] === "Garis: ") {
                        i = i + 1
                        garis = []
                        garis = isi[i]
                    } else if (isi[i] === "Polygon: ") {
                        i = i + 1
                        polygon = []
                        polygon = isi[i]
                    }
                }
            }
            drawCanvas()
        }
    }
}

function getShape() {
    var shapeChoice = document.getElementsByName("shape");
    for (let i = 0; i < shapeChoice.length; i++) {
        if (shapeChoice[i].checked) {
            return shapeChoice[i].value
        }
    }
}

function displayHelp() {
    var x = document.getElementById("display-help");
    var buttonPetunjuk = document.getElementById("petunjuk")
    if (x.style.display === "none") {
      x.style.display = "block";
      buttonPetunjuk.innerText = "Tutup Petunjuk"
    } else {
      x.style.display = "none";
      buttonPetunjuk.innerText = "Baca Petunjuk"
    }
  }
