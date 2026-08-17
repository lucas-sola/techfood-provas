/* ============================================
   Demonstração Interativa — Kickoff
   Cada botão dispara uma função demoX() que
   mostra o conceito no console visual e/ou
   na área de visualização à direita.
   ============================================ */

// Estado global do demo — reseta a cada clique em "Resetar"
let pratoAtual = null;

const consoleEl = document.getElementById('console');
const visualEl  = document.getElementById('visual');


// Helpers do console visual
function log(html) {
  consoleEl.innerHTML += html + '\n';
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function clearConsole() {
  consoleEl.innerHTML = '';
}


// ============================================
// Classe Prato — a mesma dos slides da aula
// ============================================
class Prato {
  constructor(nome, preco, categoria) {
    this.nome = nome;
    this.preco = preco;
    this.categoria = categoria;
  }

  formatarPreco() {
    return `R$ ${this.preco.toFixed(2).replace('.', ',')}`;
  }
}


// ============================================
// DEMOS
// ============================================

function demoClasse() {
  clearConsole();
  log('<span class="titulo">1️⃣ CRIAR UMA CLASSE</span>');
  log('<span class="comentario">// A classe é o MOLDE. Não existe no mundo real ainda.</span>');
  log('<span class="comando">class Prato {\n  constructor(nome, preco, categoria) {\n    this.nome = nome;\n    this.preco = preco;\n    this.categoria = categoria;\n  }\n}</span>');
  log('<span class="resultado">✅ Classe Prato definida (nenhum prato existe ainda!)</span>');
}


function demoObjeto() {
  clearConsole();
  log('<span class="titulo">2️⃣ INSTANCIAR UM OBJETO</span>');
  log('<span class="comentario">// Agora criamos um PRATO DE VERDADE a partir do molde.</span>');
  log('<span class="comando">const feijoada = new Prato("Feijoada", 42.90, "Prato Principal");</span>');

  pratoAtual = new Prato("Feijoada", 42.90, "Prato Principal");

  log('<span class="resultado">✅ Objeto criado:</span>');
  log('<span class="resultado">   feijoada.nome      = "' + pratoAtual.nome + '"</span>');
  log('<span class="resultado">   feijoada.preco     = ' + pratoAtual.preco + '</span>');
  log('<span class="resultado">   feijoada.categoria = "' + pratoAtual.categoria + '"</span>');
}


function demoMetodo() {
  if (!pratoAtual) {
    clearConsole();
    log('<span class="comentario">⚠️ Instancie um objeto primeiro (botão 2).</span>');
    return;
  }

  clearConsole();
  log('<span class="titulo">3️⃣ CHAMAR UM MÉTODO</span>');
  log('<span class="comentario">// Métodos são o que o objeto SABE FAZER.</span>');
  log('<span class="comando">feijoada.formatarPreco();</span>');
  log('<span class="resultado">✅ Retornou: "' + pratoAtual.formatarPreco() + '"</span>');
  log('');
  log('<span class="comentario">// Repare: a formatação está DENTRO da classe.\n// Se mudarmos a regra (dólar, real...), muda em um lugar só.</span>');
}


function demoSelecionar() {
  clearConsole();
  visualEl.innerHTML = '<h3 id="alvo" style="color:#C1272D;">👋 Sou um H3 no DOM</h3>';

  log('<span class="titulo">4️⃣ SELECIONAR ELEMENTO (DOM)</span>');
  log('<span class="comentario">// Coloquei um &lt;h3&gt; na área visual à direita.</span>');
  log('<span class="comando">const alvo = document.querySelector("#alvo");</span>');
  log('<span class="resultado">✅ Elemento selecionado.</span>');
  log('<span class="resultado">   alvo.textContent = "' + document.getElementById('alvo').textContent + '"</span>');
}


function demoManipular() {
  clearConsole();
  visualEl.innerHTML = '<h3 id="alvo" style="color:#C1272D;">👋 Sou um H3 no DOM</h3>';

  log('<span class="titulo">5️⃣ MANIPULAR ELEMENTO</span>');
  log('<span class="comentario">// Vou mudar o texto e a cor do H3 ao vivo.</span>');
  log('<span class="comando">alvo.textContent = "Fui manipulado!";</span>');
  log('<span class="comando">alvo.style.color = "#1a7a3a";</span>');

  // Delay pequeno pra o aluno perceber a mudança acontecer
  setTimeout(() => {
    const el = document.getElementById('alvo');
    el.textContent = "✨ Fui manipulado!";
    el.style.color = "#1a7a3a";
    log('<span class="resultado">✅ Olha à direita! O DOM mudou.</span>');
  }, 300);
}


function demoRenderizar() {
  clearConsole();
  visualEl.innerHTML = '';

  log('<span class="titulo">6️⃣ RENDERIZAR LISTA DINÂMICA</span>');
  log('<span class="comentario">// Instanciamos 3 pratos e criamos 1 div por prato.</span>');
  log('<span class="comando">const pratos = [\n  new Prato("Feijoada", 42.90, "Principal"),\n  new Prato("Coxinha", 8.50, "Petisco"),\n  new Prato("Brigadeiro", 6.00, "Sobremesa"),\n];</span>');
  log('<span class="comando">pratos.forEach(p =&gt; {\n  const div = document.createElement("div");\n  div.textContent = p.nome + " - " + p.formatarPreco();\n  visual.appendChild(div);\n});</span>');

  const pratos = [
    new Prato("Feijoada", 42.90, "Principal"),
    new Prato("Coxinha", 8.50, "Petisco"),
    new Prato("Brigadeiro", 6.00, "Sobremesa"),
  ];

  pratos.forEach(p => {
    const div = document.createElement('div');
    div.className = 'card-visual';
    div.textContent = `${p.nome} — ${p.formatarPreco()}`;
    visualEl.appendChild(div);
  });

  log('<span class="resultado">✅ 3 cards renderizados à direita.</span>');
}


function demoEvento() {
  clearConsole();
  visualEl.innerHTML = '';

  log('<span class="titulo">7️⃣ ADICIONAR EVENTO DE CLIQUE</span>');
  log('<span class="comentario">// Cada card ganha um addEventListener.\n// Clique nos cards à direita para ver acontecer.</span>');
  log('<span class="comando">card.addEventListener("click", () =&gt; {\n  card.classList.toggle("destaque");\n});</span>');

  const pratos = [
    new Prato("Feijoada", 42.90, "Principal"),
    new Prato("Coxinha", 8.50, "Petisco"),
    new Prato("Brigadeiro", 6.00, "Sobremesa"),
  ];

  pratos.forEach(p => {
    const div = document.createElement('div');
    div.className = 'card-visual';
    div.textContent = `👉 Clique aqui: ${p.nome}`;

    // Closure sobre `p` — cada card sabe qual prato representa
    div.addEventListener('click', () => {
      div.classList.toggle('destaque');
      log('<span class="resultado">🖱️  Você clicou em: ' + p.nome + '</span>');
    });

    visualEl.appendChild(div);
  });

  log('<span class="resultado">✅ Cards prontos — clique neles!</span>');
}


function resetar() {
  pratoAtual = null;
  clearConsole();
  visualEl.innerHTML = '<em style="color:#888;">Área visual aparece aqui quando envolver DOM.</em>';
  log('<span class="comentario">// Estado limpo. Comece de novo.</span>');
}
