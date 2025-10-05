document.addEventListener('DOMContentLoaded', () => {

    const btnBuscar = document.getElementById('btn_filtrar');
    const btnVoltar = document.getElementById('btn_voltar');
    const inputBusca = document.getElementById('filtro_nome');
    const tabelaBody = document.querySelector('.tabela tbody');

    buscarFuncionarioTodos();

    async function buscarFuncionarioTodos() {
        const url = `https://servidorativcadfuncionariosphp.onrender.com/retornaTudo.php`;

        try {
            const resposta = await fetch(url, { method: 'GET' });
            const dados = await resposta.json();

            if (resposta.ok && Array.isArray(dados)) {
                atualizarTabela(dados);
            } else {
                tabelaBody.innerHTML = `
                    <tr>
                        <td colspan="8" style="text-align:center; color:red;">Nenhum funcionário encontrado</td>
                    </tr>
                `;
            }
        } catch (erro) {
            console.error('❌ Erro ao buscar funcionários:', erro);
            tabelaBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center; color:red;">Erro ao conectar ao servidor</td>
                </tr>
            `;
        }
    }

    if (btnBuscar) {
        btnBuscar.addEventListener('click', async (e) => {
            e.preventDefault();
            const termo = inputBusca.value.trim();
            await buscarFuncionario(termo);
        });
    }

    inputBusca.addEventListener('keydown', (e) => {
        const tecla = e.key;
        const teclaPermitida = /^[a-zA-Z0-9]$/.test(tecla);

        if (tecla === 'Enter') {
            e.preventDefault();
            btnBuscar.click();
        } else if (teclaPermitida) {
            setTimeout(() => {
                const termo = inputBusca.value.trim();
                buscarFuncionario(termo);
            }, 100);
        }
    });

    async function buscarFuncionario(termo) {
        let url = termo 
            ? `https://servidorativcadfuncionariosphp.onrender.com/listagem.php?termo=${encodeURIComponent(termo)}`
            : `https://servidorativcadfuncionariosphp.onrender.com/retornaTudo.php`;

        try {
            const resposta = await fetch(url, { method: 'GET' });
            const dados = await resposta.json();

            if (resposta.ok && Array.isArray(dados)) {
                atualizarTabela(dados);
            } else {
                tabelaBody.innerHTML = `
                    <tr>
                        <td colspan="8" style="text-align:center; color:red;">Nenhum funcionário encontrado</td>
                    </tr>
                `;
            }
        } catch (erro) {
            console.error('❌ Erro ao buscar funcionários:', erro);
            tabelaBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center; color:red;">Erro ao conectar ao servidor</td>
                </tr>
            `;
        }
    }

    function atualizarTabela(funcionarios) {
        tabelaBody.innerHTML = '';
        funcionarios.forEach(func => {
            const tr = document.createElement('tr');

            const salario = parseFloat(func.salario || 0);
            const inss = parseFloat(func.inss || salario * 0.11);
            const liquido = parseFloat(func.salario_liquido || salario - inss);

            tr.innerHTML = `
                <td>${func.n_registro}</td>
                <td>${func.nome_funcionario}</td>
                <td>${formatarData(func.data_admissao)}</td>
                <td>${func.cargo}</td>
                <td>R$ ${salario.toFixed(2).replace('.', ',')}</td>
                <td>R$ ${inss.toFixed(2).replace('.', ',')}</td>
                <td>R$ ${liquido.toFixed(2).replace('.', ',')}</td>
                <td class="apagar" style="cursor:pointer;">X</td>
            `;
            tabelaBody.appendChild(tr);
        });
        console.table(funcionarios);
    }

    function formatarData(dataString) {
        if (!dataString) return '-';
        const data = new Date(dataString);
        if (isNaN(data)) return dataString;
        return data.toLocaleDateString('pt-BR');
    }

    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            window.location.href = "../formulario.html";
        });
    }
});
