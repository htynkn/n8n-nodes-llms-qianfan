import {
	NodeConnectionType,
	INodeProperties,
	type IExecuteFunctions,
	type INodeType,
	type INodeTypeDescription,
	type SupplyData,
} from 'n8n-workflow';

import { ChatBaiduQianfan } from '@langchain/baidu-qianfan';

const qianfanModel: INodeProperties = {
	displayName: 'Model',
	name: 'model',
	type: 'options',
	// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
	options: [
		{
			name: 'ERNIE-SPEED-8K',
			value: 'ERNIE-SPEED-8K',
		},
		{
			name: 'ERNIE-SPEED-128K',
			value: 'ERNIE-SPEED-128K',
		},
	],
	description: 'The model which will generate the completion',
	default: 'ERNIE-SPEED-8K',
}

export const qianfanOptions: INodeProperties = {
	displayName: 'Options',
	name: 'options',
	placeholder: 'Add Option',
	description: 'Additional options to add',
	type: 'collection',
	default: {},
	options: [
		{
			displayName: 'Temperature',
			name: 'temperature',
			default: 0.95,
			typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 2 },
			description:
				'Amount of randomness injected into the response. Ranges from 0 to 1 (0 is not included). Use temp closer to 0 for analytical / multiple choice, and temp closer to 1 for creative and generative tasks',
			type: 'number',
		},
		{
			displayName: 'Top P',
			name: 'topP',
			default: 0.8,
			typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
			description:
				'Total probability mass of tokens to consider at each step. Range from 0 to 1.0.',
			type: 'number',
		},
		{
			displayName: 'Penalty Score',
			name: 'penaltyScore',
			type: 'number',
			default: 1.0,
			typeOptions: { maxValue: 2, minValue: 1, numberPrecision: 1 },
			description:
				'Penalizes repeated tokens according to frequency. Range from 1.0 to 2.0. Defaults to 1.0',
		},
	],
};

export class LmChatQianFan implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'QianFan Chat Model',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-name-miscased
		name: 'lmChatQianFan',
		icon: 'file:qianfan.svg',
		group: ['transform'],
		version: 1,
		description: 'Language Model QianFan',
		defaults: {
			name: 'QianFan Chat Model',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Language Models', 'Root Nodes'],
				'Language Models': ['Chat Models (Recommended)'],
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: [NodeConnectionType.AiLanguageModel],
		outputNames: ['Model'],
		credentials: [
			{
				name: 'lmQianFanApi',
				required: true,
			},
		],
		properties: [
			qianfanModel,
			qianfanOptions,
		],
	};

	async supplyData(this: IExecuteFunctions, itemIndex: number): Promise<SupplyData> {
		const credentials = await this.getCredentials('lmQianFanApi');
		const modelName = this.getNodeParameter('model', itemIndex) as string;

		const options = this.getNodeParameter('options', itemIndex, {}) as {
			temperature?: number;
			topP?: number;
			penaltyScore?: number;
		};

		const model = new ChatBaiduQianfan({
			qianfanAccessKey: credentials.ak as string,
			qianfanSecretKey: credentials.sk as string,
			modelName: modelName,
			...options,
		});

		return {
			response: model,
		};
	}
}
