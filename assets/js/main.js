// Sistema de gerenciamento de estado
const AppState = {
  materias: [],
  cartoes: [],
  sessaoEstudo: {
    ativa: false,
    cartoes: [],
    indiceAtual: 0,
    revisados: 0,
  },
  // Sistema de repetição espaçada simples
  niveisDificuldade: [
    { id: 1, nome: "Difícil", intervalo: 1, multiplicador: 0.5 },
    { id: 2, nome: "Médio", intervalo: 3, multiplicador: 1 },
    { id: 3, nome: "Fácil", intervalo: 7, multiplicador: 1.5 },
  ],
};

// Elementos DOM
const elements = {
  loadingOverlay: document.getElementById("loadingOverlay"),
  mainMenu: document.getElementById("mainMenu"),
  panels: {
    materias: document.getElementById("panelMaterias"),
    cartoes: document.getElementById("panelCartoes"),
    estudar: document.getElementById("panelEstudar"),
    estatisticas: document.getElementById("panelEstatisticas"),
    exportar: document.getElementById("panelExportar"),
  },
};

// Inicialização
// Inicialização - VERSÃO ATUALIZADA
document.addEventListener("DOMContentLoaded", function () {
  mostrarLoading();

  // Resetar todas as animações no início
  configurarAnimações();

  setTimeout(() => {
    carregarDados();
    inicializarEventos();
    atualizarListas();
    ocultarLoading();

    // Animar entrada inicial com um pequeno atraso
    setTimeout(animarEntrada, 100);
  }, 800);
});

// Mostrar/ocultar loading
function mostrarLoading() {
  elements.loadingOverlay.classList.add("active");
}

function ocultarLoading() {
  elements.loadingOverlay.classList.remove("active");
}

// Animação de entrada
function animarEntrada() {
  // Animação para elementos com data-animate
  document.querySelectorAll("[data-animate]").forEach((el) => {
    el.classList.add("animated");
  });

  // Animação para cards
  const cards = document.querySelectorAll(".item-card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add("animated");
    }, 100);
  });
}

// Carregar dados do localStorage
function carregarDados() {
  const materiasSalvas = localStorage.getItem("flashcard_materias");
  const cartoesSalvos = localStorage.getItem("flashcard_cartoes");

  if (materiasSalvas) {
    AppState.materias = JSON.parse(materiasSalvas);
  }

  if (cartoesSalvos) {
    AppState.cartoes = JSON.parse(cartoesSalvos);
  }
}

// Salvar dados no localStorage
function salvarDados() {
  localStorage.setItem("flashcard_materias", JSON.stringify(AppState.materias));
  localStorage.setItem("flashcard_cartoes", JSON.stringify(AppState.cartoes));
}

// Inicializar eventos
function inicializarEventos() {
  // Menu principal
  document.querySelectorAll(".menu-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const panel = this.getAttribute("data-panel");

      // Animação de clique
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);

      mostrarPainel(panel);
    });
  });

  // Botões de fechar
  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const panel = this.getAttribute("data-close");

      // Animação de clique
      this.style.transform = "rotate(45deg) scale(0.8)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);

      ocultarPainelAtual();
    });
  });

  // Matérias
  document
    .getElementById("btnAddMateria")
    .addEventListener("click", function () {
      adicionarMateria();
      // Animação de clique
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 300);
    });

  // Cartões
  document
    .getElementById("btnAddCartao")
    .addEventListener("click", function () {
      adicionarCartao();
      // Animação de clique
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 300);
    });

  document.getElementById("btnFiltrar").addEventListener("click", function () {
    filtrarCartoes();
    // Animação de clique
    this.classList.add("clicked");
    setTimeout(() => this.classList.remove("clicked"), 300);
  });

  document
    .getElementById("btnLimparFiltro")
    .addEventListener("click", function () {
      limparFiltros();
      // Animação de clique
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 300);
    });

  // Estudo
  document.getElementById("flashcard").addEventListener("click", virarCartao);

  document
    .getElementById("btnPularCartao")
    .addEventListener("click", function () {
      pularCartao();
      // Animação de clique
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 300);
    });

  document
    .getElementById("btnFinalizarSessao")
    .addEventListener("click", function () {
      finalizarSessao();
      // Animação de clique
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 300);
    });

  document
    .getElementById("btnIniciarEstudo")
    .addEventListener("click", function () {
      iniciarSessaoEstudo();
      // Animação de clique
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 300);
    });

  // Exportação/Importação
  document
    .getElementById("btnExportMaterias")
    .addEventListener("click", function () {
      exportarCSV("materias");
      // Animação de clique
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 300);
    });

  document
    .getElementById("btnExportCartoes")
    .addEventListener("click", function () {
      exportarCSV("cartoes");
      // Animação de clique
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 300);
    });

  document
    .getElementById("btnExportCompleto")
    .addEventListener("click", function () {
      exportarBackupCompleto();
      // Animação de clique
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 300);
    });

  document
    .getElementById("btnSelecionarArquivo")
    .addEventListener("click", function () {
      document.getElementById("fileInput").click();
      // Animação de clique
      this.classList.add("clicked");
      setTimeout(() => this.classList.remove("clicked"), 300);
    });

  document
    .getElementById("fileInput")
    .addEventListener("change", handleFileSelect);
  document.getElementById("btnImportar").addEventListener("click", function () {
    importarDados();
    // Animação de clique
    this.classList.add("clicked");
    setTimeout(() => this.classList.remove("clicked"), 300);
  });

  // Área de importação com drag & drop
  const importArea = document.getElementById("importArea");
  importArea.addEventListener("dragover", handleDragOver);
  importArea.addEventListener("dragleave", handleDragLeave);
  importArea.addEventListener("drop", handleDrop);

  // Adicionar classe clicked para animação de clique
  document.addEventListener("click", function (e) {
    if (e.target.matches(".btn, .action-btn, .menu-btn")) {
      e.target.classList.add("clicked");
      setTimeout(() => e.target.classList.remove("clicked"), 300);
    }
  });
}

