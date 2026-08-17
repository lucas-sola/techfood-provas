/* ==========================================================
<<<<<<< HEAD:Aula_9-FETCH_API/exemplos/techfood/front-end/src/scripts/cadastro.js
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
=======
   CADASTRO.JS — Lógica da página de Cadastro de Prato (cadastro.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 10 — configurarFormularioCadastro(): captura o submit do
                   formulário, monta um FormData (texto + arquivo) e
                   envia via cadastrarProduto() (POST /produtos do api.js).
                 ⚠ FRONT GENÉRICO: este arquivo apenas COLETA os campos e
                   ENVIA. O formato exato esperado pelo back-end é combinado
                   em sala — ver o bloco "PONTO DE AJUSTE COM A TURMA" abaixo.
   [ ] Futuro  — Validação visual campo a campo (borda vermelha no inválido).
                 Pré-visualização da imagem antes de enviar.
                 Limpar o formulário e redirecionar ao cardápio após sucesso.

   Carregado DEPOIS de global.js e api.js (depende de cadastrarProduto).
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  configurarFormularioCadastro();
});

// ─────────────────────────────────────────────────────────────────────────────
// configurarFormularioCadastro()                                          NEW
// Aula 10: escuta o "submit" do formulário e envia o prato ao servidor.
//
// Por que escutar "submit" e não "click" no botão?
//   O evento submit cobre tanto o clique no botão quanto o Enter no campo —
//   é o evento certo para formulários.
//
// event.preventDefault():
//   Sem isso, o navegador recarrega a página ao enviar o formulário
//   (comportamento padrão do HTML). Queremos controlar o envio pelo JS.
// ─────────────────────────────────────────────────────────────────────────────
function configurarFormularioCadastro() {
  const form = document.querySelector("#form-cadastro");
  if (!form) return;

  const feedback = document.querySelector("#feedback-cadastro");
  const botao    = document.querySelector("#btn-cadastrar");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // impede o reload padrão do formulário

    // ── 1. COLETAR os campos do formulário ───────────────────────────────────
    // Lemos cada campo pelo id. Esses valores vão para o FormData abaixo.
    const nome      = document.querySelector("#nome").value.trim();
    const descricao = document.querySelector("#descricao").value.trim();
    const preco     = document.querySelector("#preco").value;
    const categoria = document.querySelector("#categoria").value;
    const inputImg  = document.querySelector("#imagem");
    const arquivo   = inputImg.files[0]; // o arquivo escolhido (ou undefined)

    // ── 2. VALIDAÇÃO simples no front ────────────────────────────────────────
    // O back-end também valida — mas validar aqui evita requisições inúteis
    // e dá feedback imediato ao usuário.
    if (!nome || !descricao || !preco || !categoria) {
      mostrarFeedback("Preencha todos os campos obrigatórios.", "erro");
      return;
    }

    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ PONTO DE AJUSTE COM A TURMA                                          │
    // │                                                                     │
    // │ FormData é o "pacote" que aceita texto E arquivo no mesmo envio.    │
    // │ Cada .append(chave, valor) adiciona um campo ao pacote.            │
    // │                                                                     │
    // │ ⚠ As CHAVES abaixo (nome, descricao, preco, categoria, imagem)     │
    // │   precisam BATER com o que o BACK-END de vocês espera receber.     │
    // │   Cada grupo fez o back de um jeito — ajustem aqui conforme o de    │
    // │   vocês. Se o back espera "foto" em vez de "imagem", troquem aqui.  │
    // └─────────────────────────────────────────────────────────────────────┘
    const dados = new FormData();
    dados.append("nome", nome);
    dados.append("descricao", descricao);
    dados.append("preco", preco);
    dados.append("categoria", categoria);
    if (arquivo) {
      dados.append("imagem", arquivo); // só anexa se o usuário escolheu uma foto
    }

    // ── 3. ENVIAR ao servidor ────────────────────────────────────────────────
    botao.disabled    = true;
    botao.textContent = "Enviando...";
    mostrarFeedback("", "");

    try {
      // cadastrarProduto() (api.js) faz o POST /produtos com o FormData.
      // Lembrete: api.js NÃO coloca Content-Type — o navegador define sozinho.
      const resposta = await cadastrarProduto(dados);

      mostrarFeedback("✓ Prato cadastrado com sucesso!", "sucesso");
      form.reset(); // limpa os campos

      // (Opcional — descomentar se quiser voltar ao cardápio após cadastrar)
      // setTimeout(function () { window.location.href = "index.html"; }, 1500);

    } catch (erro) {
      // Mostra a mensagem de erro que veio do back-end (ou de rede).
      mostrarFeedback("Erro ao cadastrar: " + erro.message, "erro");
    } finally {
      // finally roda SEMPRE (deu certo ou não) — reabilita o botão.
      botao.disabled    = false;
      botao.textContent = "Cadastrar Prato";
>>>>>>> e1eb2c9053a2a206a9acbdfce721f2557c16e906:JAVASCRIPT/Aula_10-CADASTRO/exemplos/techfood/front-end/src/scripts/cadastro.js
    }
  });
}

<<<<<<< HEAD:Aula_9-FETCH_API/exemplos/techfood/front-end/src/scripts/cadastro.js
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
=======
// ─────────────────────────────────────────────────────────────────────────────
// mostrarFeedback(texto, tipo)
// Exibe a mensagem de sucesso/erro abaixo do botão.
// tipo: "sucesso" (verde) | "erro" (vermelho) | "" (limpa)
// ─────────────────────────────────────────────────────────────────────────────
function mostrarFeedback(texto, tipo) {
  const feedback = document.querySelector("#feedback-cadastro");
  if (!feedback) return;

  feedback.textContent = texto;
  feedback.className   = "feedback-cadastro"; // reseta as classes
  if (tipo) feedback.classList.add(tipo);
>>>>>>> e1eb2c9053a2a206a9acbdfce721f2557c16e906:JAVASCRIPT/Aula_10-CADASTRO/exemplos/techfood/front-end/src/scripts/cadastro.js
}
