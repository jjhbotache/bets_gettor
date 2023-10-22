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

function groupAndAverageByProperty(objects,groupProperty, averageProperty) {

  // creo una lista de solo los valores de la propiedad de agrupación y la vuelvo set para eliminar duplicados
  const groupPropertyValues =Array.from( new Set( objects.map(obj => obj[groupProperty])));

  // por cada valor de la propiedad de agrupación, creo un objeto con esa propiedad y otra con la propiedad de promedio
  const result = groupPropertyValues.map(groupPropertyValue => (
    {
      [groupProperty]: groupPropertyValue,
      [averageProperty]: objects.filter(obj => obj[groupProperty] === groupPropertyValue).reduce((acc, obj) => acc + obj[averageProperty], 0) / objects.filter(obj => obj[groupProperty] === groupPropertyValue).length
    }
  ))
  return result;
}

export function calculateAverage(list,propertyToAverage,groupProperty,numberToAverage) {
  console.log("list",list);

  const listAveraged = groupAndAverageByProperty(list,groupProperty,propertyToAverage)
  console.log("listAveraged",listAveraged);
  
  const toReturn = listAveraged.map((item) => {
    const fromValue = item[groupProperty] - numberToAverage;
    const toValue = item[groupProperty] + numberToAverage;

    const itemsInRange = list.filter((obj) => obj[groupProperty] >= fromValue && obj[groupProperty] <= toValue);


    const average = itemsInRange.reduce((acc, obj) => acc + obj[propertyToAverage], 0) / itemsInRange.length;

    return {
      ...item,
      [propertyToAverage]: average
    };
  });
  console.log("toReturn",toReturn);
  return toReturn
}

export function strTimeToFloat(tiempoString) {
  const [minutos, segundos] = tiempoString.split(":").map(Number);
  if (!isNaN(minutos) && !isNaN(segundos)) {
      // Convierte minutos y segundos a minutos totales
      return minutos + segundos / 60;
  } else {
      // En caso de que el formato no sea válido, retorna NaN
      return NaN;
  }
}



