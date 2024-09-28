const numero = 15;

let evento: string = `Cumpleanos ${numero}`;

let valorNulo = 'Valor No Nulo';
const operadorColapsado = valorNulo ?? 'En caso de que sea nulo el primer operador';

console.log('evento',evento);

console.log('operadorColapsado',operadorColapsado);
