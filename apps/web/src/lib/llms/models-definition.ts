const models = [
	{
		default: true,
		name: 'Base model',
		description: 'model1 description',
		code: '001',
	}, {
		default: false,
		name: 'Model Pháp luật',
		description: 'model2 description',
		code: '002',
	}
];
const modelsEnum = {
	'001': 'Base model',
	'002': 'Model_phap_luat',
}

const validateModel = (model: string) => {
	return Boolean(modelsEnum[model as keyof typeof modelsEnum]);
	
}

export { models, modelsEnum, validateModel };