// Navegação entre painéis
function mostrarPainel(painelId) {
  ocultarMenuComAnimacao();

  setTimeout(() => {
    // Primeiro, ocultar todos os painéis com animação
    Object.values(elements.panels).forEach((panel) => {
      panel.classList.remove("active");
      panel.classList.remove("exiting");
    });

    // Adicionar um pequeno atraso antes de mostrar o novo painel
    setTimeout(() => {
      const painel = elements.panels[painelId];
      if (painel) {
        painel.classList.add("active");
        // Rolar para o topo do painel
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Animar entrada do novo painel
        painel.style.animation = "slideInRight 0.5s ease forwards";
      }

      // Atualizar conteúdo específico do painel
      if (painelId === "materias") {
        atualizarListaMaterias();
      } else if (painelId === "cartoes") {
        atualizarListaCartoes();
        atualizarSelectMaterias("cartaoMateria");
        atualizarSelectMaterias("filtroMateria");
      } else if (painelId === "estudar") {
        atualizarSelectMaterias("estudoMateria");
        atualizarContadorCartoes();
        atualizarBotoesDificuldade();
      } else if (painelId === "estatisticas") {
        atualizarEstatisticas();
      }
    }, 100); // Pequeno atraso para transição suave
  }, 400); // Tempo da animação de saída do menu
}

function ocultarMenuComAnimacao() {
  const menuBtns = document.querySelectorAll(".menu-btn");

  // Resetar animações primeiro
  configurarAnimações();

  // Animar saída de cada botão
  menuBtns.forEach((btn, index) => {
    btn.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    setTimeout(() => {
      btn.style.transform = "translateY(20px)";
      btn.style.opacity = "0";
    }, index * 50);
  });

  setTimeout(() => {
    elements.mainMenu.style.display = "none";
    // Não resetar aqui - será resetado quando o menu for mostrado novamente
  }, 400);
}

