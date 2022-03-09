let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Validar formulario
    const camposvacios = [mesa, hora].some(campo => campo ==='');

    if(camposvacios){
        const existe = document.querySelector('.invalid-feedback');
         if(!existe){
             //Si hay al menos un campo vacio
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';

            const body = document.querySelector('.modal-body form');
            body.appendChild(alerta);

            setTimeout(()=>{
                alerta.remove();
            }, 3000)
        }

         return;
    }

    //Asignar datos del formulario al cliente
    cliente = {...cliente, mesa, hora}
    
    //Ocultar Modal
    const modalForm = document.querySelector('#formulario');
    const modal = bootstrap.Modal.getInstance(modalForm);
    modal.hide();

    mostrarSecciones();

    //Obtener platillos de la API
    obtenerPlatillos();
}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));

}

function obtenerPlatillos(){
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatillos(resultado))
}

function mostrarPlatillos(platillos){
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`
        inputCantidad.classList.add('form-control');

        //Función que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);

            //El spread operator crea una copia del objeto y estamos agregando al objeto la cantidad
            //Estamos pasando como parametro un objeto
            agregarPlatillo({...platillo, cantidad});
        }

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');

        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);


        contenido.appendChild(row);
    });
}

function agregarPlatillo(producto){

    //Extraer el pedido actual (destructuring)
    let {pedido} = cliente;

    //Revisar que la cantidad sea mayor a cero
    if(producto.cantidad>0){

        //Comprueba si el elemento ya existe en el array
        if(pedido.some(articulo => articulo.id === producto.id)){
            //El articulo ya existe, se necesita actualizar
            const pedidoActualizado = pedido.map(articulo =>{
                if(articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad;
                }

                return articulo;
            });
            
            //Se asigna un nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        }
        else{
            //El articulo no existe, lo agregamos al array de pedido
            cliente.pedido = [...pedido, producto];
        }

        
    }
    else{
        //Eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
    }

    //Limpiar el codigo HTML previo
    limpiarHTML();

    if(cliente.pedido.length){
        //Mostrar el resumen
        actualizarResumen();
    }
    else{
        mensajePedidoVacio();
    }
}

function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    //Información de la mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //Indformación de la hora
    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    //Agregar a los elementos padre
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la sección 
    const heading = document.createElement('h3');
    heading.textContent = 'Platillos consumidos';
    heading.classList.add('my-4', 'text-center');

    //Iterar sobre el arreglo de pedidos
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');
    
    const {pedido} = cliente;
    pedido.forEach(articulo =>{
        const {nombre, cantidad, precio, id} = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        //Agregar el nombre del articulo
        const nombreElemento = document.createElement('h4');
        nombreElemento.classList.add('my-4');
        nombreElemento.textContent = nombre;

        //Agregar la cantidad
        const cantidadElemento = document.createElement('p');
        cantidadElemento.classList.add('fw-bold');
        cantidadElemento.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        //Agregar la precio
        const precioElemento = document.createElement('p');
        precioElemento.classList.add('fw-bold');
        precioElemento.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$ ${precio}`;

        //Agregar subtotal
        const subtotalElemento = document.createElement('p');
        subtotalElemento.classList.add('fw-bold');
        subtotalElemento.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        //Boton de eliminar
        const eliminar = document.createElement('button');
        eliminar.classList.add('btn', 'btn-danger');
        eliminar.textContent = 'Eliminar el pedido';

        //Función para eliminar pedido
        eliminar.onclick = function(){
            eliminarProducto(id);
        }

        //Agregar valores a sus contenedores
        cantidadElemento.appendChild(cantidadValor);
        precioElemento.appendChild(precioValor);
        subtotalElemento.appendChild(subtotalValor);

        //Agregar elementos al li
        lista.appendChild(nombreElemento);
        lista.appendChild(cantidadElemento);
        lista.appendChild(precioElemento);
        lista.appendChild(subtotalElemento);
        lista.appendChild(eliminar);

        //Agregar lista al grupo principal
        grupo.appendChild(lista);
    });

    //Agregar al contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //Mostrar formulario de propinas
    formularioPropinas();

}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');

    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal(precio, cantidad) {  
    return `$ ${precio * cantidad}`;
}

function eliminarProducto(id){
    const {pedido} = cliente;

    const resultado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

    limpiarHTML();

    if(cliente.pedido.length){
        //Mostrar el resumen
        actualizarResumen();
    }
    else{
        mensajePedidoVacio();
    }

    //Resetar inputs
    const inputEliminado = document.querySelector(`#producto-${id}`);
    inputEliminado.value = 0
}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = "Añade los elementos del pedido";

    contenido.appendChild(texto);
}

function formularioPropinas(){
    const contenido = document.querySelector('#resumen .contenido');
    
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');


    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    //Radio buttom 10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10label = document.createElement('label');
    radio10label.textContent = '10%';
    radio10label.classList.add('form-check-label');

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check'); 

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10label);

    //Radio buttom 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25label = document.createElement('label');
    radio25label.textContent = '25%';
    radio25label.classList.add('form-check-label');

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check'); 

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25label);

    //Radio buttom 50%
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = '50';
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const radio50label = document.createElement('label');
    radio50label.textContent = '50%';
    radio50label.classList.add('form-check-label');

    const radio50Div = document.createElement('div');
    radio50Div.classList.add('form-check'); 

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50label);

    //Agregar al div principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);

    //Agregarlo al formulario
    formulario.appendChild(divFormulario);

    contenido.appendChild(formulario);

}

function calcularPropina(){

    const {pedido} = cliente;
    let subtotal = 0;

    //Calcular el subtotal a pagar
    pedido.forEach(articulo=>{
        subtotal += articulo.cantidad * articulo.precio;
    });

    //Seleccionar el radio buttom
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    //Calcular la propina
    const propina = ((subtotal * parseInt(propinaSeleccionada))/100);

    //Calcular el total a pagar
    const total = subtotal + propina;

    mostrarTotal(subtotal, total, propina);

}

function mostrarTotal(subtotal, total, propina) {  

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar')

    //Subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$ ${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    //Propina
    const propinasParrafo = document.createElement('p');
    propinasParrafo.classList.add('fs-3', 'fw-bold', 'mt-2');
    propinasParrafo.textContent = 'Propina: ';

    const propinasSpan = document.createElement('span');
    propinasSpan.classList.add('fw-normal');
    propinasSpan.textContent = `$ ${propina}`;

    propinasParrafo.appendChild(propinasSpan);

    //Total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2');
    totalParrafo.textContent = 'Propina: ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$ ${total}`;

    totalParrafo.appendChild(totalSpan);

    //Eliminar el ultimo resultado
    const totalPagarDIV = document.querySelector('.total-pagar');

    if(totalPagarDIV){
        totalPagarDIV.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinasParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}