// Função para carregar o arquivo JSON e exibir os contatos na tabela
function carregarArquivo() {
    const fileInput = document.getElementById('jsonFile');
    const fileList = fileInput.files;

    if (fileList.length === 0) {
        return;
    }

    const file = fileList[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const fileContent = event.target.result;
        const contatos = JSON.parse(fileContent);

        const listaContatos = document.getElementById('listaContatos');
        listaContatos.innerHTML = ''; // Limpa o conteúdo atual da tabela

        contatos.forEach(function (contato) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contato.nome}</td>
                <td>${contato.numero}</td>
                <td>${contato.enviado ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-circle-xmark"></i>'}</td>
            `;
            listaContatos.appendChild(row);
        });
    };

    reader.readAsText(file);
}

// Adicionar manipulador de evento ao botão "Carregar Arquivo"
document.addEventListener('DOMContentLoaded', function () {
    const btnCarregarArquivo = document.querySelector('#btnCarregarArquivo');
    btnCarregarArquivo.addEventListener('click', carregarArquivo);
});
function enviarImagem() {
    const listaContatos = document.getElementById('listaContatos');
    const rows = listaContatos.querySelectorAll('tr');
    const logField = document.getElementById('log');
    const intervaloMsg = 10 * 1000; //use somente valores acima de 2

    // Variável para rastrear o índice da mensagem sendo enviada
    let mensagemIndex = 0;

    logField.innerHTML += `<span style="color: #4caf50;">Aguarde enquanto conecta o servidor...</span><br>`;

    // Função para enviar a próxima mensagem após o intervalo de tempo
    function enviarProximaImagem() {
        if (mensagemIndex < rows.length) {
            const row = rows[mensagemIndex];
            const nome = row.cells[0].textContent;
            const telefone = row.cells[1].textContent;
            const enviado = row.cells[2].textContent;
    
            // Verifique se o contato ainda não foi enviado
            if (enviado.toLowerCase().trim() !== 'true') {
                const imagem = document.getElementById('imgFile').value;
                const urlimagem = encodeURIComponent(imagem);
                const mensagem = document.getElementById('imgMessage').value;
                const mensagemFormatada = mensagem.replace('<nome>', nome)
                const url = `http://18.220.56.26:5500/enviar-imagem?telefone=${telefone}&imagem=${urlimagem}&mensagem=${mensagemFormatada}`;
    
                // Faz a requisição HTTP para enviar a mensagem
                fetch(url, {
                    method: 'POST'
                })
                    .then(response => {
                        if (response.ok) {
                            // Atualiza a tabela para indicar que o contato foi enviado
                            row.cells[2].innerHTML = '<i class="fa-solid fa-check"></i>';
                            logField.innerHTML += `<span style="color: #4caf50;">Enviado para ${nome}</span><br>`;
                        } else {
                            console.error('Erro ao enviar mensagem para', nome);
                            logField.innerHTML += `<span style="color: #4caf50;">Erro ao enviar mensagem para ${nome}</span><br>`;
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao enviar mensagem para', nome, ':', error);
                        logField.innerHTML += `Erro ao enviar mensagem para ${nome}: ${error}<br>`;
                    });
            }
    
            // Incrementa o índice da mensagem
            mensagemIndex++;
    
            // Aguarda 10 segundos antes de enviar a próxima mensagem
            setTimeout(enviarProximaImagem, 10000); // 10000 milissegundos = 10 segundos
        } else {
            // Quando todas as mensagens forem enviadas, exibe a mensagem de conclusão
            logField.innerHTML += `<span style="color: #4caf50;">Envio concluído com sucesso!</span><br>`;
            logField.innerHTML += `<span style="color: #4caf50;">Foram enviadas ${rows.length} mensagens.</span><br>`;
        }
    }
    
    // Inicie o envio da primeira mensagem
    enviarProximaImagem();
}
function enviarAudio() {
    const listaContatos = document.getElementById('listaContatos');
    const rows = listaContatos.querySelectorAll('tr');
    const logField = document.getElementById('log');
    const intervaloMsg = 10 * 1000; // use somente valores acima de 2

    // Variável para rastrear o índice da mensagem sendo enviada
    let mensagemIndex = 0;

    logField.innerHTML += `<span style="color: #4caf50;">Aguarde enquanto conecta o servidor...</span><br>`;

    // Função para enviar o próximo áudio após o intervalo de tempo
    function enviarProximoAudio() {
        if (mensagemIndex < rows.length) {
            const row = rows[mensagemIndex];
            const nome = row.cells[0].textContent;
            const telefone = row.cells[1].textContent;
            const enviado = row.cells[2].textContent;

            // Verifique se o contato ainda não foi enviado
            if (enviado.toLowerCase().trim() !== 'true') {
                const audio = document.getElementById('audioFile').value;
                const url = `http://18.220.56.26:5500/enviar-audio?telefone=${telefone}&audio=${audio}`;

                // Faz a requisição HTTP para enviar o áudio
                fetch(url, {
                    method: 'POST',
                })
                .then(response => {
                    if (response.ok) {
                        // Atualiza a tabela para indicar que o contato foi enviado
                        row.cells[2].innerHTML = '<i class="fa-solid fa-check"></i>';
                        logField.innerHTML += `<span style="color: #4caf50;">Enviado para ${nome}</span><br>`;
                    } else {
                        console.error('Erro ao enviar áudio para', nome);
                        logField.innerHTML += `<span style="color: #4caf50;">Erro ao enviar áudio para ${nome}</span><br>`;
                    }
                })
                .catch(error => {
                    console.error('Erro ao enviar áudio para', nome, ':', error);
                    logField.innerHTML += `Erro ao enviar áudio para ${nome}: ${error}<br>`;
                });
            }

            // Incrementa o índice da mensagem
            mensagemIndex++;

            // Aguarda 10 segundos antes de enviar o próximo áudio
            setTimeout(enviarProximoAudio, 10000); // 10000 milissegundos = 10 segundos
        } else {
            // Quando todos os áudios forem enviados, exibe a mensagem de conclusão
            logField.innerHTML += `<span style="color: #4caf50;">Envio de áudios concluído com sucesso!</span><br>`;
            logField.innerHTML += `<span style="color: #4caf50;">Foram enviados ${rows.length} áudios.</span><br>`;
        }
    }

    // Inicia o envio do primeiro áudio
    enviarProximoAudio();
}