function ocultarPainelAtual() {
  const painelAtivo = document.querySelector(".panel.active");
  if (painelAtivo) {
    // Primeiro animar a saída do painel
    painelAtivo.style.animation = "slideOutLeft 0.4s ease forwards";

    setTimeout(() => {
      painelAtivo.classList.remove("active");
      painelAtivo.style.animation = "";

      // Mostrar menu principal com animação
      mostrarMenuComAnimacao();
    }, 400);
  }
}
// Nova função para garantir que as animações não se sobreponham
function configurarAnimações() {
  // Remover animações pendentes
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.style.animation = "";
  });

  // Resetar animações dos botões
  document.querySelectorAll(".menu-btn").forEach((btn) => {
    btn.style.animation = "";
    btn.style.opacity = "";
    btn.style.transform = "";
  });
}
function mostrarMenuComAnimacao() {
  elements.mainMenu.style.display = "grid";
  configurarAnimações(); // Resetar animações antes de mostrar

  const menuBtns = document.querySelectorAll(".menu-btn");

  // Resetar todas as animações primeiro
  menuBtns.forEach((btn) => {
    btn.style.transition = "none";
    btn.style.opacity = "0";
    btn.style.transform = "translateY(20px)";
  });

  // Forçar reflow para garantir que o reset seja aplicado
  void elements.mainMenu.offsetWidth;

  // Aplicar animação de entrada com delays
  menuBtns.forEach((btn, index) => {
    setTimeout(() => {
      btn.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      btn.style.opacity = "1";
      btn.style.transform = "translateY(0)";
    }, index * 100 + 100);
  });

  // Rolar para o topo
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Funções para matérias
function adicionarMateria() {
  const input = document.getElementById("novaMateria");
  const nome = input.value.trim();

  if (!nome) {
    mostrarNotificacao("Por favor, digite um nome para a matéria.", "warning");
    return;
  }

  // Verificar se já existe
  if (
    AppState.materias.some((m) => m.nome.toLowerCase() === nome.toLowerCase())
  ) {
    mostrarNotificacao("Já existe uma matéria com este nome.", "warning");
    return;
  }

  const novaMateria = {
    id: Date.now(),
    nome: nome,
    dataCriacao: new Date().toISOString(),
    cartoes: 0,
  };

  AppState.materias.push(novaMateria);
  salvarDados();

  // Animação de sucesso
  input.value = "";
  input.focus();

  mostrarNotificacao("Matéria adicionada com sucesso!", "success");
  atualizarListaMaterias();

  // Atualizar selects em outros painéis
  atualizarSelectMaterias("cartaoMateria");
  atualizarSelectMaterias("filtroMateria");
  atualizarSelectMaterias("estudoMateria");
}

function excluirMateria(id) {
  if (
    !confirm(
      "Tem certeza que deseja excluir esta matéria? Todos os cartões associados também serão excluídos."
    )
  ) {
    return;
  }

  // Remover cartões associados
  AppState.cartoes = AppState.cartoes.filter(
    (cartao) => cartao.materiaId !== id
  );

  // Remover matéria
  AppState.materias = AppState.materias.filter((m) => m.id !== id);

  salvarDados();
  mostrarNotificacao("Matéria excluída com sucesso!", "success");
  atualizarListaMaterias();
  atualizarListaCartoes();
}

function atualizarListaMaterias() {
  const container = document.getElementById("listaMaterias");

  if (AppState.materias.length === 0) {
    container.innerHTML =
      '<div class="empty-message">Nenhuma matéria cadastrada ainda.</div>';
    return;
  }

  // Contar cartões por matéria
  const contagemCartoes = {};
  AppState.cartoes.forEach((cartao) => {
    contagemCartoes[cartao.materiaId] =
      (contagemCartoes[cartao.materiaId] || 0) + 1;
  });

  container.innerHTML = AppState.materias
    .map(
      (materia, index) => `
        <div class="item-card" data-animate style="animation-delay: ${
          index * 0.1
        }s">
            <div class="item-header">
                <div class="item-title">${materia.nome}</div>
                <div class="item-actions">
                    <button class="action-btn" onclick="editarMateria(${
                      materia.id
                    })" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="excluirMateria(${
                      materia.id
                    })" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div style="color: var(--text-secondary); font-size: 0.9rem;">
                <i class="far fa-calendar"></i> Criada em: ${formatarData(
                  materia.dataCriacao
                )}<br>
                <i class="fas fa-sticky-note"></i> Cartões: ${
                  contagemCartoes[materia.id] || 0
                }
            </div>
        </div>
    `
    )
    .join("");

  // Animar entrada dos cards
  setTimeout(() => {
    document.querySelectorAll(".item-card").forEach((card) => {
      card.classList.add("animated");
    });
  }, 100);
}

function editarMateria(id) {
  const materia = AppState.materias.find((m) => m.id === id);
  if (!materia) return;

  const novoNome = prompt("Digite o novo nome para a matéria:", materia.nome);
  if (novoNome && novoNome.trim() !== materia.nome) {
    materia.nome = novoNome.trim();
    salvarDados();
    mostrarNotificacao("Matéria atualizada com sucesso!", "success");
    atualizarListaMaterias();

    // Atualizar selects
    atualizarSelectMaterias("cartaoMateria");
    atualizarSelectMaterias("filtroMateria");
    atualizarSelectMaterias("estudoMateria");
  }
}

// Funções para cartões
function adicionarCartao() {
  const materiaId = parseInt(document.getElementById("cartaoMateria").value);
  const pergunta = document.getElementById("cartaoPergunta").value.trim();
  const resposta = document.getElementById("cartaoResposta").value.trim();
  const tags = document.getElementById("cartaoTags").value.trim();

  if (!materiaId) {
    mostrarNotificacao("Por favor, selecione uma matéria.", "warning");
    return;
  }

  if (!pergunta || !resposta) {
    mostrarNotificacao(
      "Por favor, preencha tanto a pergunta quanto a resposta.",
      "warning"
    );
    return;
  }

  const novoCartao = {
    id: Date.now(),
    materiaId: materiaId,
    pergunta: pergunta,
    resposta: resposta,
    tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    dataCriacao: new Date().toISOString(),
    dataRevisao: new Date().toISOString(), // Primeira revisão agora
    nivel: 2, // Nível médio inicial
    proximaRevisao: calcularProximaRevisao(2),
    revisoes: 0,
    acertos: 0,
  };

  AppState.cartoes.push(novoCartao);
  salvarDados();

  // Limpar formulário
  document.getElementById("cartaoPergunta").value = "";
  document.getElementById("cartaoResposta").value = "";
  document.getElementById("cartaoTags").value = "";

  // Focar no campo de pergunta
  document.getElementById("cartaoPergunta").focus();

  mostrarNotificacao("Cartão adicionado com sucesso!", "success");
  atualizarListaCartoes();
}

function excluirCartao(id) {
  if (!confirm("Tem certeza que deseja excluir este cartão?")) {
    return;
  }

  AppState.cartoes = AppState.cartoes.filter((c) => c.id !== id);
  salvarDados();
  mostrarNotificacao("Cartão excluído com sucesso!", "success");
  atualizarListaCartoes();
}

function editarCartao(id) {
  const cartao = AppState.cartoes.find((c) => c.id === id);
  if (!cartao) return;

  const novaPergunta = prompt("Editar pergunta:", cartao.pergunta);
  if (novaPergunta === null) return;

  const novaResposta = prompt("Editar resposta:", cartao.resposta);
  if (novaResposta === null) return;

  const novasTags = prompt(
    "Editar tags (separadas por vírgula):",
    cartao.tags.join(", ")
  );

  cartao.pergunta = novaPergunta.trim();
  cartao.resposta = novaResposta.trim();
  cartao.tags = novasTags ? novasTags.split(",").map((t) => t.trim()) : [];

  salvarDados();
  mostrarNotificacao("Cartão atualizado com sucesso!", "success");
  atualizarListaCartoes();
}

function atualizarListaCartoes(filtroMateria = "", filtroTexto = "") {
  const container = document.getElementById("listaCartoes");
  let cartoesFiltrados = [...AppState.cartoes];

  // Aplicar filtros
  if (filtroMateria) {
    const materiaId = parseInt(filtroMateria);
    cartoesFiltrados = cartoesFiltrados.filter(
      (c) => c.materiaId === materiaId
    );
  }

  if (filtroTexto) {
    const texto = filtroTexto.toLowerCase();
    cartoesFiltrados = cartoesFiltrados.filter(
      (c) =>
        c.pergunta.toLowerCase().includes(texto) ||
        c.resposta.toLowerCase().includes(texto) ||
        c.tags.some((tag) => tag.toLowerCase().includes(texto))
    );
  }

  if (cartoesFiltrados.length === 0) {
    container.innerHTML =
      '<div class="empty-message">Nenhum cartão encontrado.</div>';
    return;
  }

  // Mapear IDs de matérias para nomes
  const mapaMaterias = {};
  AppState.materias.forEach((m) => {
    mapaMaterias[m.id] = m.nome;
  });

  container.innerHTML = cartoesFiltrados
    .map(
      (cartao, index) => `
        <div class="item-card" data-animate style="animation-delay: ${
          index * 0.1
        }s">
            <div class="item-header">
                <div class="item-title">${cartao.pergunta.substring(0, 50)}${
        cartao.pergunta.length > 50 ? "..." : ""
      }</div>
                <div class="item-actions">
                    <button class="action-btn" onclick="editarCartao(${
                      cartao.id
                    })" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="excluirCartao(${
                      cartao.id
                    })" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 10px;">
                <i class="fas fa-book"></i> ${
                  mapaMaterias[cartao.materiaId] || "Desconhecida"
                }<br>
                <i class="fas fa-redo"></i> Revisões: ${
                  cartao.revisoes
                } | Acertos: ${cartao.acertos}
            </div>
            <div style="font-size: 0.9rem; margin-top: 10px;">
                ${
                  cartao.tags.length > 0
                    ? `<i class="fas fa-tags"></i> ${cartao.tags
                        .map(
                          (t) =>
                            `<span style="background-color: #333; padding: 2px 6px; border-radius: 3px; margin-right: 5px;">${t}</span>`
                        )
                        .join("")}`
                    : ""
                }
            </div>
        </div>
    `
    )
    .join("");

  // Animar entrada dos cards
  setTimeout(() => {
    document.querySelectorAll(".item-card").forEach((card) => {
      card.classList.add("animated");
    });
  }, 100);
}

function filtrarCartoes() {
  const materiaId = document.getElementById("filtroMateria").value;
  const texto = document.getElementById("filtroTexto").value.trim();

  atualizarListaCartoes(materiaId, texto);
}

function limparFiltros() {
  document.getElementById("filtroMateria").value = "";
  document.getElementById("filtroTexto").value = "";
  atualizarListaCartoes();
}

// Funções para estudo
function iniciarSessaoEstudo() {
  const materiaId = document.getElementById("estudoMateria").value;
  const limite =
    parseInt(document.getElementById("cartoesPorSessao").value) || 20;
  const ignorarRevisao = document.getElementById("ignorarRevisao").checked;

  // Filtrar cartões para estudo
  let cartoesParaEstudar = AppState.cartoes.filter((cartao) => {
    // Filtrar por matéria se selecionada
    if (materiaId && cartao.materiaId !== parseInt(materiaId)) {
      return false;
    }

    // Se ignorar revisão está marcado, incluir TODOS os cartões
    if (ignorarRevisao) {
      return true;
    }

    // Caso contrário, apenas cartões pendentes
    const dataProximaRevisao = new Date(cartao.proximaRevisao);
    return dataProximaRevisao <= new Date() || cartao.revisoes === 0;
  });

  // Limitar quantidade
  cartoesParaEstudar = cartoesParaEstudar.slice(0, limite);

  if (cartoesParaEstudar.length === 0) {
    mostrarNotificacao(
      "Não há cartões disponíveis com os filtros selecionados!",
      "info"
    );
    return;
  }

  // Embaralhar cartões
  cartoesParaEstudar = embaralharArray(cartoesParaEstudar);

  // Configurar sessão
  AppState.sessaoEstudo = {
    ativa: true,
    cartoes: cartoesParaEstudar,
    indiceAtual: 0,
    revisados: 0,
    modoLivre: ignorarRevisao, // Guardar se está no modo livre
    acertosErros: {},
  };

  // Mostrar primeiro cartão
  mostrarCartaoEstudo();
  atualizarContadorCartoes();
  atualizarBotoesDificuldade();

  mostrarNotificacao(
    `Sessão iniciada com ${cartoesParaEstudar.length} cartões!${
      ignorarRevisao ? " (Modo Revisão Livre)" : ""
    }`,
    "success"
  );
}
function mostrarCartaoEstudo() {
  const sessao = AppState.sessaoEstudo;

  if (!sessao.ativa || sessao.indiceAtual >= sessao.cartoes.length) {
    finalizarSessao();
    return;
  }

  const cartao = sessao.cartoes[sessao.indiceAtual];
  const materia = AppState.materias.find((m) => m.id === cartao.materiaId);

  document.getElementById(
    "cardFront"
  ).innerHTML = `<h3>${cartao.pergunta}</h3>`;
  document.getElementById("cardBack").innerHTML = `<h3>${cartao.resposta}</h3>`;

  // Resetar estado do cartão
  document.getElementById("flashcard").classList.remove("flipped");

  // Animação de entrada do card
  const flashcard = document.getElementById("flashcard");
  flashcard.style.opacity = "0";
  flashcard.style.transform = "scale(0.8)";

  setTimeout(() => {
    flashcard.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    flashcard.style.opacity = "1";
    flashcard.style.transform = "scale(1)";
  }, 50);

  // Atualizar contador
  atualizarContadorCartoes();

  // Atualizar botões de acerto/erro
  atualizarBotoesAcertoErro();
}
function marcarAcertoErro(tipo) {
  const sessao = AppState.sessaoEstudo;
  const cartaoId = sessao.cartoes[sessao.indiceAtual]?.id;

  if (!cartaoId) return;

  // Se já está marcado com o mesmo tipo, desmarcar
  if (sessao.acertosErros[cartaoId] === tipo) {
    delete sessao.acertosErros[cartaoId];
    mostrarNotificacao("Marcação removida", "info");
  } else {
    // Marcar novo tipo
    sessao.acertosErros[cartaoId] = tipo;
    const mensagem = tipo === "acertou" ? "Acertou! ✅" : "Errou ❌";
    mostrarNotificacao(mensagem, tipo === "acertou" ? "success" : "warning");
  }

  atualizarBotoesAcertoErro();
}
function atualizarBotoesAcertoErro() {
  const sessao = AppState.sessaoEstudo;
  const cartaoId = sessao.cartoes[sessao.indiceAtual]?.id;
  const status = sessao.acertosErros[cartaoId];

  const btnAcertou = document.getElementById("btnAcertou");
  const btnErrou = document.getElementById("btnErrou");

  if (!btnAcertou || !btnErrou) return;

  // Resetar classes
  btnAcertou.classList.remove("active");
  btnErrou.classList.remove("active");

  // Aplicar classe ativa se já marcado
  if (status === "acertou") {
    btnAcertou.classList.add("active");
  } else if (status === "errou") {
    btnErrou.classList.add("active");
  }
}

function virarCartao() {
  const flashcard = document.getElementById("flashcard");
  flashcard.classList.toggle("flipped");

  // Pequena animação de clique
  flashcard.style.transform = "scale(0.98)";
  setTimeout(() => {
    flashcard.style.transform = "";
  }, 150);
}

function registrarResposta(nivelDificuldade) {
  const sessao = AppState.sessaoEstudo;
  const cartao = sessao.cartoes[sessao.indiceAtual];
  const cartaoId = cartao.id;

  // Animação no botão clicado
  const botao = event.target.closest(".btn");
  if (botao) {
    botao.style.transform = "scale(0.9)";
    setTimeout(() => {
      botao.style.transform = "";
    }, 200);
  }

  // Atualizar estatísticas do cartão
  cartao.revisoes++;

  // Se NÃO estiver no modo livre, atualizar a próxima revisão
  if (!sessao.modoLivre) {
    cartao.nivel = nivelDificuldade;
    cartao.proximaRevisao = calcularProximaRevisao(nivelDificuldade);
  }

  // Contar acerto baseado na marcação manual OU na dificuldade
  const marcacaoManual = sessao.acertosErros[cartaoId];

  if (marcacaoManual === "acertou") {
    cartao.acertos++;
  } else if (marcacaoManual === "errou") {
    // Não incrementa acertos
  } else {
    // Se não marcou manualmente, usar a lógica antiga (médio ou fácil = acerto)
    if (nivelDificuldade >= 2) {
      cartao.acertos++;
    }
  }

  sessao.revisados++;
  sessao.indiceAtual++;

  // Salvar mudanças
  salvarDados();

  // Feedback visual
  const feedback = ["Difícil! 😓", "Boa! 👍", "Excelente! 🎉"];
  mostrarNotificacao(feedback[nivelDificuldade - 1], "success");

  // Mostrar próximo cartão ou finalizar
  if (sessao.indiceAtual < sessao.cartoes.length) {
    setTimeout(() => {
      mostrarCartaoEstudo();
    }, 500);
  } else {
    setTimeout(() => {
      finalizarSessao();

      // Calcular estatísticas da sessão
      const totalMarcados = Object.keys(sessao.acertosErros).length;
      const acertos = Object.values(sessao.acertosErros).filter(
        (v) => v === "acertou"
      ).length;
      const erros = Object.values(sessao.acertosErros).filter(
        (v) => v === "errou"
      ).length;

      let mensagemFinal = `Sessão concluída! Você revisou ${sessao.revisados} cartões.`;
      if (totalMarcados > 0) {
        mensagemFinal += `\nAcertos: ${acertos} | Erros: ${erros}`;
      }

      mostrarNotificacao(mensagemFinal, "success");
    }, 500);
  }
}

function pularCartao() {
  AppState.sessaoEstudo.indiceAtual++;

  if (
    AppState.sessaoEstudo.indiceAtual < AppState.sessaoEstudo.cartoes.length
  ) {
    mostrarCartaoEstudo();
  } else {
    finalizarSessao();
  }
}

function finalizarSessao() {
  AppState.sessaoEstudo.ativa = false;
  document.getElementById("cardFront").innerHTML =
    '<h3>Sessão Finalizada</h3><p>Clique em "Iniciar Nova Sessão" para continuar estudando.</p>';
  document.getElementById("cardBack").innerHTML = "";
  document.getElementById("flashcard").classList.remove("flipped");
  atualizarContadorCartoes();
}

function atualizarContadorCartoes() {
  const sessao = AppState.sessaoEstudo;
  let texto = "";

  if (sessao.ativa && sessao.cartoes.length > 0) {
    texto = `Cartão ${sessao.indiceAtual + 1} de ${
      sessao.cartoes.length
    } | Revisados: ${sessao.revisados}`;
  } else {
    // Contar cartões pendentes
    const pendentes = AppState.cartoes.filter((c) => {
      const dataProximaRevisao = new Date(c.proximaRevisao);
      return dataProximaRevisao <= new Date();
    }).length;

    texto = `Total de cartões: ${AppState.cartoes.length} | Pendentes: ${pendentes}`;
  }

  document.getElementById("contadorCartoes").textContent = texto;
}

function atualizarBotoesDificuldade() {
  const container = document.getElementById("difficultyButtons");

  container.innerHTML = AppState.niveisDificuldade
    .map(
      (nivel, index) => `
        <button class="btn ${
          nivel.id === 1
            ? "btn-danger"
            : nivel.id === 2
            ? "btn-warning"
            : "btn-success"
        }" 
                onclick="registrarResposta(${nivel.id})"
                style="animation-delay: ${index * 0.1}s">
            <i class="fas fa-${
              nivel.id === 1 ? "times" : nivel.id === 2 ? "minus" : "check"
            }"></i>
            ${nivel.nome} (${nivel.intervalo} dia${
        nivel.intervalo !== 1 ? "s" : ""
      })
        </button>
    `
    )
    .join("");

  // Animar entrada dos botões
  setTimeout(() => {
    container.querySelectorAll(".btn").forEach((btn, index) => {
      btn.style.animationDelay = `${index * 0.1}s`;
    });
  }, 100);
}

// Funções para estatísticas
function atualizarEstatisticas() {
  const totalCartoes = AppState.cartoes.length;
  const totalMaterias = AppState.materias.length;

  // Calcular revisões e acertos
  let totalRevisoes = 0;
  let totalAcertos = 0;

  AppState.cartoes.forEach((c) => {
    totalRevisoes += c.revisoes;
    totalAcertos += c.acertos;
  });

  const taxaAcerto =
    totalRevisoes > 0 ? Math.round((totalAcertos / totalRevisoes) * 100) : 0;

  // Cartões pendentes
  const cartoesPendentes = AppState.cartoes.filter((c) => {
    const dataProximaRevisao = new Date(c.proximaRevisao);
    return dataProximaRevisao <= new Date();
  }).length;

  // Atualizar grid de estatísticas
  const statsGrid = document.getElementById("statsGrid");
  statsGrid.innerHTML = `
        <div class="stat-card" data-animate style="animation-delay: 0.1s">
            <div class="stat-label">Total de Cartões</div>
            <div class="stat-value">${totalCartoes}</div>
        </div>
        <div class="stat-card" data-animate style="animation-delay: 0.2s">
            <div class="stat-label">Total de Matérias</div>
            <div class="stat-value">${totalMaterias}</div>
        </div>
        <div class="stat-card" data-animate style="animation-delay: 0.3s">
            <div class="stat-label">Cartões Pendentes</div>
            <div class="stat-value">${cartoesPendentes}</div>
        </div>
        <div class="stat-card" data-animate style="animation-delay: 0.4s">
            <div class="stat-label">Taxa de Acerto</div>
            <div class="stat-value">${taxaAcerto}%</div>
        </div>
    `;

  // Atualizar gráfico por matéria
  atualizarGraficoMaterias();
}

function atualizarGraficoMaterias() {
  const container = document.getElementById("graficoMaterias");

  if (AppState.materias.length === 0) {
    container.innerHTML =
      '<div class="empty-message">Nenhuma matéria cadastrada.</div>';
    return;
  }

  // Agrupar cartões por matéria
  const contagemPorMateria = {};
  AppState.materias.forEach((m) => {
    const cartoesDaMateria = AppState.cartoes.filter(
      (c) => c.materiaId === m.id
    );
    contagemPorMateria[m.nome] = cartoesDaMateria.length;
  });

  // Criar gráfico simples em HTML
  let graficoHTML = '<div style="margin-top: 20px;">';

  Object.entries(contagemPorMateria).forEach(([materia, quantidade], index) => {
    const porcentagem =
      AppState.cartoes.length > 0
        ? Math.round((quantidade / AppState.cartoes.length) * 100)
        : 0;

    graficoHTML += `
            <div style="margin-bottom: 15px;" data-animate style="animation-delay: ${
              index * 0.1
            }s">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>${materia}</span>
                    <span>${quantidade} cartões (${porcentagem}%)</span>
                </div>
                <div style="height: 10px; background-color: var(--bg-card); border-radius: 5px; overflow: hidden;">
                    <div style="height: 100%; width: ${porcentagem}%; background-color: var(--accent); border-radius: 5px; transition: width 1s ease;"></div>
                </div>
            </div>
        `;
  });

  graficoHTML += "</div>";
  container.innerHTML = graficoHTML;

  // Animar barras
  setTimeout(() => {
    container.querySelectorAll("[data-animate]").forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("animated");
      }, index * 100);
    });
  }, 100);
}

