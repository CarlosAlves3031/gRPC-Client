function openTab(tabName) {
    // Esconde todos os conteúdos de tab
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }
    
    // Remove a classe 'active' de todos os botões
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // Mostra a tab atual e marca o botão como ativo
    document.getElementById(tabName).style.display = 'block';
    event.currentTarget.classList.add('active');
}

// Cadastro de remédio
document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const remedio = {
        nome: document.getElementById('nome').value,
        via: document.getElementById('via').value,
        lote: document.getElementById('lote').value,
        quantidade: parseInt(document.getElementById('quantidade').value),
        validade: document.getElementById('validade').value,
        laboratorio: document.getElementById('laboratorio').value
    };
    
    try {
        const response = await fetch('/api/remedios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(remedio)
        });
        
        const data = await response.json();
        
        document.getElementById('cadastroResult').innerHTML = `
            <div class="success">
                <p>Remédio cadastrado com sucesso!</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
        
        // Limpa o formulário
        document.getElementById('formCadastro').reset();
    } catch (error) {
        document.getElementById('cadastroResult').innerHTML = `
            <div class="error">
                <p>Erro ao cadastrar remédio:</p>
                <p>${error.message}</p>
            </div>
        `;
    }
});

// Listagem de remédios
async function carregarRemedios() {
    try {
        const response = await fetch('/api/remedios');
        const remedios = await response.json();
        
        const listaDiv = document.getElementById('listaRemedios');
        if (remedios.length === 0) {
            listaDiv.innerHTML = '<p>Nenhum remédio cadastrado.</p>';
            return;
        }
        
        let html = '<div class="remedio-list">';
        remedios.forEach(remedio => {
            html += `
                <div class="remedio-item">
                    <span>${remedio.id} - ${remedio.nome}</span>
                    <button onclick="mostrarDetalhes(${remedio.id})">Detalhes</button>
                </div>
            `;
        });
        html += '</div>';
        
        listaDiv.innerHTML = html;
    } catch (error) {
        document.getElementById('listaRemedios').innerHTML = `
            <div class="error">
                <p>Erro ao carregar remédios:</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Detalhes de um remédio
async function buscarDetalhes() {
    const id = document.getElementById('idDetalhe').value;
    if (!id) return;
    
    try {
        const response = await fetch(`/api/remedios/${id}`);
        const remedio = await response.json();
        
        document.getElementById('detalhesRemedio').innerHTML = `
            <div class="remedio-detalhes">
                <h3>${remedio.nome}</h3>
                <p><strong>ID:</strong> ${remedio.id}</p>
                <p><strong>Via:</strong> ${remedio.via}</p>
                <p><strong>Lote:</strong> ${remedio.lote}</p>
                <p><strong>Quantidade:</strong> ${remedio.quantidade}</p>
                <p><strong>Validade:</strong> ${remedio.validade}</p>
                <p><strong>Laboratório:</strong> ${remedio.laboratorio}</p>
                <p><strong>Status:</strong> ${remedio.ativo ? 'Ativo' : 'Inativo'}</p>
            </div>
        `;
    } catch (error) {
        document.getElementById('detalhesRemedio').innerHTML = `
            <div class="error">
                <p>Erro ao buscar remédio:</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Função para mostrar detalhes a partir da lista
async function mostrarDetalhes(id) {
    document.getElementById('idDetalhe').value = id;
    openTab('detalhar');
    buscarDetalhes();
}