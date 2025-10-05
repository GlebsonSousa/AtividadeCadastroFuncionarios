document.addEventListener('DOMContentLoaded', () => {

    const btnBuscar = document.getElementById('btn_filtrar');
    const btnVoltar = document.getElementById('btn_voltar');
    const inputBusca = document.getElementById('filtro_nome');
    const tabelaBody = document.querySelector('.tabela tbody');
    const voltar = document.getElementById("btn_voltar")

    voltar.addEventListener("click", function() {
        window.location.href = "../formulario.html";
    })

    if (btnBuscar) {
        btnBuscar.addEventListener('click', async (e) => {
            e.preventDefault();

            const termo = inputBusca.value.trim();

            if (termo === '') {
                alert('Por favor, digite o nome ou número de registro para buscar.');
                return;
            }

            console.log(`🔎 Buscando funcionários com termo: "${termo}"...`);
            await buscarFuncionario(termo);
        });
    }

    async function buscarFuncionario(termo) {
        const url = `https://servidorativcadfuncionariosphp.onrender.com/busca_func.php?termo=${encodeURIComponent(termo)}`;

        try {
            const resposta = await fetch(url, { method: 'GET' });

            console.log('📡 Status HTTP:', resposta.status);

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

    // --- 4. Função que insere os dados na tabela ---
    function atualizarTabela(funcionarios) {
        tabelaBody.innerHTML = ''; // limpa resultados antigos

        funcionarios.forEach(func => {
            const tr = document.createElement('tr');

            // Cálculo do INSS (só exemplo)
            const salario = parseFloat(func.salario || 0);
            const inss = salario * 0.11;
            const liquido = salario - inss;

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

    // --- 5. Função auxiliar para formatar data ---
    function formatarData(dataString) {
        if (!dataString) return '-';
        const data = new Date(dataString);
        if (isNaN(data)) return dataString; // se vier em formato não reconhecido
        return data.toLocaleDateString('pt-BR');
    }

    // --- 6. Botão Voltar ---
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            location.href = "/index.html";
            console.log('↩️ Voltando para a página inicial...');
        });
    }
});
