var numero = 15;
var evento = "Cumpleanos ".concat(numero);
var valorNulo = 'Valor No Nulo';
var operadorColapsado = valorNulo !== null && valorNulo !== void 0 ? valorNulo : 'En caso de que sea nulo el primer operador';
console.log('evento', evento);
console.log('operadorColapsado', operadorColapsado);
