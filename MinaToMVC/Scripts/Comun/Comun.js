var seconds = 0;

function GetMVC(url, callBackResult) {
    AddLoader();
    $.ajax({
        url: url,
        cache: false,
        type: 'GET',
        dataType: 'json',
        contentType: "application/json;",
        success: function (r) {
            RemoveLoader();
            callBackResult(r);
        },
        error: function (e) {
            RemoveLoader();
            callBackResult(e);
        }
    });
}

function GetParamMVC(url, parameters, callBackResult) {
    AddLoader();
    $.ajax({
        url: url,
        cache: false,
        type: 'GET',
        dataType: 'json',
        data: parameters,
        success: function (r) {
            RemoveLoader();
            callBackResult(r);
        },
        error: function (e) {
            RemoveLoader();
            callBackResult(e);
        }
    });
}

function PostMVC(url, parameters, callBackResult) {
    AddLoader();
    $.ajax({
        url: url,
        cache: false,
        type: 'POST',
        dataType: 'json',
        data: parameters,
        success: function (r) {
            RemoveLoader();
            callBackResult(r);
        },
        error: function (e) {
            RemoveLoader();
            callBackResult(e);
        }
    });
}

function PostFileMVC(url, parameters, callBackResult) {
    AddLoader();

    var formData = new FormData();
    $.each(parameters, function (i, v) {
        formData.append(v.Name, v.Value);
    });

    $.ajax({
        type: 'POST',
        url: url,
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (r) {
            RemoveLoader();
            callBackResult(r);
        },
        error: function (e) {
            RemoveLoader();
            callBackResult(e);
        }
    });
}

function PostViewMVC(url, parameters, callBackResult) {
    AddLoader();
    $.ajax({
        url: url,
        cache: false,
        type: 'POST',
        data: parameters,
        dataType: 'text',
        success: function (r) {
            RemoveLoader();
            callBackResult(r);
        },
        error: function (e) {
            RemoveLoader();
            callBackResult(e);
        }
    });
}

function LogOut() {
    GetMVC("/Home/LogOut", function () {
        window.location = "/Home/Index";
    });
}

function formatDate(date) {

    if (date !== null) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }
    else {
        return null;
    }
}

function formatDateTime(dd) {
    if (date !== null) {
        var d = new Date(dd);
        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        var date = d.getDate() + " " + month[d.getMonth()] + ", " + d.getUTCFullYear();
        var time = d.toLocaleTimeString().toLowerCase();

        return date + " at " + time;
    }
    else {
        return null;
    }
}

function formatMoney(data) {
    return ('$' + parseFloat(data, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")).toString();
}

function formatEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function MapingPropertiesDataTable(nameTable, array) {
    $('#' + nameTable).dataTable().fnClearTable();
    if (array.length !== 0) {
        $('#' + nameTable).dataTable().fnAddData(array);
    }
}

function AddLoader() {
    $("#contentLoader").append('<div class="modal-backdrop fade show"></div>');
    $("#loader").show();
}

function RemoveLoader() {
    $("#loader").hide();
    $("#contentLoader").empty();
}

function secondPassed() {

    var minutes = Math.round((seconds - 30) / 60); //calcula el número de minutos
    var remainingSeconds = seconds % 60; //calcula los segundos
    //si los segundos usan sólo un dígito, añadimos un cero a la izq
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }
    document.getElementById('countdown').innerHTML = minutes + ":" + remainingSeconds;
    if (seconds === 0) {
        window.location.reload();
    } else {
        seconds--;
    }
}

function Unidades(num) {

    switch (num) {
        case 1: return "UN";
        case 2: return "DOS";
        case 3: return "TRES";
        case 4: return "CUATRO";
        case 5: return "CINCO";
        case 6: return "SEIS";
        case 7: return "SIETE";
        case 8: return "OCHO";
        case 9: return "NUEVE";
    }

    return "";
}

function Decenas(num) {

    decena = Math.floor(num / 10);
    unidad = num - (decena * 10);

    switch (decena) {
        case 1:
            switch (unidad) {
                case 0: return "DIEZ";
                case 1: return "ONCE";
                case 2: return "DOCE";
                case 3: return "TRECE";
                case 4: return "CATORCE";
                case 5: return "QUINCE";
                default: return "DIECI" + Unidades(unidad);
            }
        case 2:
            switch (unidad) {
                case 0: return "VEINTE";
                default: return "VEINTI" + Unidades(unidad);
            }
        case 3: return DecenasY("TREINTA", unidad);
        case 4: return DecenasY("CUARENTA", unidad);
        case 5: return DecenasY("CINCUENTA", unidad);
        case 6: return DecenasY("SESENTA", unidad);
        case 7: return DecenasY("SETENTA", unidad);
        case 8: return DecenasY("OCHENTA", unidad);
        case 9: return DecenasY("NOVENTA", unidad);
        case 0: return Unidades(unidad);
    }
}

function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
        return strSin + " Y " + Unidades(numUnidades)

    return strSin;
}

function Centenas(num) {
    centenas = Math.floor(num / 100);
    decenas = num - (centenas * 100);

    switch (centenas) {
        case 1:
            if (decenas > 0)
                return "CIENTO " + Decenas(decenas);
            return "CIEN";
        case 2: return "DOSCIENTOS " + Decenas(decenas);
        case 3: return "TRESCIENTOS " + Decenas(decenas);
        case 4: return "CUATROCIENTOS " + Decenas(decenas);
        case 5: return "QUINIENTOS " + Decenas(decenas);
        case 6: return "SEISCIENTOS " + Decenas(decenas);
        case 7: return "SETECIENTOS " + Decenas(decenas);
        case 8: return "OCHOCIENTOS " + Decenas(decenas);
        case 9: return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
}

function Seccion(num, divisor, strSingular, strPlural) {
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    letras = "";

    if (cientos > 0)
        if (cientos > 1)
            letras = Centenas(cientos) + " " + strPlural;
        else
            letras = strSingular;

    if (resto > 0)
        letras += "";

    return letras;
}

function Miles(num) {
    divisor = 1000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMiles = Seccion(num, divisor, "UN MIL", "MIL");
    strCentenas = Centenas(resto);

    if (strMiles == "")
        return strCentenas;

    return strMiles + " " + strCentenas;
}

function Millones(num) {
    divisor = 1000000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMillones = Seccion(num, divisor, "UN MILLON", "MILLONES");
    strMiles = Miles(resto);

    if (strMillones == "")
        return strMiles;

    return strMillones + " " + strMiles;
}

function NumeroALetras(num) {
    var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: "",
        letrasMonedaPlural: 'PESOS',
        letrasMonedaSingular: 'PESO',

        letrasMonedaCentavoPlural: "CENTAVOS",
        letrasMonedaCentavoSingular: "CENTAVO"
    };

    if ($("#Coin").val() === "MXN") {
        data.letrasMonedaPlural = "PESOS";
        data.letrasMonedaSingular = "PESO";
    }
    else {
        data.letrasMonedaPlural = "DOLARES";
        data.letrasMonedaSingular = "DOLAR";
    }

    if (data.centavos > 0) {
        data.letrasCentavos = "CON " + (function () {
            if (data.centavos == 1)
                return Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
            else
                return Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
        })();
    };

    if (data.enteros == 0)
        return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
        return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
    else
        return Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
}


