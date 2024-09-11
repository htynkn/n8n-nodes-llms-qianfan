import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class LmQianFanApi implements ICredentialType {
	name = 'lmQianFanApi';
	displayName = 'LmQianFanApi API';
	properties: INodeProperties[] = [
		{
			displayName: 'AK',
			name: 'ak',
			type: 'string',
			default: '',
		},
		{
			displayName: 'SK',
			name: 'sk',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
		},
	];
}
