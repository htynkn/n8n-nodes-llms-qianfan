import {
	NodeConnectionType,
	INodeProperties,
	type IExecuteFunctions,
	type INodeType,
	type INodeTypeDescription,
	type SupplyData,
} from 'n8n-workflow';

import { ChatBaiduQianfan } from '@langchain/baidu-qianfan';

const modelField: INodeProperties = {
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

export class LmChatQianFan implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'QianFan Chat Model',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-name-miscased
		name: 'lmChatQianFan',
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
			{
				...modelField
			}
		],
	};

	async supplyData(this: IExecuteFunctions, itemIndex: number): Promise<SupplyData> {
		const credentials = await this.getCredentials('lmQianFanApi');
		const modelName = this.getNodeParameter('model', itemIndex) as string;

		const model = new ChatBaiduQianfan({
			qianfanAccessKey: credentials.ak as string,
			qianfanSecretKey: credentials.sk as string,
			modelName: modelName,
		});

		return {
			response: model,
		};
	}
}
