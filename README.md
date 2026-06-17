# Meu Portão IA

MVP navegável para visualizar estilos de portões em fachadas e captar pedidos de orçamento.

Site publicado: https://meu-portao-ia.vercel.app

## Backend

O MVP usa Convex para salvar:

- pedidos de orçamento dos moradores
- cadastros de empresas parceiras

As fotos enviadas no simulador são transmitidas ao endpoint Convex para gerar a simulação com a OpenAI, mas não são salvas no banco deste MVP.

Para produção, configure `VITE_CONVEX_URL` e `VITE_CONVEX_SITE_URL` na Vercel com as URLs da implantação Convex cloud/site. Configure também `OPENAI_API_KEY` no ambiente do Convex para liberar a geração de imagens.

## Rodar localmente

1. Instale as dependências:
   `npm install`
2. Configure o Convex:
   `npx convex dev --once`
3. Inicie o projeto:
   `npm run dev`
4. Abra o endereço exibido no terminal.

## Páginas

- `/` - Landing page
- `/simular` - Upload, preferências, geração simulada e formulário de lead
- `/empresas` - Benefícios, planos e cadastro de parceiros
- `/privacidade` - Política de privacidade do MVP

O código contém pontos preparados para futuras integrações de geração de imagem, storage de fotos e CRM.