function enviarMensagens() {
    const listaContatos = document.getElementById('listaContatos');
    const rows = listaContatos.querySelectorAll('tr');
    const logField = document.getElementById('log');
    const intervaloMsg = 10 * 1000; //use somente valores acima de 2

    // Variável para rastrear o índice da mensagem sendo enviada
    let mensagemIndex = 0;

    logField.innerHTML += `<span style="color: #4caf50;">Aguarde enquanto conecta o servidor...</span><br>`;

    // Função para enviar a próxima mensagem após o intervalo de tempo
    function enviarProximaMensagem() {
        if (mensagemIndex < rows.length) {
            const row = rows[mensagemIndex];
            const nome = row.cells[0].textContent;
            const telefone = row.cells[1].textContent;
            const enviado = row.cells[2].textContent;
    
            // Verifique se o contato ainda não foi enviado
            if (enviado.toLowerCase().trim() !== 'true') {
                const mensagem = document.getElementById('textMessage').value;
                const mensagemFormatada = mensagem.replace('<nome>', nome).replace('<telefone>', telefone);
                const url = `http://18.220.56.26:5500/enviar-mensagem?telefone=${telefone}&mensagem=${mensagemFormatada}`;
    
                // Faz a requisição HTTP para enviar a mensagem
                fetch(url, {
                    method: 'POST'
                })
                    .then(response => {
                        if (response.ok) {
                            // Atualiza a tabela para indicar que o contato foi enviado
                            row.cells[2].innerHTML = '<i class="fa-solid fa-check"></i>';
                            logField.innerHTML += `<span style="color: #4caf50;">Enviado para ${nome}</span><br>`;
                        } else {
                            console.error('Erro ao enviar mensagem para', nome);
                            logField.innerHTML += `<span style="color: #4caf50;">Erro ao enviar mensagem para ${nome}</span><br>`;
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao enviar mensagem para', nome, ':', error);
                        logField.innerHTML += `Erro ao enviar mensagem para ${nome}: ${error}<br>`;
                    });
            }
    
            // Incrementa o índice da mensagem
            mensagemIndex++;
    
            // Aguarda 10 segundos antes de enviar a próxima mensagem
            setTimeout(enviarProximaMensagem, intervaloMsg); // 10000 milissegundos = 10 segundos
        } else {
            // Quando todas as mensagens forem enviadas, exibe a mensagem de conclusão
            logField.innerHTML += `<span style="color: #4caf50;">Envio concluído com sucesso!</span><br>`;
            logField.innerHTML += `<span style="color: #4caf50;">Foram enviadas ${rows.length} mensagens.</span><br>`;
        }
    }
    
    // Inicie o envio da primeira mensagem
    enviarProximaMensagem();
}