function getEligibilityInfo() {
  return {
    ultimoAgendamento: '2025-12-15',
    podeDoar: true,
    recomendacao: 'Elegível para nova doação a partir de 2026-02-10.',
    regras: {
      idadePrimeiraDivaMin: 18,
      idadePrimeiraDivaMax: 60,
      pesoMinimoKg: 50,
      esperaTatuagemPiercingMeses: 4,
      esperaGripeDias: 7,
      esperaAntibioticoDias: 7,
    },
  };
}

function evaluateDonationEligibility(input) {
  const reasons = [];

  if (input.age < 18 || input.age > 65) {
    reasons.push('A idade deve estar entre 18 e 65 anos.');
  }

  if (input.firstDonation && input.age > 60) {
    reasons.push('Para a primeira dádiva, a idade máxima é 60 anos.');
  }

  if (input.weightKg < 50) {
    reasons.push('O peso deve ser igual ou superior a 50kg.');
  }

  if (input.anemia) {
    reasons.push('Não pode doar se tiver anemia.');
  }

  if (input.hadTattooOrPiercingRecently) {
    reasons.push('Aguarde 4 meses após tatuagem/piercing.');
  }

  if (input.hadFluOrFeverLast7Days) {
    reasons.push('Aguarde pelo menos 7 dias após o fim de gripe/febre.');
  }

  if (input.finishedAntibioticsLast7Days) {
    reasons.push('Aguarde 7 dias após terminar antibióticos.');
  }

  return {
    canDonate: reasons.length === 0,
    reasons,
    message:
      reasons.length === 0
        ? 'Elegível para doar sangue, sujeito à triagem clínica no dia da dádiva.'
        : 'Não elegível de momento. Verifique os motivos indicados.',
  };
}

module.exports = {
  getEligibilityInfo,
  evaluateDonationEligibility,
};
