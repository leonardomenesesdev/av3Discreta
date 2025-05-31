const intervalos = {
  "DF (Distrito Federal)": 
  [
    ["JDP", "JKR"],
    ["OVM", "OVV"],
    ["OZM", "PBZ"],
    ["REC", "REV"]
  ],
  "GO (Goiás)": 
  [
    ["KAV", "KFC"],
    ["NFC", "NGZ"], 
    ["NJX", "NLU"], 
    ["NVO", "NWR"], 
    ["OGH", "OHA"], 
    ["OMI", "OOF"], 
    ["PQA", "PRZ"], 
    ["QTN", "QTS"], 
    ["RBK", "RCN"], 
    ["SBW", "SDS"]
  ],
  "MG (Minas Gerais)": 
  [
    ["GKJ", "HOK"], 
    ["NXX", "NYG"], 
    ["OLO", "OMH"], 
    ["OOV", "ORC"], 
    ["OWH", "OXK"], 
    ["PUA", "PZZ"], 
    ["QMQ", "QQZ"], 
    ["QUA", "QUZ"], 
    ["QWR", "QXZ"], 
    ["RFA", "RGD"], 
    ["RMD", "RNZ"], 
    ["RTA", "RVZ"]
  ]
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
    // Verifica se a placa tem 7 caracteres (LLLNLNN)
    if (!/^[A-Z]{3}\d[A-Z]\d{2}$/.test(placa)) {
      document.getElementById("estado").innerText = "Placa inválida! Exemplo de formato correto: ABC1D23";
      return;
    }
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
  
    document.getElementById("estado").innerHTML = estadoEncontrado;
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

  function exibirTotaisPlacas() {
  // Calcula os totais (usando a função existente)
  let resultados = [];
  for (const [estado, intervalosEstado] of Object.entries(intervalos)) {
    let totalPrefixos = 0;
    for (const [inicio, fim] of intervalosEstado) {
      const numInicio = convertePrefixo(inicio);
      const numFim = convertePrefixo(fim);
      totalPrefixos += (numFim - numInicio + 1);
    }
    const totalPlacas = totalPrefixos * 26000;
    resultados.push({ estado, total: totalPlacas });
  }

  // Cria a tabela HTML
  let html = `
    <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; margin-top: 20px;">
      <thead>
        <tr>
          <th>Estado</th>
          <th>Total de Placas Possíveis</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Adiciona as linhas da tabela
  resultados.forEach(item => {
    html += `
      <tr>
        <td>${item.estado}</td>
        <td style="text-align: right">${item.total.toLocaleString('pt-BR')}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  // Cria um container para a tabela (ou usa um existente)
  const container = document.getElementById('tabelaPlacas');
  container.innerHTML = html;
}

// Chame a função quando a página carregar
window.onload = function() {
  exibirTotaisPlacas();
};
  