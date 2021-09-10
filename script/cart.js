document.addEventListener("DOMContentLoaded", function() {
    loadProducts();
    if (document.querySelector("#imie")) {
        wczytajDane();
    }
});

var products = [];

function addProduct(id) {
    let lista = JSON.parse(localStorage.getItem('lista'));
    if (lista == null)
        lista = [];

    lista.push(id);

    localStorage.setItem("lista", JSON.stringify(lista));
    document.querySelector("#cart-value").innerHTML = calculateCartValue(products) + " PLN";
}

function zapiszDane() {
    let dane = {};
    dane.imie = document.querySelector('#imie').value;
    dane.nazwisko = document.querySelector('#nazwisko').value;
    dane.email = document.querySelector('#email').value;
    wybranaPlec = document.querySelector('input[name="plec"]:checked');
    if (wybranaPlec)
        dane.plec = document.querySelector('input[name="plec"]:checked').value;
    else
        dane.plec = "";
    dane.miejscowosc = document.querySelector('#miejscowosc').value;
    dane.ulica = document.querySelector('#ulica').value;
    dane.nrBud = document.querySelector('#nrBud').value;
    if (document.querySelector('#regulamin').checked)
        dane.regulamin = true;
    else
        dane.regulamin = false;
    localStorage.setItem("dane", JSON.stringify(dane));
}

function wczytajDane() {
    let dane = JSON.parse(localStorage.getItem('dane'));
    if (dane != null) {
        document.querySelector('#imie').value = dane.imie;
        document.querySelector('#nazwisko').value = dane.nazwisko;
        document.querySelector('#email').value = dane.email;
        document.querySelector('input[name="plec"]:checked');
        if (dane.plec == "Mężczyzna")
            document.querySelector('#mezczyzna').checked = true;
        else if (dane.plec == "Kobieta")
            document.querySelector("#kobieta").checked = true;
        document.querySelector('#miejscowosc').value = dane.miejscowosc;
        document.querySelector('#ulica').value = dane.ulica;
        document.querySelector('#nrBud').value = dane.nrBud;
        if (dane.regulamin) {
            document.querySelector("#regulamin").checked = true;
        }
    }

}

function spoofSubmit() {
    let text = "";
    let list = JSON.parse(localStorage.getItem('lista'));
    if (list == null)
        list = [];

    let dane = JSON.parse(localStorage.getItem('dane'));

    if (list.length == 0) {
        text = "Koszyk jest pusty!"
    } else {
        text = "<h3>Produkty w koszyku:</h3>";
        list.forEach(productID => {
            product = getProductById(products, productID);
            text += `${product.name}<br>`
        })
        text += `<h3>Dane klienta:</h3>
        Imię: ${dane.imie}<br>
        Nazwisko: ${dane.nazwisko}<br>
        Płeć: ${dane.plec}<br>
        Adres e-mail: ${dane.email}<br>
        Adres dostawy: ${dane.ulica} ${dane.nrBud}, ${dane.miejscowosc}<br>
        `
    }

    document.getElementById('modal-dane').innerHTML = text;
    var myModal = new bootstrap.Modal(document.getElementById('modal-submit'))
    myModal.show();
}

function rmProduct(i) {
    let lista = JSON.parse(localStorage.getItem('lista'));
    if (lista == null)
        lista = [];

    lista.splice(i, 1);

    localStorage.setItem("lista", JSON.stringify(lista));
    document.querySelector("#cart").innerHTML = showCart();
    document.querySelector("#cart-value").innerHTML = calculateCartValue(products) + " PLN";
    document.querySelector("#totalPrice").innerHTML = "Suma: " + calculateCartValue(products) + " PLN";
}

function showCart() {
    let list = JSON.parse(localStorage.getItem('lista'));
    let text = "";
    if (list == null)
        list = [];

    if (list.length == 0) {
        text = "<h3>Koszyk jest pusty</h3>"
    } else {
        let productCount = 0;
        text = `

    <table class="table">
    <thead>
    <tr>
    <th scope="col">#</th>
    <th scope="col">Nazwa produktu</th>
    <th scope="col">Cena</th>
    <th scope="col">Usuń</th>
    </tr>
    </thead>
    <tbody>`;

        list.forEach(productID => {
            productCount++;
            product = getProductById(products, productID);
            text +=
                `<tr>
            <th scope="row">${productCount}</th>
                <td>${product.name}</td>
                <td>${product.price} PLN</td>
                <td><button class="btn btn-danger" onclick="rmProduct(${productCount-1});">USUŃ</button></td>
            </tr>`;
        })

        text += `</tbody></table>`
    }
    return text;
}


function getProductById(products, productID) {
    return (products.find(product => product.id == productID));
}

function showProducts(productList) {
    let text = ""
    productList.forEach(product => {
        text += `
        <div class="col-sm-12 col-md-6 mb-3">
            <div class="card product-card">
                <img class="card-img-top product-image" src="${product.image}" style="height: 300px; object-fit: contain" alt="Card image cap">
                <div class="card-body">
                    <h2 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <h6>${product.price} PLN</h6>
                    <button class="btn btn-primary" onclick="addProduct(${product.id});">Dodaj do koszyka</a>
                </div>
            </div>
        </div>
        `
    })
    text += `</div>`
    return text;
}

async function loadProducts() {
    fetch("data/products.json")
        .then(response => { return response.json(); })
        .then(objects => {
            products = objects; // Save products list to variable
            document.querySelector('#cart-value').innerHTML = calculateCartValue(products) + " PLN";
            // If page contains product list, list them
            temp = document.querySelector('#productList');
            if (temp) {
                temp.innerHTML = showProducts(objects);
            }
            temp = document.querySelector('#cart');
            if (temp) {
                temp.innerHTML = showCart();
            }
            temp = document.querySelector('#totalPrice');
            if (temp) {
                temp.innerHTML = "Suma: " + calculateCartValue(objects) + " PLN";
            }
        })
}

function calculateCartValue(ducts) {
    let cart = JSON.parse(localStorage.getItem('lista'));
    if (cart == null)
        cart = [];

    let totalPrice = 0;
    cart.forEach(productID => {
        let product = getProductById(ducts, productID);
        totalPrice += parseFloat(product.price);
    })
    return totalPrice.toFixed(2);
}