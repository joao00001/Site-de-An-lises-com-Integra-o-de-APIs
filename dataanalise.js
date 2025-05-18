document.addEventListener("DOMContentLoaded", () => {
    const manualBox = document.querySelector(".manual-box");
    const manualModal = document.getElementById("manual-modal");
    const formModal = document.getElementById("form-modal");
    const dynamicForm = document.getElementById("dynamic-form");
    const intervalInput = document.getElementById("file-interval");
    const savedFilesList = document.getElementById("saved-files-list");

    let currentMonth = 1;
    let totalMonths = 1;
    let formData = JSON.parse(localStorage.getItem("formData")) || {};

// Referências aos elementos
const searchBox = document.getElementById("searchBox");
const searchResultsList = document.getElementById("searchResultsList");

// Evento de busca
searchBox.addEventListener("input", function () {
    const searchQuery = this.value.toLowerCase().trim(); // Captura o texto da busca
    updateSearchResults(searchQuery); // Atualiza os resultados
});

// Função para atualizar os resultados da busca
function updateSearchResults(searchQuery) {
    // Remove itens anteriores da lista de busca
    searchResultsList.innerHTML = "";

    // Obtém os arquivos salvos
    const savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || [];

    // Filtra os arquivos com base na consulta de busca
    const filteredFiles = savedFiles.filter(file =>
        file.name.toLowerCase().includes(searchQuery)
    );

    // Adiciona os itens filtrados na lista de resultados
    filteredFiles.forEach(file => {
        const listItem = document.createElement("li");
        listItem.textContent = `${file.name} - ${file.date}`; // Nome e data
        searchResultsList.appendChild(listItem);
    });

    // Oculta a lista de busca se não houver consulta
    searchResultsList.style.display = searchQuery ? "block" : "none";
}

// Função para fechar a lista de resultados se o clique for fora dela
function closeSearchResults(event) {
    const searchBox = document.getElementById("searchBox");
    const searchResultsContainer = document.getElementById("searchResultsList");

    // Verifica se o clique foi fora do input de pesquisa ou da lista de resultados
    if (!searchBox.contains(event.target) && !searchResultsContainer.contains(event.target)) {
        searchResultsList.style.display = "none"; // Fecha a lista
    }
}

// Adiciona o eventListener para capturar cliques fora da lista de pesquisa
document.addEventListener("click", closeSearchResults);


// Função original para atualizar a lista principal
function updateSavedFilesList() {
    const savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || [];
    savedFilesList.innerHTML = ""; // Limpa a lista principal

    savedFiles.forEach((file, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${file.name} - ${file.date}`;
        listItem.style.cursor = "pointer";
        listItem.classList.add("list-item");

        // Criação do contêiner para os ícones
        const iconContainer = document.createElement("div");
        iconContainer.classList.add("icon-container");

        // Ícone de exclusão
        const deleteIcon = document.createElement("img");
        deleteIcon.src = "trash.png"; // Substitua pelo caminho da sua imagem
        deleteIcon.alt = "Excluir"; // Texto alternativo para acessibilidade
        deleteIcon.classList.add("delete-icon");
        deleteIcon.style.cursor = "pointer";
        deleteIcon.addEventListener("click", () => openConfirmationModal(index));

        // Ícone de análise
        const analiseIcon = document.createElement("img");
        analiseIcon.src = "analyse.png";
        analiseIcon.alt = "Análise";
        analiseIcon.classList.add("analise-icon");
        analiseIcon.style.cursor = "pointer";
        analiseIcon.addEventListener("click", () => openAnalysisModal());

        // Adiciona os ícones ao contêiner
        iconContainer.appendChild(deleteIcon);
        iconContainer.appendChild(analiseIcon);

        // Adiciona o contêiner ao item da lista
        listItem.appendChild(iconContainer);
        savedFilesList.appendChild(listItem);
    });
}

// Inicializa a lista principal
updateSavedFilesList();

    // Recupera os dados armazenados, ou cria um objeto vazio se não houver
    

    manualBox.addEventListener("click", () => {
        manualModal.style.display = "flex";
    });

    const closeButtons = document.querySelectorAll(".close");
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            manualModal.style.display = "none";
            formModal.style.display = "none";
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === manualModal || e.target === formModal) {
            manualModal.style.display = "none";
            formModal.style.display = "none";
        }
    });

    document.querySelector(".next-button").addEventListener("click", (e) => {
        e.preventDefault();

        totalMonths = parseInt(intervalInput.value, 10);
        if (isNaN(totalMonths) || totalMonths < 1) {
            alert("Por favor, insira um número válido de meses.");
            return;
        }

        currentMonth = 1;
        formData = {};
        formData[currentMonth] = {};

        showFormForMonth(currentMonth);
        manualModal.style.display = "none";
        formModal.style.display = "flex";
    });

    function showFormForMonth(month) {
        dynamicForm.innerHTML = `<h3>Formulário do Mês ${month}</h3>`;
        const selectedCheckboxes = [...document.querySelectorAll("input[name='exam-type']:checked")];
        selectedCheckboxes.forEach(checkbox => {
            const examType = checkbox.value;
            const fields = getFieldsForExam(examType);

            if (fields) {
                const examSection = document.createElement("div");
                examSection.classList.add("exam-section");
                examSection.innerHTML = `<h3>${examType}</h3>`;

                fields.forEach(field => {
                    const label = document.createElement("label");
                    label.textContent = field.name;

                    const inputContainer = document.createElement("div");
                    inputContainer.style.display = "flex";
                    inputContainer.style.alignItems = "center";
                    inputContainer.style.gap = "5px";

                    const input = document.createElement("input");
                    input.type = "number";
                    input.name = `${examType}-${field.name}`;
                    input.min = field.min;
                    input.max = field.max;
                    input.step = field.step;
                    input.value = formData[month]?.[`${examType}-${field.name}`] || "";

                    const unit = document.createElement("span");
                    unit.textContent = field.unit;

                    inputContainer.appendChild(input);
                    inputContainer.appendChild(unit);

                    examSection.appendChild(label);
                    examSection.appendChild(inputContainer);
                    examSection.appendChild(document.createElement("br"));

                    input.addEventListener("input", () => {
                        if (!formData[month]) formData[month] = {};
                        formData[month][`${examType}-${field.name}`] = input.value;
                        localStorage.setItem("formData", JSON.stringify(formData));
                    });
                });

                dynamicForm.appendChild(examSection);
            }
        });

        const nextButton = document.createElement("button");
        nextButton.textContent = month < totalMonths ? "Próximo mês" : "Salvar";
        nextButton.className = "save-button";
        nextButton.addEventListener("click", handleNextOrSave);

        dynamicForm.appendChild(nextButton);
    }

    function handleNextOrSave() {
        if (currentMonth < totalMonths) {
            currentMonth++;
            showFormForMonth(currentMonth);
        } else {
            console.log("Dados do formulário:", formData);
            saveDataToLocalStorage();
            showNotification('Os dados foram salvos no localStorage!');  // Usando a função showNotification
            formModal.style.display = "none";
        }
    }

    function saveDataToLocalStorage() {
        const selectedCheckboxes = [...document.querySelectorAll("input[name='exam-type']:checked")];
        const currentDate = new Date().toLocaleDateString("pt-BR"); // Obtém a data atual no formato local (ex: "22/12/2024")
    
        let fileName;
    
        if (selectedCheckboxes.length === 1) {
            // Nome do arquivo é o nome da checkbox
            fileName = selectedCheckboxes[0].value;
        } else if (selectedCheckboxes.length > 1) {
            // Nome do arquivo é "Exame do dia" + data
            fileName = 'Exame Geral';
        } else {
            alert("Por favor, selecione pelo menos um tipo de exame.");
            return;
        }
    
        // Criação de um objeto com as informações para salvar no localStorage
        const formData = {
            selectedExams: selectedCheckboxes.map(checkbox => checkbox.value),
            date: currentDate,
        };
    
        const savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || [];
        savedFiles.push({
            name: fileName,
            date: currentDate,
            data: JSON.stringify(formData, null, 2),
        });
    
        localStorage.setItem("savedFiles", JSON.stringify(savedFiles));
        updateSavedFilesList(); // Atualiza a exibição dos arquivos salvos
        sendDataToAPI(formData);  // Envia os dados do formulário para a API

    }

    let fileToDeleteIndex = null; // Variável para armazenar o índice do arquivo a ser excluído

    // Função para abrir o modal de confirmação
    function openConfirmationModal(index) {
        fileToDeleteIndex = index; // Armazena o índice do arquivo selecionado
        document.getElementById("confirmation-modal").style.display = "flex"; // Exibe o modal
    }

    // Função para excluir o arquivo após confirmação
    document.getElementById("confirm-delete").addEventListener("click", () => {
        const savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || [];
        savedFiles.splice(fileToDeleteIndex, 1); // Remove o item do array
        localStorage.setItem("savedFiles", JSON.stringify(savedFiles)); // Atualiza o localStorage
        updateSavedFilesList(); // Atualiza a lista de arquivos
        closeConfirmationModal(); // Fecha o modal
    });

    // Função para cancelar a exclusão
    document.getElementById("cancel-delete").addEventListener("click", closeConfirmationModal);

    // Função para fechar o modal
    function closeConfirmationModal() {
        document.getElementById("confirmation-modal").style.display = "none"; // Esconde o modal
    }

    // Inicializa a lista de arquivos salvos
    updateSavedFilesList();

    function getFieldsForExam(examType) {
        const exams = {
            "Hemograma completo": [
                { name: "Hemácias (RBC)", min: 3, max: 6.5, step: 0.1, unit: "milhões/μL" },
                { name: "Hemoglobina (Hb)", min: 10, max: 20, step: 0.1, unit: "g/dL" },
                { name: "Hematócrito (Ht)", min: 30, max: 55, step: 1, unit: "%" },
                { name: "VCM", min: 70, max: 100, step: 1, unit: "fL" },
                { name: "HCM", min: 25, max: 35, step: 0.1, unit: "pg" },
                { name: "CHCM", min: 30, max: 37, step: 0.1, unit: "g/dL" },
                { name: "RDW", min: 11, max: 16, step: 0.1, unit: "%" },
                { name: "Leucócitos (WBC)", min: 1000, max: 17000, step: 100, unit: "células/μL" },
                { name: "Plaquetas (PLT)", min: 150000, max: 450000, step: 1000, unit: "células/μL" },
                { name: "VPM", min: 7, max: 11, step: 0.1, unit: "fL" }
            ],
            "Glicemia": [
                { name: "Glicose plasmática em jejum", min: 30, max: 199, step: 1, unit: "mg/dL" },
                { name: "Hemoglobina glicada (HbA1c)", min: 1, max: 14, step: 0.1, unit: "%" }
            ],
            "Colesterol total e frações": [
                { name: "Colesterol total", min: 100, max: 300, step: 1, unit: "mg/dL" },
                { name: "LDL", min: 50, max: 200, step: 1, unit: "mg/dL" },
                { name: "HDL", min: 30, max: 100, step: 1, unit: "mg/dL" },
                { name: "Triglicerídeos", min: 50, max: 400, step: 1, unit: "mg/dL" }
            ],
            "Função hepática": [
                { name: "AST (TGO)", min: 5, max: 40, step: 1, unit: "U/L" },
                { name: "ALT (TGP)", min: 7, max: 56, step: 1, unit: "U/L" },
                { name: "Fosfatase alcalina (FA)", min: 30, max: 120, step: 1, unit: "U/L" },
                { name: "Bilirrubina total", min: 0.3, max: 1.2, step: 0.1, unit: "mg/dL" },
                { name: "Albumina", min: 3.5, max: 5, step: 0.1, unit: "g/dL" }
            ],
            "Função renal": [
                { name: "Creatinina", min: 0.5, max: 1.3, step: 0.1, unit: "mg/dL" },
                { name: "Ureia", min: 10, max: 50, step: 1, unit: "mg/dL" },
                { name: "Taxa de filtração glomerular (TFG)", min: 60, max: 120, step: 1, unit: "mL/min/1.73m²" },
                { name: "Clearance de creatinina", min: 70, max: 140, step: 1, unit: "mL/min" },
                { name: "Eletrólitos (sódio, potássio, cloreto)", min: 135, max: 145, step: 1, unit: "mEq/L" }
            ],
            "Exame de urina": [
                { name: "Aspecto", min: 0, max: 1, step: 1, unit: "1 = Normal, 0 = Alterado" },
                { name: "Densidade", min: 1.005, max: 1.030, step: 0.001, unit: "" },
                { name: "pH", min: 4.5, max: 8, step: 0.1, unit: "" },
                { name: "Proteínas", min: 0, max: 1, step: 1, unit: "1 = Presente, 0 = Ausente" },
                { name: "Glicose", min: 0, max: 1, step: 1, unit: "1 = Presente, 0 = Ausente" },
                { name: "Células e cristais", min: 0, max: 100, step: 1, unit: "células/μL" }
            ],
            "Exame de coagulação": [
                { name: "Tempo de protrombina (TP)", min: 10, max: 15, step: 0.1, unit: "segundos" },
                { name: "Tempo de tromboplastina parcial ativado (TTPa)", min: 25, max: 35, step: 0.1, unit: "segundos" },
                { name: "INR", min: 0.8, max: 1.2, step: 0.1, unit: "" }
            ],
            "Dosagem de hormônios": [
                { name: "TSH", min: 0.4, max: 4, step: 0.1, unit: "μUI/mL" },
                { name: "T3", min: 80, max: 200, step: 1, unit: "ng/dL" },
                { name: "T4", min: 4.5, max: 12.5, step: 0.1, unit: "μg/dL" },
                { name: "Cortisol", min: 5, max: 25, step: 0.1, unit: "μg/dL" },
                { name: "FSH", min: 1, max: 10, step: 0.1, unit: "mUI/mL" },
                { name: "LH", min: 1, max: 10, step: 0.1, unit: "mUI/mL" },
                { name: "Prolactina", min: 3, max: 25, step: 0.1, unit: "ng/mL" }
            ],
            "Vitamina D e outros micronutrientes": [
                { name: "Vitamina D", min: 20, max: 100, step: 1, unit: "ng/mL" },
                { name: "Ferro", min: 50, max: 170, step: 1, unit: "μg/dL" },
                { name: "Ferritina", min: 12, max: 300, step: 1, unit: "ng/mL" },
                { name: "Zinco", min: 60, max: 120, step: 1, unit: "μg/dL" },
                { name: "Selênio", min: 70, max: 150, step: 1, unit: "μg/L" }
            ],
            "Testes sorológicos": [
                { name: "Teste de HIV", min: 0, max: 1, step: 1, unit: "1 = Positivo, 0 = Negativo" },
                { name: "Teste de hepatite (A, B, C)", min: 0, max: 1, step: 1, unit: "1 = Positivo, 0 = Negativo" },
                { name: "Teste de sífilis", min: 0, max: 1, step: 1, unit: "1 = Positivo, 0 = Negativo" },
                { name: "Teste de dengue", min: 0, max: 1, step: 1, unit: "1 = Positivo, 0 = Negativo" },
                { name: "Teste de toxoplasmose", min: 0, max: 1, step: 1, unit: "1 = Positivo, 0 = Negativo" }
            ]
        };
    
        return exams[examType];
    }
    nextButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
    
            const selectedCheckboxes = [...document.querySelectorAll("input[name='exam-type']:checked")];
            if (selectedCheckboxes.length === 0) {
                alert("Por favor, selecione pelo menos um tipo de exame.");
                return;
            }
    
            const formContainer = document.getElementById("dynamic-form");
            formContainer.innerHTML = "";
    
            selectedCheckboxes.forEach(checkbox => {
                const examType = checkbox.value;
                const fields = getFieldsForExam(examType);
    
                if (fields) {
                    const examSection = document.createElement("div");
                    examSection.classList.add("exam-section");
                    examSection.innerHTML = `<h3>${examType}</h3>`;
    
                    fields.forEach(field => {
                        const label = document.createElement("label");
                        label.textContent = field.name;
    
                        const inputContainer = document.createElement("div");
                        inputContainer.style.display = "flex";
                        inputContainer.style.alignItems = "center";
                        inputContainer.style.gap = "5px"; // Espaçamento entre o input e a unidade
    
                        const input = document.createElement("input");
                        input.type = "number";
                        input.name = `${examType}-${field.name}`;
                        input.min = field.min;
                        input.max = field.max;
                        input.step = field.step;
    
                        const unit = document.createElement("span");
                        unit.textContent = field.unit;
    
                        inputContainer.appendChild(input);
                        inputContainer.appendChild(unit);
    
                        examSection.appendChild(label);
                        examSection.appendChild(inputContainer);
                        examSection.appendChild(document.createElement("br"));
                    });
    
                    formContainer.appendChild(examSection);
                }
            });
    
            manualModal.style.display = "none";
            formModal.style.display = "flex";
        });
    });
    
});


function toggleMenu() {
    // Selecione os elementos que você deseja aplicar o efeito de blur
    const content = document.querySelector('main');
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
function sendDataToAPI() {
    let storedData = JSON.parse(localStorage.getItem('formData')) || [];
    const dataArray = Array.isArray(storedData) ? storedData : [storedData];

    fetch('http://127.0.0.1:5000/save_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataArray),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Sucesso:', data);
        showNotification('Dados enviados com sucesso!');  // Usando a função showNotification
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Ocorreu um erro ao enviar os dados: ' + error.message);  // Usando a função showNotification
    });
}


function toggleTheme() {
    // Seleciona os elementos para alterar o tema
    const body = document.body;
    const main = document.querySelector('main');
    const examBoxes = document.querySelectorAll('.exam-options .box');
    
    // Alterna o modo escuro no body e no main
    body.classList.toggle('dark-mode');
    main.classList.toggle('dark-mode');
    
    // Alterna o modo escuro para cada box
    examBoxes.forEach(box => box.classList.toggle('dark-mode'));
}
// Cria a legenda que será compartilhada por todos os gráficos
function createLegend() {
    const legendContainer = document.createElement("div");
    legendContainer.classList.add("chart-legend");

    const legendHTML = `
        <p><strong>Legenda de Cores:</strong></p>
        <p style="text-align: left;"><span style="display: inline-block; width: 20px; height: 20px; background-color: red; border-radius: 10%;"></span> Acima da faixa ideal</p>
        <p style="text-align: left;"><span style="display: inline-block; width: 20px; height: 20px; background-color: green; border-radius: 10%;"></span> Dentro da faixa ideal</p>
        <p style="text-align: left;"><span style="display: inline-block; width: 20px; height: 20px; background-color: blue; border-radius: 10%;"></span> Abaixo da faixa ideal</p>
    `;
    
    legendContainer.innerHTML = legendHTML;
    return legendContainer;
}

document.querySelector(".analysis-button").addEventListener("click", () => {
    const loadingScreen = document.getElementById("loading-screen");
    const modal = document.getElementById("unique-analysis-modal");

    // Exibe a tela de loading
    loadingScreen.style.display = "flex";

    // Espera 2 segundos antes de exibir o modal
    setTimeout(() => {
        // Esconde a tela de loading
        loadingScreen.style.display = "none";

        // Exibe o modal
        modal.style.display = "block";
    }, 2000); // 2000 milissegundos = 2 segundos
});

// Adiciona evento para fechar o modal
document.getElementById("unique-close-analysis-modal").addEventListener("click", () => {
    document.getElementById("unique-analysis-modal").style.display = "none";
});



function openAnalysisModal() {
    const formData = JSON.parse(localStorage.getItem("formData")) || {};
    const analysisModal = document.getElementById("unique-analysis-modal");
    const analysisSummary = document.getElementById("unique-analysis-summary");
    const analysisChartsContainer = document.getElementById("unique-analysis-charts-container");
    

    // Limpa os gráficos existentes
    analysisChartsContainer.innerHTML = "";
// Define as faixas ideais para cada exame
const idealRanges = {
    'Hemograma completo-Hemácias (RBC)': { min: 4.7, max: 6.1 },
    'Hemograma completo-Hemoglobina (Hb)': { min: 13.8, max: 17.2 },
    'Hemograma completo-Hematócrito (Ht)': { min: 40, max: 54 },
    'Hemograma completo-VCM': { min: 80, max: 100 },
    'Hemograma completo-HCM': { min: 27, max: 33 },
    'Hemograma completo-CHCM': { min: 32, max: 36 },
    'Hemograma completo-RDW': { min: 11.5, max: 14.5 },
    'Hemograma completo-Leucócitos (WBC)': { min: 4000, max: 11000 },
    'Hemograma completo-Plaquetas (PLT)': { min: 150000, max: 350000 },
    'Hemograma completo-VPM': { min: 7.4, max: 10.4 },
    'Glicemia-Glicose plasmática em jejum': { min: 70, max: 110 },
    'Glicemia-Hemoglobina glicada (HbA1c)': { min: 4.0, max: 5.6 },
    'Colesterol total e frações-Colesterol total': { min: 125, max: 200 },
    'Colesterol total e frações-LDL': { min: 50, max: 100 },
    'Colesterol total e frações-HDL': { min: 40, max: 60 },
    'Colesterol total e frações-Triglicerídeos': { min: 30, max: 150 },
    'Função hepática-AST (TGO)': { min: 10, max: 40 },
    'Função hepática-ALT (TGP)': { min: 7, max: 56 },
    'Função hepática-Fosfatase alcalina (FA)': { min: 44, max: 147 },
    'Função hepática-Bilirrubina total': { min: 0.1, max: 1.2 },
    'Função hepática-Albumina': { min: 3.5, max: 5.0 },
    'Função renal-Creatinina': { min: 0.6, max: 1.2 },
    'Função renal-Ureia': { min: 7, max: 20 },
    'Função renal-Taxa de filtração glomerular (TFG)': { min: 90, max: 120 },
    'Função renal-Clearance de creatinina': { min: 90, max: 120 },
    'Função renal-Eletrólitos (sódio, potássio, cloreto)': { min: 135, max: 145 },
    'Exame de urina-Aspecto': { min: 0, max: 1 },
    'Exame de urina-Densidade': { min: 1.010, max: 1.025 },
    'Exame de urina-pH': { min: 4.5, max: 8.0 },
    'Exame de urina-Proteínas': { min: 6.0, max: 8.3 },
    'Exame de urina-Glicose': { min: 0, max: 0.8 },
    'Exame de urina-Células e cristais': { min: 0, max: 5 },
    'Exame de coagulação-Tempo de protrombina (TP)': { min: 11, max: 13 },
    'Exame de coagulação-Tempo de tromboplastina parcial ativado (TTPa)': { min: 25, max: 35 },
    'Exame de coagulação-INR': { min: 0.8, max: 1.2 },
    'Dosagem de hormônios-TSH': { min: 0.4, max: 4.0 },
    'Dosagem de hormônios-T3': { min: 80, max: 180 },
    'Dosagem de hormônios-T4': { min: 4.5, max: 11.2 },
    'Dosagem de hormônios-Cortisol': { min: 5, max: 25 },
    'Dosagem de hormônios-FSH': { min: 1.0, max: 10.0 },
    'Dosagem de hormônios-LH': { min: 1.0, max: 10.0 },
    'Dosagem de hormônios-Prolactina': { min: 5, max: 25 },
    'Vitamina D e outros micronutrientes-Vitamina D': { min: 20, max: 50 },
    'Vitamina D e outros micronutrientes-Ferro': { min: 60, max: 170 },
    'Vitamina D e outros micronutrientes-Ferritina': { min: 30, max: 400 },
    'Vitamina D e outros micronutrientes-Zinco': { min: 70, max: 150 },
    'Vitamina D e outros micronutrientes-Selênio': { min: 70, max: 150 },
    'Testes sorológicos-Teste de HIV': { min: 0, max: 1 },
    'Testes sorológicos-Teste de hepatite (A, B, C)': { min: 0, max: 1 },
    'Testes sorológicos-Teste de sífilis': { min: 0, max: 1 },
    'Testes sorológicos-Teste de dengue': { min: 0, max: 1 },
    'Testes sorológicos-Teste de toxoplasmose': { min: 0, max: 1 },
};
    // Processa os dados
    const groupedData = groupExamsByName(formData);
    const summaryData = calculateSummary(groupedData);

    // Adiciona a interface do IMC diretamente no contêiner de gráficos
    const imcDiv = document.createElement("div");
    imcDiv.classList.add("imc-section");
    imcDiv.innerHTML = ` 
        <div class="imc-inputs">
            <p><strong>Calcular IMC</strong></p>
            <label for="gender">Gênero:</label>
            <select id="gender" name="gender">
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
            </select>
            <label for="height">Altura (m):</label>
            <input type="number" id="height" name="height" step="0.01" placeholder="Ex: 1.75">
            <label for="weight">Peso (kg):</label>
            <input type="number" id="weight" name="weight" step="0.1" placeholder="Ex: 70.5">
            <label for="age">Idade:</label>
            <input type="number" id="age" name="age" placeholder="Ex: 30">
            <button id="calculate-imc-button">Calcular IMC</button>
        </div>
        <p id="imc-result"></p>
    `;
    analysisChartsContainer.appendChild(imcDiv);

    // Adiciona evento para calcular o IMC
    document.getElementById("calculate-imc-button").addEventListener("click", () => {
        const gender = document.getElementById("gender").value;
        const height = parseFloat(document.getElementById("height").value);
        const weight = parseFloat(document.getElementById("weight").value);
        const age = parseInt(document.getElementById("age").value);
        const imcResult = document.getElementById("imc-result");

        if (!height || !weight || height <= 0 || weight <= 0 || !age || age <= 0) {
            imcResult.textContent = "Por favor, insira valores válidos para altura, peso e idade.";
        } else {
            const imc = (weight / (height ** 2)).toFixed(2);
            let classification;

            if (imc < 18.5) {
                classification = "Abaixo do peso";
            } else if (imc >= 18.5 && imc <= 24.9) {
                classification = "Peso normal";
            } else if (imc >= 25 && imc <= 29.9) {
                classification = "Sobrepeso";
            } else {
                classification = "Obesidade";
            }

            imcResult.textContent = `Seu IMC (${gender}, ${age} anos): ${imc} - ${classification}`;
        }
    });

    

    
// Cria o container da legenda uma vez e adiciona ao container de gráficos
const legend = createLegend();
analysisChartsContainer.appendChild(legend);  // Adiciona a legenda uma vez
     // Cria um gráfico para cada exame agrupado
     for (const exam in groupedData) {
        const examData = groupedData[exam];

        // Cria um container para o gráfico
        const chartContainer = document.createElement("div");
        chartContainer.style.flexGrow = 1; // Os gráficos vão crescer para ocupar o espaço disponível
        chartContainer.style.marginBottom = "20px";
        const canvas = document.createElement("canvas");
        chartContainer.appendChild(canvas);
        analysisChartsContainer.appendChild(chartContainer);
        const summary = document.createElement("div");
        // Adiciona estilos diretamente à div
        summary.style.padding = "20px"; // Espaçamento interno
        summary.style.borderRadius = "30px"; // Bordas arredondadas
        summary.style.margin = "10px"; // Espaçamento externo
        summary.style.fontFamily = "Arial, sans-serif"; // Fonte
        summary.style.color = "#333"; // Cor do texto
        summary.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; // Sombra
        summary.style.backdropFilter= "blur(5px)";
        summary.style.backgroundColor= "rgba(255, 255, 255, 0.444)"; /* Cor de fundo semi-transparente */
        summary.style.mixBlendMode= "multiply"; /* Multiplica as cores, escurecendo o desfoque */    
        summary.style.boxShadow= "0 2px 5px rgba(0, 0, 0, 0.1)";
        

document.body.appendChild(summary); // Adiciona a div ao corpo da página
        const { mean, percentageChange, direction, avgChange, averageTrend } = summaryData[exam];
        const arrow = percentageChange > 0 
        ? "⬆️" 
        : percentageChange < 0 
        ? "⬇️" 
        : ""; 


    summary.innerHTML = `
        <p><strong>Média:</strong> ${mean}</p>
        <p><strong>Variação:</strong> ${percentageChange}% ${arrow}</p>
        <p><strong>Média de variação:</strong> ${avgChange}</p>
        <p><strong>Tendência:</strong> ${averageTrend}% ${arrow}</p>
    `;
    summary.style.marginBottom = "10px";
    summary.style.fontSize = "14px";

    // Adiciona o resumo antes do gráfico
    chartContainer.appendChild(summary);
    
    

        // Verifica se existe uma faixa ideal para o exame
        const idealRange = idealRanges[exam];
        

        // Ajusta as cores das barras baseado na faixa ideal
        const barColors = examData.values.map(value => {
            if (idealRange) {
                if (value < idealRange.min) {
                    return 'blue'; // Fora da faixa ideal (abaixo)
                } else if (value > idealRange.max) {
                    return 'red'; // Fora da faixa ideal (acima)
                } else {
                    return 'green'; // Dentro da faixa ideal
                }
            }
            return 'gray'; // Se não houver faixa ideal, usa cor neutra
        });

        // Cria o gráfico
         // Cria o gráfico
         new Chart(canvas.getContext("2d"), {
            type: "bar",
            data: {
                labels: examData.labels, // Labels dos exames
                datasets: [{
                    label: exam,
                    data: examData.values, // Valores dos exames
                    backgroundColor: barColors, // Usando as cores dinâmicas para cada barra
                    borderColor: barColors, // Adicionando a mesma cor à borda da barra
                    borderWidth: 1,
                }]
            },
            options: {
                
                responsive: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            suggestedMin: 0 // Adiciona um mínimo sugerido para o eixo Y
                        }
                    }
                },
                animation: {
                    delay: 2000, // Atraso de 2 segundos antes de começar a animação
                    duration: 3000, // Tempo de duração da animação (em milissegundos)
                    easing: 'easeOutQuad', // Estilo da animação
                    onProgress: function(animation) {
                        // Animação do crescimento das barras
                    }
                }
            }
        });
    }
// Cria o container para o resumo
const summaryContainer = document.createElement("div");
summaryContainer.id = "summary-container";
summaryContainer.style.marginTop = "20px"; // Espaçamento superior
summaryContainer.style.padding = "10px"; // Espaçamento interno
summaryContainer.style.backgroundColor = "rgba(240, 240, 240, 0.9)"; // Fundo semi-transparente
summaryContainer.style.borderRadius = "10px"; // Bordas arredondadas
summaryContainer.style.fontFamily = "Arial, sans-serif";
summaryContainer.style.lineHeight = "1.5";

// Adiciona o conteúdo do resumo
summaryContainer.innerHTML = `
    <div style="white-space: pre-wrap;">
        ${generateDynamicHealthSummary(groupedData, idealRanges)}
    </div>
`;

// Adiciona o container do resumo dentro do modal, depois dos gráficos
analysisModal.appendChild(summaryContainer);
    analysisChartsContainer.parentElement.appendChild(summaryContainer);
    const toggleButton = document.getElementById("toggle-summary-button");
    
    // Adiciona o evento de clique no botão
    toggleButton.addEventListener("click", function() {
      // Alterna a visibilidade do resumo
      if (summaryContainer.style.display === "none" || summaryContainer.style.display === "") {
        summaryContainer.style.display = "block";
        summaryContainer.classList.add("visible"); // Alternativa para visibilidade usando classes
        toggleButton.textContent = "Fechar Resumo"; // Altera o texto do botão
      } else {
        summaryContainer.style.display = "none";
        summaryContainer.classList.remove("visible");
        toggleButton.textContent = "Mostrar Resumo"; // Altera o texto do botão novamente
      }
    });
    analysisModal.style.display = "block";
}
// Agrupa os dados dos exames pelo nome
function groupExamsByName(data) {
    const groupedData = {};
    let monthCounter = 1;  // Contador para os meses

    for (const month in data) {
        for (const examName in data[month]) {
            const value = parseFloat(data[month][examName]);
            if (!isNaN(value)) {
                if (!groupedData[examName]) {
                    groupedData[examName] = { labels: [], values: [] };
                }

                // Aqui, alteramos para "Mês X"
                groupedData[examName].labels.push(`Mês ${monthCounter}`);
                groupedData[examName].values.push(value);
            }
        }
        monthCounter++;  // Incrementa o contador do mês
    }

    return groupedData;
}

// Fecha o modal ao clicar no botão de fechar
document.getElementById("unique-close-analysis-modal").addEventListener("click", () => {
    document.getElementById("unique-analysis-modal").style.display = "none";
    container.style.display = 'grid'; // Mostra o container
});

// Exemplo: Botão para abrir a análise
document.querySelector(".analysis-button").addEventListener("click", openAnalysisModal);


const units = {
    'Hemograma completo-Hemácias (RBC)': 'milhões/mm³',
    'Hemograma completo-Hemoglobina (Hb)': 'g/dL',
    'Hemograma completo-Hematócrito (Ht)': '%',
    'Hemograma completo-VCM': 'fL',
    'Hemograma completo-HCM': 'pg',
    'Hemograma completo-CHCM': 'g/dL',
    'Hemograma completo-RDW': '%',
    'Hemograma completo-Leucócitos (WBC)': 'mil/mm³',
    'Hemograma completo-Plaquetas (PLT)': 'mil/mm³',
    'Hemograma completo-VPM': 'fL',
    'Glicemia-Glicose plasmática em jejum': 'mg/dL',
    'Glicemia-Hemoglobina glicada (HbA1c)': '%',
    'Colesterol total e frações-Colesterol total': 'mg/dL',
    'Colesterol total e frações-LDL': 'mg/dL',
    'Colesterol total e frações-HDL': 'mg/dL',
    'Colesterol total e frações-Triglicerídeos': 'mg/dL',
    'Função hepática-AST (TGO)': 'U/L',
    'Função hepática-ALT (TGP)': 'U/L',
    'Função hepática-Fosfatase alcalina (FA)': 'U/L',
    'Função hepática-Bilirrubina total': 'mg/dL',
    'Função hepática-Albumina': 'g/dL',
    'Função renal-Creatinina': 'mg/dL',
    'Função renal-Ureia': 'mg/dL',
    'Função renal-Taxa de filtração glomerular (TFG)': 'mL/min/1.73m²',
    'Função renal-Clearance de creatinina': 'mL/min',
    'Função renal-Eletrólitos (sódio, potássio, cloreto)': 'mEq/L',
    'Exame de urina-Aspecto': '',
    'Exame de urina-Densidade': '',
    'Exame de urina-pH': '',
    'Exame de urina-Proteínas': 'mg/dL',
    'Exame de urina-Glicose': 'mg/dL',
    'Exame de urina-Células e cristais': 'células/campo',
    'Exame de coagulação-Tempo de protrombina (TP)': 'segundos',
    'Exame de coagulação-Tempo de tromboplastina parcial ativado (TTPa)': 'segundos',
    'Exame de coagulação-INR': '',
    'Dosagem de hormônios-TSH': 'µIU/mL',
    'Dosagem de hormônios-T3': 'ng/dL',
    'Dosagem de hormônios-T4': 'µg/dL',
    'Dosagem de hormônios-Cortisol': 'µg/dL',
    'Dosagem de hormônios-FSH': 'mUI/mL',
    'Dosagem de hormônios-LH': 'mUI/mL',
    'Dosagem de hormônios-Prolactina': 'ng/mL',
    'Vitamina D e outros micronutrientes-Vitamina D': 'ng/mL',
    'Vitamina D e outros micronutrientes-Ferro': 'µg/dL',
    'Vitamina D e outros micronutrientes-Ferritina': 'ng/mL',
    'Vitamina D e outros micronutrientes-Zinco': 'µg/dL',
    'Vitamina D e outros micronutrientes-Selênio': 'µg/L',
    'Testes sorológicos-Teste de HIV': '',
    'Testes sorológicos-Teste de hepatite (A, B, C)': '',
    'Testes sorológicos-Teste de sífilis': '',
    'Testes sorológicos-Teste de dengue': '',
    'Testes sorológicos-Teste de toxoplasmose': '',
    default: '' // Caso não exista unidade definida, usa uma string vazia
};


function calculateSummary(groupedData) {
    const summaries = {};

    for (const examName in groupedData) {
        const values = groupedData[examName].values;
        const mean = (values.reduce((acc, val) => acc + val, 0) / values.length).toFixed(2);
        const min = Math.min(...values).toFixed(2);
        const max = Math.max(...values).toFixed(2);
        const percentageChange = (((values[values.length - 1] - values[0]) / values[0]) * 100).toFixed(2);
        const unit = units[examName] || units.default;
        const differences = values.slice(1).map((val, i) => val - values[i]);
        const avgChange = (differences.reduce((acc, val) => acc + val, 0) / differences.length).toFixed(2);
        const trend = values.map((value, index) => index === 0 ? 0 : value - values[index - 1]);
        const averageTrend = (trend.reduce((acc, diff) => acc + diff, 0) / trend.length).toFixed(2);




        summaries[examName] = {
            mean: `${mean} ${unit}`, 
            min: Math.min(...values),
            max: Math.max(...values),
            percentageChange,
            avgChange: (differences.reduce((acc, val) => acc + val, 0) / differences.length).toFixed(2),
            direction: percentageChange > 0 ? "up" : "down",
            trend: values.map((value, index) => index === 0 ? 0 : value - values[index - 1]),
            averageTrend: (trend.reduce((acc, diff) => acc + diff, 0) / trend.length).toFixed(2)
        };
    }

    return summaries;
}

function showNotification(message) {
    const notificationContainer = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    // Exibir a notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remover a notificação após 4 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 500);
    }, 4000);
}
// texto com análise e mensagens personalizadas -- em implementação
function generateDynamicHealthSummary(groupedData, idealRanges) {
    let summary = "Aqui está um panorama geral da sua saúde com base nos dados fornecidos:\n\n";

    for (const exam in groupedData) {
        const examData = groupedData[exam];
        const idealRange = idealRanges[exam];
        const lastValue = examData.values[examData.values.length - 1]; 

        if (idealRange) {
            if (lastValue < idealRange.min) {
                summary += `- No exame de "${exam}", o último resultado foi ${lastValue}, que está um pouco abaixo do intervalo esperado (${idealRange.min} - ${idealRange.max}). Isso pode ser algo a ser monitorado, dependendo de outros fatores de saúde.\n`;
            } else if (lastValue > idealRange.max) {
                summary += `- No exame de "${exam}", o resultado de ${lastValue} está acima do intervalo ideal (${idealRange.min} - ${idealRange.max}). Isso pode indicar necessidade de ajustes na dieta, estilo de vida ou mesmo atenção médica.\n`;
            } else {
                summary += `- O exame de "${exam}" apresentou um valor dentro do esperado: ${lastValue}. Continue mantendo seus bons hábitos para preservar este equilíbrio.\n`;
            }
        } else {
            summary += `- O exame de "${exam}" teve um valor registrado de ${lastValue}. Embora não haja uma referência definida, é importante acompanhar este indicador com regularidade.\n`;
        }
    }

    summary += "\nSe precisar de orientações específicas, é sempre bom consultar um profissional de saúde para interpretar os resultados com maior precisão.";

    return summary;
}
// Seleciona o botão e o contêiner do resumo
// Seleciona os elementos necessários
const container = document.querySelector('.container');
const analysisButton = document.querySelector('.analysis-button');
const analysisModal = document.querySelector('#analysis-modal');
const closeButton = document.querySelector('#unique-close-analysis-modal');

// Evento para ocultar o container e mostrar o modal
analysisButton.addEventListener('click', () => {
    container.style.display = 'none'; // Esconde o container
    analysisModal.style.display = 'block'; // Mostra o modal
});
const savedFilesList = document.getElementById("saved-files-list");
const placeholders = document.querySelectorAll(".loading-placeholder");

function toggleLoadingPlaceholder() {
  if (savedFilesList.children.length === 0) {
    placeholders.forEach((placeholder) => placeholder.classList.add("active"));
  } else {
    placeholders.forEach((placeholder) => placeholder.classList.remove("active"));
  }
}

const observer = new MutationObserver(toggleLoadingPlaceholder);
observer.observe(savedFilesList, { childList: true });
toggleLoadingPlaceholder();




              











