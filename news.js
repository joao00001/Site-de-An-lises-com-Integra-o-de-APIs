// Dados simulados de investimentos
const investments = [
    { name: "Pfizer (PFE)", value: 43.28, change: 1.12 },
    { name: "Moderna (MRNA)", value: 128.45, change: -2.34 },
    { name: "Johnson & Johnson (JNJ)", value: 162.32, change: 0.78 },
    { name: "AstraZeneca (AZN)", value: 57.89, change: 1.56 },
    { name: "Roche (ROG.SW)", value: 290.12, change: -3.21 },
    { name: "Novartis (NVS)", value: 93.56, change: 0.89 },
    { name: "Sanofi (SNY)", value: 51.23, change: -1.12 },
    { name: "Gilead Sciences (GILD)", value: 68.34, change: 2.45 },
    { name: "Bayer (BAYRY)", value: 15.78, change: -0.65 },
    { name: "Merck & Co. (MRK)", value: 109.34, change: 1.25 },
    { name: "AbbVie (ABBV)", value: 152.45, change: -0.45 },
    { name: "Amgen (AMGN)", value: 244.78, change: 3.21 },
    { name: "Bristol-Myers Squibb (BMY)", value: 67.56, change: -1.56 },
    { name: "Eli Lilly (LLY)", value: 523.45, change: 4.67 },
    { name: "GlaxoSmithKline (GSK)", value: 35.67, change: -0.78 },
    { name: "Novo Nordisk (NVO)", value: 87.97, change: -0.07 }


];

const barContent = document.getElementById("investmentBarContent");

// Gerar os itens dinamicamente
const generateContent = () => {
    const fragment = document.createDocumentFragment();
    investments.forEach(investment => {
        const item = document.createElement("div");
        item.className = "investment";
        const changeClass = investment.change >= 0 ? "up" : "down";
        item.innerHTML = `
            <span>${investment.name}: $${investment.value.toFixed(2)}</span>
            <span class="${changeClass}">(${investment.change >= 0 ? "+" : ""}${investment.change.toFixed(2)})</span>
        `;
        fragment.appendChild(item);
    });
    return fragment;
};

// Adicionar conteúdo duplicado para rolagem contínua
barContent.appendChild(generateContent());
barContent.appendChild(generateContent());

const data = {
    labels: [
      '01 Jan 2024', '10 Jan 2024', '20 Jan 2024', '01 Feb 2024', '10 Feb 2024', '20 Feb 2024', '01 Mar 2024', '01 Abr 2024', '20 Abr 2024', '01 Mai 2024', '24 Jan 2025'
    ],
    datasets: [{
      label: 'Preço da ação',
      data: [90.72, 89.65, 89.78, 87.51, 86.44, 85.37, 85.50, 83.22, 82.15, 81.08, 87.97], // valores fictícios
      borderColor: function (context) {
        const index = context.dataIndex;
        const value = context.dataset.data[index];
        const prevValue = index > 0 ? context.dataset.data[index - 1] : value;
        // Define cor com base na variação
        return value > prevValue ? 'green' : (value < prevValue ? 'red' : 'black');
      },
      backgroundColor: 'rgba(255, 255, 255, 0)', // Sem preenchimento
      fill: false, // Desativa o preenchimento
      tension: 0, // Linha reta sem curvatura
      borderWidth: 2 // Largura da linha
    }]
  };
  
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Data'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Preço (USD)'
          },
          beginAtZero: false
        }
      },
      elements: {
        line: {
          tension: 0, // Reta sem curvatura
        },
        point: {
          radius: 3, // Ponto no gráfico
          hitRadius: 10,
          hoverRadius: 8
        }
      }
    }
  };
  
  const ctx = document.getElementById('stockChart').getContext('2d');
  new Chart(ctx, config);
  
  function toggleMenu() {
    // Selecione os elementos que você deseja aplicar o efeito de blur
    const content = document.querySelector('.main-content');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const icon = document.querySelector('.menu-icon');

    // Alterna a visibilidade do menu (mostra ou esconde)
    dropdownMenu.classList.toggle('active');
    icon.classList.toggle('active'); // Altera o ícone para formar o 'X'

    // Alterna a classe 'blur-effect' nos elementos de conteúdo
    content.classList.toggle('blur-effect');

    // Referências para elementos adicionais
    const sidebar = document.querySelector('.sidebar');
    const sidebar2 = document.querySelector('.sidebar2');
    if (sidebar) sidebar.classList.toggle('blur-effect'); // Aplica o blur na sidebar
    if (sidebar2) sidebar2.classList.toggle('blur-effect'); // Aplica o blur na sidebar2

    document.getElementById('theme-toggle').addEventListener('click', function () {
        // Alterna a classe 'dark-mode' no botão
        this.classList.toggle('dark-mode');
    
        // Alterna a classe 'dark-mode' no body para o tema da página
        document.body.classList.toggle('dark-mode');
    });
    
}