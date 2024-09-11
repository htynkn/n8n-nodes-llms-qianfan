pnpm install
npm run build
pnpm link --global n8n-nodes-llms-qianfan
mkdir -p ~/.n8n/custom && cd ~/.n8n/custom
rm -rf node_modules
npm link n8n-nodes-llms-qianfan