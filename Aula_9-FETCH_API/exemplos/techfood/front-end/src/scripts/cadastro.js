/* ==========================================================
   CADASTRO.JS — Lógica do formulário de cadastro de pratos.

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 10 — Criado: validação de campos, preview de imagem
                 via FileReader (Base64), envio via POST /produtos
                 usando cadastrarProduto() do api.js,
                 feedback de sucesso/erro, limpeza do formulário.

   Estratégia de imagem: FileReader (Base64)
     - O usuário seleciona um arquivo local com <input type="file">
     - FileReader.readAsDataURL() converte para string Base64
     - A string é exibida na <img#preview-img> como src
     - A mesma string é enviada no campo "imagem" para o back-end

   Carregado DEPOIS de global.js e api.js em cadastro.html.
   ========================================================== */

/* ── REFERÊNCIAS AOS ELEMENTOS DO DOM ──────────────────────── */
const formCadastro      = document.getElementById("form-cadastro");
const inputImagem       = document.getElementById("input-imagem");
const btnEscolherImagem = document.getElementById("btn-escolher-imagem");
const previewBox        = document.getElementById("preview-box");
const previewImg        = document.getElementById("preview-img");
const previewPlaceholder = document.getElementById("preview-placeholder");
const nomeArquivo       = document.getElementById("nome-arquivo");
const inputNome         = document.getElementById("input-nome");
const inputDescricao    = document.getElementById("input-descricao");
const inputPreco        = document.getElementById("input-preco");
const inputCategoria    = document.getElementById("input-categoria");
const inputDisponivel   = document.getElementById("input-disponivel");
const textoDisponivel   = document.getElementById("texto-disponivel");
const feedbackCadastro  = document.getElementById("feedback-cadastro");
const btnLimparForm     = document.getElementById("btn-limpar-form");
const btnSalvar         = document.getElementById("btn-salvar");

// Guarda o Base64 da imagem selecionada
let imagemBase64 = "";

// ─────────────────────────────────────────────────────────────
// Inicialização
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  configurarUploadImagem();
  configurarToggleDisponivel();
  configurarLimpar();
  configurarEnvio();
});

// ─────────────────────────────────────────────────────────────
// configurarUploadImagem()
// Aula 10: estratégia FileReader (Base64).
//
// Fluxo:
//   1. Clicar em "Escolher imagem" → dispara o <input type="file">
//   2. Ao selecionar o arquivo → FileReader converte para Base64
//   3. A string Base64 é exibida como src da <img#preview-img>
//   4. A mesma string é guardada em imagemBase64 para o POST
//
// readAsDataURL() retorna uma string no formato:
//   "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
// Essa string pode ser usada diretamente no src de qualquer <img>.
// ─────────────────────────────────────────────────────────────
function configurarUploadImagem() {
  // Botão "Escolher imagem" abre o input file oculto
  btnEscolherImagem.addEventListener("click", function () {
    inputImagem.click();
  });

  // Quando o usuário escolhe um arquivo
  inputImagem.addEventListener("change", function () {
    const arquivo = inputImagem.files[0];

    // Se cancelou ou não escolheu nada
    if (!arquivo) return;

    // Atualiza o nome do arquivo exibido
    nomeArquivo.textContent = arquivo.name;

    // ── FileReader: converte imagem local para Base64 ─────────
    const reader = new FileReader();

    // Callback executado quando a leitura terminar
    reader.addEventListener("load", function () {
      imagemBase64 = reader.result; // "data:image/...;base64,..."

      // Exibe a preview
      previewImg.src = imagemBase64;
      previewImg.style.display = "block";
      previewPlaceholder.style.display = "none";
      previewBox.classList.add("com-imagem");
    });

    // Inicia a leitura como URL de dados (Base64)
    reader.readAsDataURL(arquivo);
  });
}

// ─────────────────────────────────────────────────────────────
// configurarToggleDisponivel()
// Atualiza o texto "Sim" / "Não" ao lado do toggle
// conforme o estado do checkbox.
// ─────────────────────────────────────────────────────────────
function configurarToggleDisponivel() {
  inputDisponivel.addEventListener("change", function () {
    textoDisponivel.textContent = inputDisponivel.checked ? "Sim" : "Não";
  });
}

// ─────────────────────────────────────────────────────────────
// configurarLimpar()
// Botão "Limpar" — volta tudo ao estado inicial.
// ─────────────────────────────────────────────────────────────
function configurarLimpar() {
  btnLimparForm.addEventListener("click", function () {
    limparFormulario();
  });
}

