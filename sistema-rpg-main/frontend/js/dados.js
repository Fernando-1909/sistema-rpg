function rolarDado(lados) {
  const resultado = Math.floor(Math.random() * lados) + 1;
  const display = document.getElementById("resultado-dado");
  if (display) {
    display.textContent = `Resultado: ${resultado}`;
  }
}
