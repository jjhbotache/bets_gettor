import { apiRoute } from "../const/consts";

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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

export function surebetsPerMinute(surebets) {
  const contador = {}; // Objeto para almacenar el conteo

  // Itera sobre cada objeto en el array de surebets
  surebets.forEach((surebet) => {
    const minuto = Math.floor(surebet.match_time_minutes); // Obtiene el minuto redondeando hacia abajo
    // Verifica si el minuto ya existe en el contador
    if (contador[minuto]) {
      contador[minuto]++; // Incrementa el conteo si ya existe
    } else {
      contador[minuto] = 1; // Inicializa el conteo en 1 si es la primera vez
    }
  });

  // Convierte el objeto contador en un array de objetos con las propiedades "minuto" y "cantidad de surebets"
  const resultado = Object.entries(contador).map(([minuto, cantidad]) => ({
    "M. time": parseInt(minuto),
    "surebetsAmount": cantidad,
  }));

  return resultado;
}

export function calculateAverage(list,propertyToAverage,numberToAverage) {
  console.log("list",list);
  return list.map((item,index)=>{
    const indexFrom = index-numberToAverage || 0;
    const indexTo = index+numberToAverage || list.length;
    // create a list of the values to average
    const valuesToAverage = list.map(i=>i[propertyToAverage]).slice(indexFrom,indexTo);
    // reduce the list to get the sum
    const average = valuesToAverage.reduce((accumulator,currentValue)=>accumulator+currentValue,0) / valuesToAverage.length;

    const objToReturn ={
      ...item,
      [propertyToAverage]:average,
    };
    return objToReturn;
  })
}
