// ==========================================
// 1. NOSSO BANCO DE DADOS LOCAL (PRODUTOS)
// ==========================================
// Você pode adicionar, remover ou editar produtos simplesmente alterando este Array.
const products = [
    { id: 1, name: "Burger Smash Duplo", category: "burgers", price: 28.00, desc: "Pão brioche, 2 carnes smash 90g, queijo cheddar derretido e maionese da casa.", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80" },
    { id: 2, name: "Burger Bacon Supremo", category: "burgers", price: 35.00, desc: "Pão australiano, blend 160g, tiras de bacon crocante, cebola caramelizada.", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80" },
    { id: 3, name: "Chicken Crispy", category: "burgers", price: 25.00, desc: "Pão gergelim, frango empanado super crocante, alface americana e molho tártaro.", img: "https://images.unsplash.com/photo-1615557960916-5f4791effe9d?w=400&q=80" },
    { id: 4, name: "Batata Frita Tradicional", category: "porcoes", price: 18.00, desc: "Porção de 400g de batata frita palito, super sequinha e crocante.", img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&q=80" },
    { id: 5, name: "Batata com Cheddar e Bacon", category: "porcoes", price: 26.00, desc: "Porção de 400g coberta com creme de cheddar e farofa de bacon.", img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
    { id: 6, name: "Onion Rings", category: "porcoes", price: 22.00, desc: "Anéis de cebola empanados acompanhados de molho barbecue (12 unidades).", img: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80" },
    { id: 7, name: "Coca-Cola Lata", category: "drinks", price: 6.00, desc: "350ml bem gelada.", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },
    // IMAGEM DO SUCO CORRIGIDA ABAIXO 👇
    { id: 8, name: "Suco Natural de Laranja", category: "drinks", price: 9.00, desc: "Copo 500ml feito na hora, sem açúcar adicionado.", img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80" }
];

// Array que guarda os itens que o cliente colocou no pedido
let cart = [];

// O número do WhatsApp que vai receber os pedidos (Não esqueça o DDI 55)
const phone = "5518996182918";


// ==========================================
// 2. LÓGICA DE EXIBIÇÃO E FILTROS
// ==========================================

// Função que cria os lanches na tela baseada na categoria escolhida
function renderMenu(category = 'all') {
    const menu = document.getElementById('menu');

    // Se a categoria for 'all' (Todos), exibe tudo. Senão, filtra.
    const filteredProducts = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    // Mapeia os produtos filtrados e transforma em HTML
    menu.innerHTML = filteredProducts.map(p => `
        <div class="item-card">
            <img src="${p.img}" class="item-img" loading="lazy" alt="${p.name}">
            <div class="item-info">
                <div>
                    <h3>${p.name}</h3>
                    <p>${p.desc}</p>
                </div>
                <div class="price-row">
                    <span class="price">R$ ${p.price.toFixed(2)}</span>
                    <!-- O botão chama a função addToCart passando a ID do lanche -->
                    <button class="add-btn" onclick="addToCart(${p.id})">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Muda a aparência do botão da categoria e recarrega os itens
function filterCategory(category, element) {
    // Tira a classe 'active' de todos os botões
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    // Coloca a classe 'active' só no botão que foi clicado
    element.classList.add('active');
    // Manda desenhar a lista de novo
    renderMenu(category);
}


// ==========================================
// 3. LÓGICA DO CARRINHO
// ==========================================

// Quando clica em "+" na lista de produtos
function addToCart(id) {
    // Procura se esse item já está no carrinho
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        // Se já tiver, só soma +1 na quantidade
        existingItem.quantity += 1;
    } else {
        // Se não tiver, encontra o produto no banco de dados e adiciona no carrinho
        const product = products.find(p => p.id === id);
        cart.push({ ...product, quantity: 1 });
    }

    // Manda atualizar a bolinha e o valor lá embaixo
    updateCartUI();
}

// Quando clica no botão + ou - dentro do carrinho
function changeQty(id, delta) {
    // Procura o item
    const item = cart.find(i => i.id === id);
    if (item) {
        // Soma ou subtrai a quantidade
        item.quantity += delta;
        // Se a quantidade zerar, joga fora do carrinho
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }

    // Atualiza o botão flutuante e o modal
    updateCartUI();
    renderCartItems();
}

// Atualiza o botão flutuante (O "Meu Pedido")
function updateCartUI() {
    const cartBtn = document.getElementById('cart-btn');

    // Soma a quantidade total de itens e o valor total
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalValue = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Se tiver item, mostra o botão. Senão, esconde.
    if (totalItems > 0) {
        cartBtn.classList.remove('hidden');
        document.getElementById('cart-count').innerText = totalItems;
        document.getElementById('cart-total').innerText = `R$ ${totalValue.toFixed(2)}`;
    } else {
        cartBtn.classList.add('hidden');
        document.getElementById('cart-modal').style.display = 'none';
    }
}


// ==========================================
// 4. LÓGICA DO MODAL (TELA DO CARRINHO)
// ==========================================

// Abre ou fecha o modal
function toggleCart() {
    if (cart.length === 0) return; // Proteção: Não abre se estiver vazio
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    // Sempre que abrir, desenha a lista atualizada
    renderCartItems();
}

// Desenha a lista de compras dentro do modal
function renderCartItems() {
    const itemsDiv = document.getElementById('cart-items');
    const totalValue = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    itemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-controls">
                <button class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
                <span class="qty-number">${item.quantity}</span>
                <button class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');

    document.getElementById('modal-total').innerText = `R$ ${totalValue.toFixed(2)}`;
}


// ==========================================
// 5. FECHAMENTO DO PEDIDO VIA WHATSAPP
// ==========================================

function sendOrder() {
    const address = document.getElementById('address').value;

    // Validação de endereço
    if (!address) {
        alert("Por favor, digite seu endereço para entrega!");
        return;
    }

    // Pega todos os itens e monta no formato: • 2x Burger Smash (R$ 56.00)
    const itemsText = cart.map(item => `• ${item.quantity}x ${item.name} (R$ ${(item.price * item.quantity).toFixed(2)})`).join('%0A');
    const totalValue = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Monta o texto bonitinho que vai aparecer lá no celular do dono
    const text = `*NOVO PEDIDO!* 🍔%0A%0A*Itens:*%0A${itemsText}%0A%0A*Total:* R$ ${totalValue.toFixed(2)}%0A%0A*Endereço de Entrega:*%0A${address}`;

    // Abre a tela do WhatsApp já com a mensagem pronta e o número preenchido
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}


// Inicializa a aplicação desenhando todos os itens ao carregar a página
renderMenu();