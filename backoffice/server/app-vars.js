SuperPay = {
	producao: {
		url: 'https://superpay2.superpay.com.br/checkout/api/v2/transacao/',
		user: {
			login: "cupideias",
			senha: "FbP891bCE55Hl"
		},
		campainha: getCampainha('producao')
	},
	homologacao: {
		url: 'https://homologacao.superpay.com.br/checkout/api/v2/transacao/',
		user: {
			login: "superpay",
			senha: "superpay"
		},
		campainha: getCampainha('homologacao')
	}
};

function getCampainha(env) {
	if (Meteor.absoluteUrl().indexOf('homolog') > -1)
		return 'https://homolog.lojainteligente.com/api/campainha';

	switch(env) {
		case 'producao':
			return 'https://app.lojainteligente.com/api/campainha';
			break;
		case 'homologacao':
			return 'https://homolog.lojainteligente.com/api/campainha';
			break;
	}
}