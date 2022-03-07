let cliente = {
    mesa: '',
    hora: '',
    pedido: []
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
}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));

}