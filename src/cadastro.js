document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELEÇÃO DOS ELEMENTOS DO FORMULÁRIO ---
    const cadastrarBtn = document.getElementById('btn_cadastrar');
    const form = document.querySelector('form'); // Seleciona o formulário para poder limpá-lo


    // --- Funções de validação --- //
    function validaRegistro(valor) {
        return /^[0-9]+$/.test(valor); // apenas números
    }

    function validaNome(nome) {
        return nome.length >= 3; // mínimo 3 caracteres
    }

    function validaData(data) {
        return data !== ''; // apenas verifica se foi preenchida
    }

    function validaSalarios(valor) {
        return /^[0-9]+([.,][0-9]+)?$/.test(valor); // número com ponto ou vírgula
    }

    // --- 2. EVENTO DE CLIQUE NO BOTÃO CADASTRAR ---
    cadastrarBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário

        // Pega os valores atuais dos campos no momento do clique
        const campoRegistro = document.getElementById("numero_registro").value.trim();
        const campoNome = document.getElementById("nome_funcionario").value.trim();
        const campoDataAdm = document.getElementById("data_adm").value.trim();
        const campoCargo = document.getElementById("cargo").value.trim();
        const campoQtdSal = document.getElementById("salario").value.trim();

        // --- 3. VALIDAÇÃO DOS CAMPOS ---
        if (!validaRegistro(campoRegistro)) {
            alert("Por favor, insira um Nº de Registro válido (apenas números).");
            return;
        }
        if (!validaNome(campoNome)) {
            alert("O nome do funcionário precisa ter pelo menos 3 caracteres.");
            return;
        }
        if (!validaData(campoDataAdm)) {
            alert("Por favor, selecione uma data de admissão.");
            return;
        }
        if (campoQtdSal === '' || !validaSalarios(campoQtdSal)) {
            alert("Por favor, insira uma Quantidade de Salários Mínimos válida (ex: 2 ou 2,5).");
            return;
        }
        
        // Se todas as validações passarem, envia os dados
        await enviaDadosParaBackend(campoRegistro, campoNome, campoDataAdm, campoCargo, campoQtdSal);
    });

    // --- 4. FUNÇÃO PARA ENVIAR OS DADOS AO BACKEND ---
    async function enviaDadosParaBackend(registro, nome, data, cargo, salarios) {
        const formData = new FormData();
        formData.append('n_registro', registro);
        formData.append('nome_funcionario', nome);
        formData.append('data_admissao', data);
        formData.append('cargo', cargo);
        formData.append('salario', salarios);

        const urlBackend = 'https://servidorativcadfuncionariosphp.onrender.com/gravar.php';

        try {
            const resposta = await fetch(urlBackend, {
                method: 'POST',
                body: formData 
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(resultado.msg || "Cadastro realizado com sucesso!");
                if (form) form.reset();
            } else {
                alert(`Erro ao cadastrar: ${resultado.erro}`);
            }

        } catch (error) {
            console.error('Houve um problema com a requisição fetch:', error);
            alert('Erro de conexão ou problema na comunicação com o servidor. Tente novamente.');
        }
    }

});
