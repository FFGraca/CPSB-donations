document.addEventListener('DOMContentLoaded', function() {
    const overallGoal = 4160000; // Objetivo total fixo
    let overallRaised = 50; // Começa com o exemplo inicial, se houver

    const causesData = {
        bus: { name: "Autocarro (Bus)", goal: 160000, raised: 50 }, // Exemplo inicial de doação
        elders: { name: "Edifício para Idosos", goal: 2500000, raised: 0 },
        children: { name: "Edifício para Crianças", goal: 1500000, raised: 0 }
    };

    const modal = document.getElementById('donation-modal');
    const modalTitle = document.getElementById('modal-title');
    const closeButton = document.querySelector('.close-button');
    const donationForm = document.getElementById('donation-form');
    const causeIdInput = document.getElementById('cause-id-input');
    const donationsList = document.getElementById('donations-list');

    const overallProgressText = document.getElementById('overall-progress').querySelector('.progress-text');
    const overallRaisedDisplay = document.getElementById('total-raised-display');

    // Função para abrir o modal
    function openModal(causeId, causeName) {
        causeIdInput.value = causeId;
        modalTitle.textContent = `Doar para ${causeName}`;
        donationForm.reset(); // Limpa o formulário
        modal.style.display = 'block';
    }

    // Função para fechar o modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Event listeners para os botões de doar
    document.querySelectorAll('.donate-button').forEach(button => {
        button.addEventListener('click', function() {
            const causeId = this.dataset.causeId;
            const causeName = this.dataset.causeName;
            openModal(causeId, causeName);
        });
    });

    // Event listener para o botão de fechar o modal
    closeButton.addEventListener('click', closeModal);

    // Fechar o modal se clicar fora do conteúdo
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Lidar com o envio do formulário de doação
    donationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const causeId = causeIdInput.value;
        const donorName = document.getElementById('donor-name').value;
        const donationAmount = parseFloat(document.getElementById('donation-amount').value);
        const isAnonymous = document.getElementById('anonymous-donation').checked;

        if (isNaN(donationAmount) || donationAmount <= 0) {
            alert('Por favor, insira uma quantia válida.');
            return;
        }

        const displayName = isAnonymous ? 'Anónimo' : donorName;
        const causeName = causesData[causeId].name;

        // Adicionar à lista de doações
        const listItem = document.createElement('li');
        listItem.textContent = `${displayName} doou ${donationAmount.toLocaleString('pt-PT')}€ para ${causeName}`;
        donationsList.appendChild(listItem);

        // Atualizar dados da causa
        causesData[causeId].raised += donationAmount;
        overallRaised += donationAmount;

        // Atualizar UI
        updateCauseUI(causeId);
        updateOverallUI();

        closeModal();
    });

    function updateCauseUI(causeId) {
        const cause = causesData[causeId];
        const causeElement = document.getElementById(`cause-${causeId}`);

        const raisedAmountEl = causeElement.querySelector('.raised-amount');
        const progressBarEl = causeElement.querySelector('.individual-progress');

        raisedAmountEl.textContent = cause.raised.toLocaleString('pt-PT');
        const percentage = cause.goal > 0 ? (cause.raised / cause.goal) * 100 : 0;
        progressBarEl.style.width = percentage.toFixed(2) + '%';
        progressBarEl.textContent = percentage.toFixed(2) + '%';
        if (percentage >= 100) progressBarEl.classList.add('full');
    }

    function updateOverallUI() {
        overallRaisedDisplay.textContent = `${overallRaised.toLocaleString('pt-PT')}€`;
        const percentage = overallGoal > 0 ? (overallRaised / overallGoal) * 100 : 0;
        overallProgressText.parentNode.style.width = percentage.toFixed(2) + '%';
        overallProgressText.textContent = `${overallRaised.toLocaleString('pt-PT')}€ / ${overallGoal.toLocaleString('pt-PT')}€ (${percentage.toFixed(2)}%)`;
        if (percentage >= 100) overallProgressText.parentNode.classList.add('full');
    }

    // Inicializar UI na carga da página
    function initializeUI() {
        Object.keys(causesData).forEach(causeId => {
            updateCauseUI(causeId);
        });
        updateOverallUI(); // Certifica-te que a barra geral também é inicializada corretamente
    }

    initializeUI();
});