const intervalos = {
    "Distrito Federal": [["JDP", "JKR"]],
    "Goiás": [["KAV", "KFC"]],
    "Minas Gerais": [["GKJ", "HOK"]]
  };
  
  // Função que converte prefixo para número e compara
  function estaNoIntervalo(prefixo, inicio, fim) {
    const valor = convertePrefixo(prefixo);
    return valor >= convertePrefixo(inicio) && valor <= convertePrefixo(fim);
  }
  
  // Converte 'ABC' para um número base 26
  function convertePrefixo(p) {
    return p.split('').reduce((acc, l, i) => acc + (l.charCodeAt(0) - 65) * Math.pow(26, 2 - i), 0);
  }
  
  function verificarEstado() {
    const placa = document.getElementById("placa").value.toUpperCase();
    const prefixo = placa.slice(0, 3);
    let estadoEncontrado = "Estado não identificado para este grupo.";
  
    for (const [estado, lista] of Object.entries(intervalos)) {
      for (const [ini, fim] of lista) {
        if (estaNoIntervalo(prefixo, ini, fim)) {
          estadoEncontrado = `Estado de origem: ${estado}`;
          break;
        }
      }
    }
  
    document.getElementById("estado").innerText = estadoEncontrado;
  }
  
  // Cálculo de valor do estacionamento
  function calcularEstacionamento() {
    const entrada = document.getElementById("entrada").value;
    const saida = document.getElementById("saida").value;
  
    if (!entrada || !saida) {
      document.getElementById("valor").innerText = "Preencha os dois horários.";
      return;
    }
  
    const [h1, m1] = entrada.split(":").map(Number);
    const [h2, m2] = saida.split(":").map(Number);
  
    const minEntrada = h1 * 60 + m1;
    const minSaida = h2 * 60 + m2;
    const duracao = minSaida - minEntrada;
  
    if (duracao <= 0) {
      document.getElementById("valor").innerText = "Horário inválido.";
      return;
    }
  
    if (duracao <= 15) {
      document.getElementById("valor").innerText = "Estadia gratuita (até 15 minutos).";
      return;
    }
  
    let valor = 10;
    const m = (6 + 2 + 3 + 2 + 2)/100; // Substitua com os últimos dígitos reais das matrículas
    const excedente = duracao - 180;
  
    if (excedente > 0) {
      const excede20 = Math.ceil(excedente / 20);
      valor += excede20 * (2 + m);
    }
  
    document.getElementById("valor").innerText = `Valor a pagar: R$ ${valor.toFixed(2)}`;
  }
  