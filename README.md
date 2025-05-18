Aplicação Web de Monitoramento de Saúde
Visão Geral
Este projeto é uma aplicação web client-side voltada para monitoramento e gerenciamento de saúde. Ele inclui três módulos principais: uma interface de chat para interação com o usuário, uma ferramenta de análise de dados para rastreamento de resultados de exames médicos e um calendário para agendamento de eventos relacionados à saúde. A aplicação é construída usando HTML, CSS, JavaScript e utiliza localStorage para persistência de dados. Também integra APIs de backend para respostas do chat e armazenamento de dados.
Principais Funcionalidades

Interface de Chat (chat.js):

Permite que os usuários interajam com um chatbot enviando mensagens e recebendo respostas por meio de uma API de backend (http://127.0.0.1:8000/chat).
Gerencia condições de saúde por meio de caixas de seleção, exibindo medicamentos a evitar com base nas doenças selecionadas.
Gera um relatório em PDF resumindo comorbidades selecionadas, medicamentos a evitar e interações entre doenças.
Suporta modo escuro e um menu suspenso responsivo com efeitos de desfoque.


Análise de Dados (dataanalise.js):

Permite que os usuários insiram e salvem resultados de exames médicos (por exemplo, hemograma, glicemia, colesterol) ao longo de vários meses.
Visualiza dados de exames com gráficos de barras usando Chart.js, codificados por cores com base em faixas ideais (verde para ideal, vermelho/azul para acima/abaixo).
Calcula o IMC com base nos dados do usuário (altura, peso, gênero, idade).
Suporta gerenciamento de arquivos (salvar, excluir, pesquisar) com dados armazenados em localStorage e enviados para uma API de backend (http://127.0.0.1:5000/save_data).
Exibe resumos dinâmicos de saúde e notificações para ações do usuário.


Calendário (calendario.js):

Fornece uma visualização de calendário mensal com agendamento de eventos (por exemplo, consultas médicas).
Suporta visualizações diária e semanal, com funcionalidade de arrastar e soltar para eventos.
Inclui um relógio em tempo real, cronômetro e um temporizador de modo de foco para produtividade.
Persiste eventos em localStorage e permite criação, exclusão e gerenciamento de eventos.



Estrutura do Projeto
├── index.html           # Arquivo HTML principal (assumido, não fornecido)
├── styles.css          # Estilos CSS (assumido, não fornecido)
├── chat.js             # Lógica da interface de chat
├── dataanalise.js      # Lógica de análise de dados de exames médicos
├── calendario.js       # Lógica de calendário e agendamento de eventos
├── assets/             # Pasta para imagens (por exemplo, trash.png, analyse.png)
└── README.md           # Este arquivo

Pré-requisitos

Um navegador web moderno (Chrome, Firefox, Edge, etc.).
Um servidor local para executar a aplicação (por exemplo, http.server do Python ou Node.js).
APIs de backend em execução em:
http://127.0.0.1:8000/chat para funcionalidade de chat.
http://127.0.0.1:5000/save_data para salvamento de dados de exames.


Bibliotecas externas (incluídas via CDN no HTML):
Chart.js para visualização de dados.
jsPDF e autoTable para geração de PDF.


Imagens (trash.png, analyse.png) para ícones de gerenciamento de arquivos.

Instalação

Clonar ou Baixar o Repositório:
git clone <url-do-repositório>

Ou baixe os arquivos do projeto manualmente.

Configurar um Servidor Local:Para evitar problemas de CORS com URLs file://, use um servidor local:
python -m http.server 8000

Ou use uma extensão como Live Server no VS Code.

Configurar APIs de Backend:

Certifique-se de que a API de chat (http://127.0.0.1:8000/chat) e a API de armazenamento de dados (http://127.0.0.1:5000/save_data) estejam em execução.
Essas APIs não estão incluídas no código e devem ser implementadas separadamente (por exemplo, usando Flask ou Node.js).


Abrir a Aplicação:Navegue até http://localhost:8000 no seu navegador para acessar index.html.

Garantir Dependências:Inclua o seguinte no seu index.html:
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>

Certifique-se de que styles.css está vinculado e contém os estilos necessários para modais, modo escuro e componentes de UI.


Uso

Interface de Chat:

Enviar Mensagens: Digite no campo de entrada e clique no botão de envio ou pressione Enter para interagir com o chatbot.
Gerenciar Condições de Saúde: Selecione doenças por meio de caixas de seleção para visualizar medicamentos a evitar e salvar seleções no localStorage.
Gerar Relatório em PDF: Clique no botão de relatório para baixar um PDF resumindo doenças selecionadas, medicamentos a evitar e interações.
Alternar Tema: Use o botão de alternância de tema para mudar entre os modos claro e escuro.
Redefinir Seleções: Clique no botão de redefinição para limpar todas as seleções de doenças e dados do localStorage.


Análise de Dados:

Inserir Dados de Exames: Selecione tipos de exames (por exemplo, hemograma, glicemia) e insira resultados para vários meses por meio do modal de formulário.
Salvar Dados: Salve os dados de exames no localStorage e envie-os para a API de backend.
Visualizar Análise: Clique no botão de análise para exibir gráficos de barras e um resumo de saúde, com cores indicando faixas ideais.
Calcular IMC: Insira altura, peso, gênero e idade para calcular o IMC e visualizar a classificação.
Pesquisar Arquivos: Use a barra de pesquisa para filtrar arquivos de exames salvos por nome.
Excluir Arquivos: Clique no ícone de lixeira ao lado de um arquivo salvo para excluí-lo após confirmação.


Calendário:

Visualizar Calendário: Navegue pelos meses usando os botões anterior/próximo para visualizar eventos.
Adicionar Eventos: Clique em um dia para abrir o modal de gerenciamento de eventos e adicionar detalhes do evento (título, horário, descrição).
Gerenciar Eventos: Visualize, edite ou exclua eventos existentes no modal de gerenciamento de eventos.
Alternar Visualizações: Alterne entre visualizações diária e semanal usando os respectivos botões.
Usar Temporizadores: Inicie, pause ou redefina o cronômetro e o temporizador de modo de foco para gerenciamento de tempo.



Estrutura do Código
chat.js

Inicialização:
Configura ouvintes de eventos para entrada de chat, botão de envio, caixas de seleção e alternância de tema.
Carrega seleções de doenças salvas do localStorage.


Funcionalidade de Chat:
Envia mensagens do usuário para a API de chat e exibe respostas.
Desativa o botão de envio quando a entrada está vazia.


Gerenciamento de Doenças:
Atualiza uma lista de medicamentos a evitar com base nas doenças selecionadas.
Detecta interações entre doenças selecionadas e exibe avisos.


Geração de PDF:
Usa jsPDF e autoTable para gerar um relatório com doenças, descrições, medicamentos a evitar e interações.


Recursos de UI:
Alterna o modo escuro e salva o estado no localStorage.
Implementa um menu suspenso com efeitos de desfoque no conteúdo principal.



dataanalise.js

Inicialização:
Configura ouvintes de eventos para envio de formulários, gerenciamento de arquivos, pesquisa e botões de análise.
Carrega dados de exames salvos do localStorage.


Manipulação de Formulários:
Gera dinamicamente campos de entrada para tipos de exames selecionados (por exemplo, hemograma, glicemia).
Salva dados de exames para vários meses no localStorage e os envia para a API de backend.


Visualização de Dados:
Cria gráficos de barras usando Chart.js, com cores indicando se os valores estão dentro das faixas ideais.
Exibe uma legenda compartilhada para as cores dos gráficos (vermelho: acima, verde: ideal, azul: abaixo).


Gerenciamento de Arquivos:
Lista arquivos salvos com opções para excluir ou analisar.
Implementa uma barra de pesquisa para filtrar arquivos salvos por nome.


Resumo de Saúde:
Gera um resumo dinâmico de saúde com base nos resultados dos exames e faixas ideais.
Calcula o IMC e exibe a classificação.


Notificações:
Exibe notificações temporárias para ações como salvar ou excluir arquivos.



calendario.js

Inicialização:
Carrega eventos salvos do localStorage e renderiza a grade do calendário.
Configura um relógio em tempo real e temporizadores.


Renderização do Calendário:
Exibe uma grade mensal com eventos marcados nos dias relevantes.
Suporta navegação entre meses e alternância entre visualizações diária/semanal.


Gerenciamento de Eventos:
Permite adicionar, editar e excluir eventos por meio de um modal.
Suporta arrastar e soltar para mover eventos entre dias.


Temporizadores:
Implementa um cronômetro e um temporizador de modo de foco com barras de progresso.
Salva estados do temporizador no localStorage.


Recursos de UI:
Alterna um menu suspenso com efeitos de desfoque no conteúdo principal.



Armazenamento de Dados

localStorage é usado para persistir:
selectedDiseases (chat.js): Array de IDs de doenças selecionadas.
formData (dataanalise.js): Objeto contendo resultados de exames para vários meses.
savedFiles (dataanalise.js): Array de arquivos de exames salvos com nomes, datas e dados.
calendarEvents (calendario.js): Array de eventos de calendário com nome, data, duração e descrição.
darkMode (chat.js): Preferência de tema (ativado/desativado).


Nota: O localStorage tem um limite de tamanho (geralmente 5-10 MB). Grandes conjuntos de dados podem causar QuotaExceededError.

Estilização

A aplicação assume um arquivo styles.css com classes para:
Interface de chat: .message, .user, .bot, .disabled, .dark-mode.
Análise de dados: .exam-section, .list-item, .icon-container, .chart-legend, .imc-section.
Calendário: .calendar-day, .day-events, .active, .today, .focusProgressBar.
UI geral: .blur-effect, .notification, .modal, .sidebar, .dropdown-menu.


Considerações de estilização:
Design responsivo para modais, gráficos e grade de calendário.
Suporte ao modo escuro usando a classe .dark-mode.
Animações para notificações e transições de modais.


Imagens (trash.png, analyse.png) são usadas para ícones de gerenciamento de arquivos.

Limitações

Apenas Client-Side: Os dados são armazenados no localStorage e não são sincronizados entre dispositivos sem um backend.
Dependência de Backend: O chat e o armazenamento de dados requerem APIs externas (http://127.0.0.1:8000/chat, http://127.0.0.1:5000/save_data) que não são fornecidas.
Segurança: Sem autenticação ou criptografia de dados; dados de saúde sensíveis são armazenados em texto simples no localStorage.
Arquivos Ausentes: index.html e styles.css são referenciados, mas não fornecidos, exigindo implementação.
Escalabilidade: O localStorage limita a quantidade de dados que podem ser armazenados.
Compatibilidade com Navegadores: Recursos como arrastar e soltar, Chart.js e jsPDF exigem navegadores modernos.

Melhorias Futuras

Implementar um backend (por exemplo, Flask, Node.js) para armazenamento seguro de dados e autenticação de usuários.
Adicionar chat em tempo real usando WebSockets para respostas mais rápidas.
Melhorar a acessibilidade com rótulos ARIA e navegação por teclado.
Suportar upload de arquivos para importar resultados de exames (por exemplo, CSV, JSON).
Integrar um banco de dados para persistência de dados de eventos e exames entre dispositivos.
Adicionar análises avançadas (por exemplo, linhas de tendência, modelos preditivos) para dados de exames.
Melhorar o tratamento de erros para falhas de API e limites do localStorage.

Contribuição
Contribuições são bem-vindas! Para contribuir:

Faça um fork do repositório.
Crie uma branch de recurso (git checkout -b nome-do-recurso).
Faça commit das alterações (git commit -m "Adicionar recurso").
Envie para a branch (git push origin nome-do-recurso).
Abra um pull request.

Certifique-se de que o código siga o estilo existente e inclua comentários para clareza.
Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para detalhes.
Agradecimentos

Construído com JavaScript puro, Chart.js e jsPDF para fins educacionais.
Inspirado em aplicações de monitoramento de saúde e produtividade.
Agradecimentos à comunidade de código aberto por fornecer bibliotecas robustas.