// ─────────────────────────────────────────────────────────────
// configurarEnvio()
// Captura o submit do formulário, valida os campos e,
// se tudo estiver certo, chama cadastrarProduto() do api.js.
// ─────────────────────────────────────────────────────────────
function configurarEnvio() {
  formCadastro.addEventListener("submit", async function (evento) {
    // Impede o reload da página (comportamento padrão do form)
    evento.preventDefault();

    // Limpa feedbacks e marcações de erro anteriores
    ocultarFeedback();
    limparMarcacoesErro();

    // Valida — se houver erro, para aqui
    if (!validarCampos()) return;

    // Monta o objeto de dados para enviar
    const dados = {
      nome:       inputNome.value.trim(),
      descricao:  inputDescricao.value.trim(),
      preco:      parseFloat(inputPreco.value),
      categoria:  inputCategoria.value,
      disponivel: inputDisponivel.checked,
      imagem:     imagemBase64 || null,
    };

    // Desabilita o botão para evitar duplo clique
    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";

    try {
      // POST /produtos via api.js
      await cadastrarProduto(dados);

      // Sucesso!
      exibirFeedback("✅ Prato cadastrado com sucesso! Já aparece no cardápio.", "sucesso");
      limparFormulario();

    } catch (erro) {
      // Exibe a mensagem de erro vinda do servidor (ou genérica)
      exibirFeedback("❌ Erro ao cadastrar: " + erro.message, "erro");

    } finally {
      // Reativa o botão independente do resultado
      btnSalvar.disabled = false;
      btnSalvar.textContent = "💾 Salvar Prato";
    }
  });
}

// ─────────────────────────────────────────────────────────────
// validarCampos()
// Verifica se os campos obrigatórios estão preenchidos.
// Marca com a classe CSS "campo-invalido" e retorna false
// se algo estiver errado.
// ─────────────────────────────────────────────────────────────
function validarCampos() {
  let valido = true;

  if (!inputNome.value.trim()) {
    inputNome.classList.add("campo-invalido");
    valido = false;
  }

  if (!inputDescricao.value.trim()) {
    inputDescricao.classList.add("campo-invalido");
    valido = false;
  }

  const preco = parseFloat(inputPreco.value);
  if (!inputPreco.value || isNaN(preco) || preco <= 0) {
    inputPreco.classList.add("campo-invalido");
    valido = false;
  }

  if (!inputCategoria.value) {
    inputCategoria.classList.add("campo-invalido");
    valido = false;
  }

  if (!valido) {
    exibirFeedback("⚠️ Preencha todos os campos obrigatórios antes de salvar.", "erro");
  }

  return valido;
}

// ─────────────────────────────────────────────────────────────
// limparMarcacoesErro()
// Remove a classe "campo-invalido" de todos os campos.
// ─────────────────────────────────────────────────────────────
function limparMarcacoesErro() {
  [inputNome, inputDescricao, inputPreco, inputCategoria].forEach(function (campo) {
    campo.classList.remove("campo-invalido");
  });
}

// ─────────────────────────────────────────────────────────────
// limparFormulario()
// Reseta todos os campos, a preview e o imagemBase64.
// ─────────────────────────────────────────────────────────────
function limparFormulario() {
  formCadastro.reset();
  imagemBase64 = "";

  // Reset da preview
  previewImg.src = "";
  previewImg.style.display = "none";
  previewPlaceholder.style.display = "block";
  previewBox.classList.remove("com-imagem");
  nomeArquivo.textContent = "Nenhum arquivo selecionado";

  // Reset do toggle
  textoDisponivel.textContent = "Sim";

  limparMarcacoesErro();
  ocultarFeedback();
}

// ─────────────────────────────────────────────────────────────
// exibirFeedback(mensagem, tipo)
// Exibe a mensagem de sucesso ou erro para o usuário.
// tipo: "sucesso" | "erro"
// ─────────────────────────────────────────────────────────────
function exibirFeedback(mensagem, tipo) {
  feedbackCadastro.textContent = mensagem;
  feedbackCadastro.className = tipo; // "sucesso" ou "erro"
  feedbackCadastro.style.display = "block";
}

// ─────────────────────────────────────────────────────────────
// ocultarFeedback()
// Esconde a caixa de feedback.
// ─────────────────────────────────────────────────────────────
function ocultarFeedback() {
  feedbackCadastro.style.display = "none";
  feedbackCadastro.textContent   = "";
  feedbackCadastro.className     = "";
}
