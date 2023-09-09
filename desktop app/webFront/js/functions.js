/**
 * modify the element as u need
 * use appendChild to add a child to a parent
 * 
 * @param {*} elementRoute 
 * @returns 
 */
export function importElement(elementRoute) {
  let element;
  return new Promise((resolve, reject) => {
    fetch(elementRoute)
    .then((response) => response.text())
    .then((data) => {
      const template = document.createElement("template");
      template.innerHTML=data;
      element = template.content;
      resolve(element);  
    })
    .catch((error) => {console.log(error);reject();})
  })
}

export function addDots(numero) {
  // made by bign
  // Convertir el número a una cadena
  let cadena = numero.toString();
  // Crear un arreglo vacío para guardar los dígitos con puntos
  let arreglo = [];
  // Contar cuántos dígitos hay en la cadena
  let digitos = cadena.length;
  // Recorrer la cadena de derecha a izquierda
  for (let i = digitos - 1; i >= 0; i--) {
    // Agregar el dígito actual al arreglo
    arreglo.unshift(cadena[i]);
    // Si quedan más de tres dígitos y el índice actual es múltiplo de tres, agregar un punto
    if (i > 0 && (digitos - i) % 3 == 0) {
      arreglo.unshift(".");
    }
  }
  // Unir el arreglo en una nueva cadena y devolverla
  return arreglo.join("");
}