// Funções para exportação/importação
function exportarCSV(tipo) {
  let conteudoCSV = "";
  let nomeArquivo = "";

  if (tipo === "materias") {
    nomeArquivo = "Materias.csv";
    conteudoCSV = "ID,Nome,DataCriacao,Cartoes\n";

    // Contar cartões por matéria
    const contagemCartoes = {};
    AppState.cartoes.forEach((cartao) => {
      contagemCartoes[cartao.materiaId] =
        (contagemCartoes[cartao.materiaId] || 0) + 1;
    });

    AppState.materias.forEach((materia) => {
      conteudoCSV += `${materia.id},"${materia.nome}","${
        materia.dataCriacao
      }",${contagemCartoes[materia.id] || 0}\n`;
    });
  } else if (tipo === "cartoes") {
    nomeArquivo = "Cartoes.csv";
    conteudoCSV =
      "ID,MateriaID,Pergunta,Resposta,Tags,DataCriacao,DataRevisao,ProximaRevisao,Nivel,Revisoes,Acertos\n";

    AppState.cartoes.forEach((cartao) => {
      conteudoCSV += `${cartao.id},${
        cartao.materiaId
      },"${cartao.pergunta.replace(/"/g, '""')}","${cartao.resposta.replace(
        /"/g,
        '""'
      )}","${cartao.tags.join(",")}","${cartao.dataCriacao}","${
        cartao.dataRevisao
      }","${cartao.proximaRevisao}",${cartao.nivel},${cartao.revisoes},${
        cartao.acertos
      }\n`;
    });
  }

  // Criar e baixar arquivo
  const blob = new Blob([conteudoCSV], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nomeArquivo;
  link.click();

  mostrarNotificacao(
    `Arquivo ${nomeArquivo} exportado com sucesso!`,
    "success"
  );
}

function exportarBackupCompleto() {
  const backup = {
    materias: AppState.materias,
    cartoes: AppState.cartoes,
    dataBackup: new Date().toISOString(),
    versao: "1.0",
  };

  // Usar JSON escapado corretamente
  const backupJSON = JSON.stringify(backup);
  const backupEscapado = backupJSON.replace(/"/g, '""');

  const conteudoCSV = `Tipo,Conteudo\nBACKUP,"${backupEscapado}"\n`;

  const blob = new Blob([conteudoCSV], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `FlashCard_Backup_${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  link.click();

  mostrarNotificacao("Backup completo exportado com sucesso!", "success");
}
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    lerArquivoCSV(file);
  }
}

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById("importArea").classList.add("drag-over");
}

function handleDragLeave(event) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById("importArea").classList.remove("drag-over");
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById("importArea").classList.remove("drag-over");

  const file = event.dataTransfer.files[0];
  if (file && file.name.endsWith(".csv")) {
    lerArquivoCSV(file);
  } else {
    mostrarNotificacao("Por favor, selecione um arquivo CSV.", "warning");
  }
}

function lerArquivoCSV(file) {
  mostrarLoading();

  const reader = new FileReader();

  reader.onload = function (e) {
    setTimeout(() => {
      const conteudo = e.target.result;
      processarArquivoCSV(conteudo, file.name);
      ocultarLoading();
    }, 800);
  };

  reader.readAsText(file);
}

function processarArquivoCSV(conteudo, nomeArquivo) {
  const linhas = conteudo.split("\n").filter((linha) => linha.trim());

  // Verificar se é um backup completo
  if (linhas[0].trim() === "Tipo,Conteudo" && linhas.length >= 2) {
    const segundaLinha = linhas[1];

    // Extrair o JSON do backup
    if (segundaLinha.startsWith('BACKUP,"')) {
      try {
        // Remover 'BACKUP,"' do início e '"' do final
        let jsonString = segundaLinha.substring(8); // Remove 'BACKUP,"'

        // Remover aspas finais e possíveis quebras de linha
        jsonString = jsonString.replace(/"\s*$/, "");

        // Decodificar aspas duplas escapadas
        jsonString = jsonString.replace(/""/g, '"');

        const backupJSON = JSON.parse(jsonString);

        AppState.materias = backupJSON.materias || [];
        AppState.cartoes = backupJSON.cartoes || [];
        salvarDados();
        atualizarListas();
        mostrarNotificacao(
          `Backup "${nomeArquivo}" importado com sucesso!`,
          "success"
        );
        return;
      } catch (e) {
        console.error("Erro ao processar backup:", e);
        mostrarNotificacao(
          "Erro ao importar backup. Arquivo corrompido ou formato inválido.",
          "danger"
        );
        return;
      }
    }
  }

  // Processar arquivo regular (continua igual)
  const cabecalho = linhas[0].split(",");

  if (cabecalho[0] === "ID" && cabecalho[1] === "Nome") {
    // Arquivo de matérias
    const acao = document.getElementById("importAction").value;

    if (acao === "replace") {
      AppState.materias = [];
    }

    for (let i = 1; i < linhas.length; i++) {
      if (!linhas[i].trim()) continue;

      const valores = parseCSVLinha(linhas[i]);

      if (valores.length >= 3) {
        const novaMateria = {
          id: parseInt(valores[0]),
          nome: valores[1],
          dataCriacao: valores[2] || new Date().toISOString(),
          cartoes: parseInt(valores[3]) || 0,
        };

        if (!AppState.materias.some((m) => m.id === novaMateria.id)) {
          AppState.materias.push(novaMateria);
        }
      }
    }

    salvarDados();
    atualizarListas();
    mostrarNotificacao(
      `Matérias de "${nomeArquivo}" importadas com sucesso!`,
      "success"
    );
  } else if (cabecalho[0] === "ID" && cabecalho[1] === "MateriaID") {
    // Arquivo de cartões
    const acao = document.getElementById("importAction").value;

    if (acao === "replace") {
      AppState.cartoes = [];
    }

    for (let i = 1; i < linhas.length; i++) {
      if (!linhas[i].trim()) continue;

      const valores = parseCSVLinha(linhas[i]);

      if (valores.length >= 11) {
        const novoCartao = {
          id: parseInt(valores[0]),
          materiaId: parseInt(valores[1]),
          pergunta: valores[2],
          resposta: valores[3],
          tags: valores[4] ? valores[4].split(",") : [],
          dataCriacao: valores[5] || new Date().toISOString(),
          dataRevisao: valores[6] || new Date().toISOString(),
          proximaRevisao: valores[7] || calcularProximaRevisao(2),
          nivel: parseInt(valores[8]) || 2,
          revisoes: parseInt(valores[9]) || 0,
          acertos: parseInt(valores[10]) || 0,
        };

        if (!AppState.cartoes.some((c) => c.id === novoCartao.id)) {
          AppState.cartoes.push(novoCartao);
        }
      }
    }

    salvarDados();
    atualizarListas();
    mostrarNotificacao(
      `Cartões de "${nomeArquivo}" importados com sucesso!`,
      "success"
    );
  } else {
    mostrarNotificacao("Formato de arquivo CSV não reconhecido.", "warning");
  }
}

function importarDados() {
  const fileInput = document.getElementById("fileInput");

  if (!fileInput.files.length) {
    mostrarNotificacao(
      "Por favor, selecione um arquivo CSV primeiro.",
      "warning"
    );
    return;
  }

  lerArquivoCSV(fileInput.files[0]);
  fileInput.value = ""; // Resetar input
}

// Funções auxiliares
function parseCSVLinha(linha) {
  const valores = [];
  let valorAtual = "";
  let dentroDeAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const char = linha[i];

    if (char === '"') {
      dentroDeAspas = !dentroDeAspas;
    } else if (char === "," && !dentroDeAspas) {
      valores.push(valorAtual);
      valorAtual = "";
    } else {
      valorAtual += char;
    }
  }

  valores.push(valorAtual);
  return valores;
}

function atualizarSelectMaterias(selectId) {
  const select = document.getElementById(selectId);
  const valorAtual = select.value;

  select.innerHTML = '<option value="">Todas as matérias</option>';

  AppState.materias.forEach((materia) => {
    const option = document.createElement("option");
    option.value = materia.id;
    option.textContent = materia.nome;
    select.appendChild(option);
  });

  // Restaurar valor anterior se ainda existir
  if (valorAtual) {
    select.value = valorAtual;
  }
}

function calcularProximaRevisao(nivel) {
  const hoje = new Date();
  const intervalo =
    AppState.niveisDificuldade.find((n) => n.id === nivel)?.intervalo || 3;

  const proximaData = new Date(hoje);
  proximaData.setDate(hoje.getDate() + intervalo);

  return proximaData.toISOString();
}

function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR");
}

function embaralharArray(array) {
  const novoArray = [...array];
  for (let i = novoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
  }
  return novoArray;
}

function atualizarListas() {
  atualizarListaMaterias();
  atualizarListaCartoes();
  atualizarSelectMaterias("cartaoMateria");
  atualizarSelectMaterias("filtroMateria");
  atualizarSelectMaterias("estudoMateria");
  atualizarEstatisticas();
  atualizarContadorCartoes();
}

// Sistema de notificações
function mostrarNotificacao(mensagem, tipo = "info") {
  // Remover notificações anteriores
  const notificacoesAntigas = document.querySelectorAll(".notification");
  notificacoesAntigas.forEach((n) => n.remove());

  const notification = document.createElement("div");
  notification.className = `notification notification-${tipo}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${
              tipo === "success"
                ? "check-circle"
                : tipo === "warning"
                ? "exclamation-triangle"
                : tipo === "danger"
                ? "times-circle"
                : "info-circle"
            }"></i>
            <span>${mensagem}</span>
        </div>
    `;

  // Estilos para a notificação
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${
          tipo === "success"
            ? "var(--success)"
            : tipo === "warning"
            ? "var(--warning)"
            : tipo === "danger"
            ? "var(--danger)"
            : "var(--accent)"
        };
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 400px;
        animation: slideInRight 0.5s forwards;
    `;

  document.body.appendChild(notification);

  // Animação de entrada
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 10);

  // Remover após 4 segundos
  setTimeout(() => {
    notification.style.transform = "translateX(150%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 400);
  }, 4000);
}

// Adicionar estilos CSS para a notificação
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(150%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(notificationStyles);

// Inicializar selects
atualizarSelectMaterias("cartaoMateria");
atualizarSelectMaterias("filtroMateria");
atualizarSelectMaterias("estudoMateria");
